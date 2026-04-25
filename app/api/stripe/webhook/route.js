import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature error' }, { status: 400 })
  }

  console.log('✅ Stripe webhook event received:', event.type)
  console.log('📦 Full event data:', JSON.stringify(event.data.object, null, 2))

  async function saveUser(clerkUserId, updates) {
    console.log('🔍 saveUser called with clerkUserId:', clerkUserId)
    console.log('🔍 saveUser updates:', JSON.stringify(updates, null, 2))

    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .maybeSingle()                          // ✅ won't throw on 0 rows

    console.log('🔍 Existing user lookup result:', JSON.stringify(existing, null, 2))
    console.log('🔍 Existing user lookup error:', JSON.stringify(selectError, null, 2))

    if (selectError) {
      console.error('❌ Error checking existing user:', selectError)
      throw new Error(`Supabase select error: ${selectError.message}`)
    }

    if (existing) {
      console.log('📝 User exists, performing UPDATE...')
      const { data: updated, error: updateError } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('clerk_user_id', clerkUserId)
        .select()

      if (updateError) {
        console.error('❌ Supabase UPDATE error:', JSON.stringify(updateError, null, 2))
        throw new Error(`Supabase update error: ${updateError.message}`)
      }
      console.log('✅ Supabase UPDATE success:', JSON.stringify(updated, null, 2))
      return updated
    } else {
      console.log('📝 User not found, performing INSERT...')
      const { data: inserted, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: uuidv4(),                        // ✅ provide id explicitly
          clerk_user_id: clerkUserId,
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (insertError) {
        console.error('❌ Supabase INSERT error:', JSON.stringify(insertError, null, 2))
        throw new Error(`Supabase insert error: ${insertError.message}`)
      }
      console.log('✅ Supabase INSERT success:', JSON.stringify(inserted, null, 2))
      return inserted
    }
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('🛒 checkout.session.completed fired')
      console.log('🛒 session.metadata:', JSON.stringify(session.metadata, null, 2))
      console.log('🛒 session.subscription:', session.subscription)
      console.log('🛒 session.customer:', session.customer)

      const clerkUserId = session.metadata?.clerk_user_id
      const plan = session.metadata?.plan

      console.log('🔑 clerk_user_id:', clerkUserId)
      console.log('📋 plan:', plan)

      if (!clerkUserId) {
        console.error('❌ CRITICAL: No clerk_user_id in session.metadata')
        return NextResponse.json({ received: true, warning: 'No clerk_user_id in metadata' })
      }

      if (!plan) {
        console.error('❌ CRITICAL: No plan in session.metadata')
        return NextResponse.json({ received: true, warning: 'No plan in metadata' })
      }

      console.log('🔌 Testing Supabase connection...')
      const { data: testData, error: testError } = await supabase.from('users').select('count').limit(1)
      console.log('🔌 Supabase connection test result:', JSON.stringify(testData, null, 2))
      console.log('🔌 Supabase connection test error:', JSON.stringify(testError, null, 2))

      await saveUser(clerkUserId, {
        plan,
        plan_status: 'active',
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
      })

      console.log('✅ checkout.session.completed handler finished successfully')
    }

    else if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object
      console.log('🔄 customer.subscription.updated fired')
      console.log('🔄 sub.id:', sub.id)
      console.log('🔄 sub.status:', sub.status)
      console.log('🔄 sub.metadata:', JSON.stringify(sub.metadata, null, 2))
      console.log('🔄 sub.customer:', sub.customer)

      let clerkUserId = null

      if (sub.metadata?.clerk_user_id) {
        clerkUserId = sub.metadata.clerk_user_id
        console.log('✅ Got clerk_user_id from sub.metadata:', clerkUserId)
      } else {
        console.log('⚠️ No clerk_user_id in sub.metadata, trying customer metadata...')
        try {
          const customer = await stripe.customers.retrieve(sub.customer)
          console.log('🔍 Customer metadata:', JSON.stringify(customer.metadata, null, 2))
          clerkUserId = customer.metadata?.clerk_user_id
          if (clerkUserId) console.log('✅ Got clerk_user_id from customer.metadata:', clerkUserId)
        } catch (err) {
          console.error('❌ Failed to retrieve customer from Stripe:', err)
        }
      }

      if (!clerkUserId) {
        console.log('⚠️ Still no clerk_user_id, trying Supabase lookup by stripe_customer_id...')
        const { data: found, error: lookupError } = await supabase
          .from('users')
          .select('clerk_user_id')
          .eq('stripe_customer_id', sub.customer)
          .maybeSingle()
        console.log('🔍 Supabase lookup result:', JSON.stringify(found, null, 2))
        console.log('🔍 Supabase lookup error:', JSON.stringify(lookupError, null, 2))
        clerkUserId = found?.clerk_user_id
      }

      if (!clerkUserId) {
        console.error('❌ CRITICAL: Could not resolve clerk_user_id for subscription update')
        return NextResponse.json({ received: true, warning: 'clerk_user_id not found' })
      }

      const priceId = sub.items.data[0]?.price?.id
      console.log('💰 Price ID from subscription:', priceId)

      let plan = 'free'
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID) plan = 'growth'
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID) plan = 'scale'
      console.log('📋 Resolved plan:', plan)

      await saveUser(clerkUserId, {
        plan: sub.status === 'active' ? plan : 'free',
        plan_status: sub.status,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer,
      })

      console.log('✅ customer.subscription.updated handler finished successfully')
    }

    else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object
      console.log('🗑️ customer.subscription.deleted fired')

      let clerkUserId = null

      if (sub.metadata?.clerk_user_id) {
        clerkUserId = sub.metadata.clerk_user_id
      } else {
        try {
          const customer = await stripe.customers.retrieve(sub.customer)
          clerkUserId = customer.metadata?.clerk_user_id
        } catch (err) {
          console.error('❌ Failed to retrieve customer:', err)
        }
      }

      if (!clerkUserId) {
        const { data: found } = await supabase
          .from('users')
          .select('clerk_user_id')
          .eq('stripe_customer_id', sub.customer)
          .maybeSingle()
        clerkUserId = found?.clerk_user_id
      }

      if (!clerkUserId) {
        console.error('❌ CRITICAL: Could not resolve clerk_user_id for subscription deletion')
        return NextResponse.json({ received: true, warning: 'clerk_user_id not found' })
      }

      await saveUser(clerkUserId, {
        plan: 'free',
        plan_status: 'canceled',
        stripe_subscription_id: null,
      })

      console.log('✅ customer.subscription.deleted handler finished successfully')
    }

    else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      console.log('💸 invoice.payment_failed fired')

      let clerkUserId = null

      try {
        const customer = await stripe.customers.retrieve(invoice.customer)
        clerkUserId = customer.metadata?.clerk_user_id
      } catch (err) {
        console.error('❌ Failed to retrieve customer:', err)
      }

      if (!clerkUserId) {
        const { data: found } = await supabase
          .from('users')
          .select('clerk_user_id')
          .eq('stripe_customer_id', invoice.customer)
          .maybeSingle()
        clerkUserId = found?.clerk_user_id
      }

      if (!clerkUserId) {
        console.error('❌ CRITICAL: Could not resolve clerk_user_id for payment failure')
        return NextResponse.json({ received: true, warning: 'clerk_user_id not found' })
      }

      await saveUser(clerkUserId, { plan_status: 'past_due' })
      console.log('✅ invoice.payment_failed handler finished successfully')
    }

    else {
      console.log('ℹ️ Unhandled event type:', event.type)
    }

  } catch (err) {
    console.error('❌ WEBHOOK HANDLER CRASHED:', err.message)
    console.error('❌ Stack trace:', err.stack)
    return NextResponse.json({ received: true, error: err.message }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}