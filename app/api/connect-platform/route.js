import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { getUserPlan } from '../../../lib/getUserPlan'
import { getPlan } from '../../../lib/plans'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { groupId, platform, redirectUrl } = await req.json()

  const plan = await getUserPlan(userId)
  const limits = getPlan(plan)

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  // Count total profiles across ALL workspaces for this user
  const allGroupsRes = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('clerk_user_id', userId)

  let totalProfiles = 0
  for (const g of (allGroupsRes.data || [])) {
    const ppRes = await fetch(`${PP_BASE}/profiles?profile_group_id=${g.postproxy_group_id}`, {
      headers: { Authorization: `Bearer ${PP_KEY}` },
    })
    const ppData = await ppRes.json()
    const profiles = Array.isArray(ppData) ? ppData : (ppData.data || [])
    totalProfiles += profiles.length
  }

  if (limits.maxProfiles !== Infinity && totalProfiles >= limits.maxProfiles) {
    return NextResponse.json({
      error: `Your ${plan} plan allows up to ${limits.maxProfiles} connected profiles. Upgrade to connect more.`,
      limitReached: true,
      currentPlan: plan,
    }, { status: 403 })
  }

  const ppRes = await fetch(`${PP_BASE}/profile_groups/${group.postproxy_group_id}/initialize_connection`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PP_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform, redirect_url: redirectUrl }),
  })

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Postproxy error' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}

