// app/api/posts/[id]/publish/route.js
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function POST(req, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const ppRes = await fetch(
    `${PP_BASE}/posts/${id}/publish?profile_group_id=${group.postproxy_group_id}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${PP_KEY}` },
    }
  )

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Publish failed' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}

