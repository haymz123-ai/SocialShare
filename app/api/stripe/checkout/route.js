import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId, plan } = await req.json()

  console.log('🛒 Creating checkout session...')
  console.log('🔑 userId (clerk):', userId)
  console.log('📋 plan:', plan)
  console.log('💰 priceId:', priceId)

  if (!priceId || !plan) {
    return NextResponse.json({ error: 'Missing priceId or plan' }, { status: 400 })
  }

  // Look up user, using maybeSingle to avoid throwing on missing row
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('clerk_user_id', userId)
    .maybeSingle()                            // ✅ safe — returns null instead of error

  console.log('🔍 Supabase user lookup:', JSON.stringify(user, null, 2))
  console.log('🔍 Supabase user lookup error:', JSON.stringify(userError, null, 2))

  let customerId = user?.stripe_customer_id

  if (!customerId) {
    console.log('📝 No existing Stripe customer, creating new one...')
    const customer = await stripe.customers.create({
      metadata: { clerk_user_id: userId },
    })
    customerId = customer.id
    console.log('✅ Created Stripe customer:', customerId)

    // Upsert so we never get a duplicate-insert race condition
    const { data: saved, error: saveError } = await supabase
      .from('users')
      .upsert(
        {
          id: uuidv4(),                        // ✅ provide id explicitly
          clerk_user_id: userId,
          stripe_customer_id: customerId,
          plan: 'free',
          plan_status: 'inactive',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }        // ✅ update if row already exists
      )
      .select()

    console.log('✅ Upserted user to Supabase:', JSON.stringify(saved, null, 2))
    if (saveError) console.error('❌ Failed to upsert user:', JSON.stringify(saveError, null, 2))
  } else {
    console.log('✅ Found existing Stripe customer:', customerId)
    try {
      await stripe.customers.update(customerId, {
        metadata: { clerk_user_id: userId },
      })
      console.log('✅ Updated customer metadata with clerk_user_id')
    } catch (err) {
      console.error('❌ Failed to update customer metadata:', err)
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      clerk_user_id: userId,
      plan: plan,
    },
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
        plan: plan,
      },
    },
  })

  console.log('✅ Checkout session created:', session.id)
  console.log('✅ Session URL:', session.url)

  return NextResponse.json({ url: session.url })
}