// lib/getUserPlan

import { supabase } from './supabase'

export async function getUserPlan(userId) {
  const { data } = await supabase
    .from('users')
    .select('plan, plan_status, stripe_customer_id, stripe_subscription_id')
    .eq('clerk_user_id', userId)
    .single()

  if (!data) return 'free'
  if (data.plan_status === 'canceled' || data.plan_status === 'past_due') return 'free'
  return data.plan || 'free'
}

export async function ensureUser(userId) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!data) {
    await supabase.from('users').insert({ clerk_user_id: userId, plan: 'free' })
  }
}