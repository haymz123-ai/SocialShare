// api/connect-platform

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { groupId, platform, redirectUrl } = await req.json()

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const ppRes = await fetch(`${PP_BASE}/profile_groups/${group.postproxy_group_id}/initialize_connection`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PP_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ platform, redirect_url: redirectUrl }),
  })

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Postproxy error' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}