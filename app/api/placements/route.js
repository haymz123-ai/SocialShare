// api/placements

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

const PLACEMENT_PLATFORMS = ['facebook', 'linkedin', 'pinterest']

export async function GET(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const profileId = searchParams.get('profileId')
  const platform = searchParams.get('platform')
  const groupId = searchParams.get('groupId')

  if (!profileId) return NextResponse.json({ error: 'profileId required' }, { status: 400 })
  if (!groupId) return NextResponse.json({ error: 'groupId required' }, { status: 400 })

  if (platform && !PLACEMENT_PLATFORMS.includes(platform)) {
    return NextResponse.json([])
  }

  // Resolve groupId (our DB id) → postproxy_group_id
  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  // Correct URL: /profiles/{profileId}/placements?profile_group_id={ppGroupId}
  const url = `${PP_BASE}/profiles/${profileId}/placements?profile_group_id=${group.postproxy_group_id}`

  const ppRes = await fetch(url, {
    headers: { Authorization: `Bearer ${PP_KEY}` },
  })

  if (ppRes.status === 404) return NextResponse.json([])

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Postproxy error' }, { status: ppRes.status })
  return NextResponse.json(Array.isArray(ppData) ? ppData : (ppData.placements || ppData.data || []))
}


