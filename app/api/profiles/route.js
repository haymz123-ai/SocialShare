import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { getUserPlan } from '../../../lib/getUserPlan'
import { getPlan } from '../../../lib/plans'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function GET(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const ppRes = await fetch(`${PP_BASE}/profiles?profile_group_id=${group.postproxy_group_id}`, {
    headers: { Authorization: `Bearer ${PP_KEY}` },
  })
  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Error' }, { status: ppRes.status })
  return NextResponse.json(Array.isArray(ppData) ? ppData : ppData.data || [])
}

export async function DELETE(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const profileId = searchParams.get('profileId')
  const groupId = searchParams.get('groupId')

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const ppRes = await fetch(
    `${PP_BASE}/profiles/${profileId}?profile_group_id=${group.postproxy_group_id}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${PP_KEY}` } }
  )

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Delete failed' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}