// api/posts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const groupId = formData.get('groupId')

    const { data: group } = await supabase
      .from('profile_groups')
      .select('postproxy_group_id')
      .eq('id', groupId)
      .eq('clerk_user_id', userId)
      .single()

    if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

    const outForm = new FormData()
    outForm.append('profile_group_id', group.postproxy_group_id)

    const postBody = formData.get('post[body]')
    if (postBody) outForm.append('post[body]', postBody)

    const scheduledAt = formData.get('post[scheduled_at]')
    if (scheduledAt) outForm.append('post[scheduled_at]', scheduledAt)

    const draft = formData.get('post[draft]')
    if (draft === 'true') outForm.append('post[draft]', 'true')

    const profileEntries = formData.getAll('profiles[]')
    profileEntries.forEach(p => outForm.append('profiles[]', p))

    // Forward ALL platform params dynamically — not just known keys
    const platformKeys = new Set()
    for (const key of formData.keys()) {
      const match = key.match(/^platforms\[([^\]]+)\]\[([^\]]+)\]$/)
      if (match) platformKeys.add(key)
    }
    for (const key of platformKeys) {
      const val = formData.get(key)
      if (val !== null && val !== '') outForm.append(key, val)
    }

    const mediaFiles = formData.getAll('media[]')
    mediaFiles.forEach(file => {
      if (file && typeof file === 'object' && file.name) {
        outForm.append('media[]', file, file.name)
      }
    })

    console.log('[posts/multipart] forwarding to Postproxy')

    const ppRes = await fetch(`${PP_BASE}/posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${PP_KEY}` },
      body: outForm,
    })

    const ppData = await ppRes.json()
    console.log('[posts/multipart] response:', ppRes.status, JSON.stringify(ppData))

    if (!ppRes.ok) return NextResponse.json({ error: ppData.error || ppData.errors || 'Postproxy error' }, { status: ppRes.status })
    return NextResponse.json(ppData, { status: 201 })
  }

  // JSON path
  const body = await req.json()
  const { groupId, postBody, profiles, scheduledAt, platforms: platformParams, mediaUrls, draft } = body

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const payload = {
    post: {
      body: postBody,
      ...(scheduledAt && { scheduled_at: scheduledAt }),
      ...(draft && { draft: true }),
    },
    profiles: profiles || [],
    profile_group_id: group.postproxy_group_id,
    ...(mediaUrls?.length && { media: mediaUrls }),
    ...(platformParams && Object.keys(platformParams).length > 0 && { platforms: platformParams }),
  }

  console.log('[posts/json] payload:', JSON.stringify(payload, null, 2))

  const ppRes = await fetch(`${PP_BASE}/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PP_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const ppData = await ppRes.json()
  console.log('[posts/json] response:', ppRes.status, JSON.stringify(ppData))

  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || ppData.errors || 'Postproxy error' }, { status: ppRes.status })
  return NextResponse.json(ppData, { status: 201 })
}

export async function GET(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  const perPage = searchParams.get('per_page') || '50'
  const page    = searchParams.get('page') || '0'
  const status  = searchParams.get('status') || ''

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  let url = `${PP_BASE}/posts?profile_group_id=${group.postproxy_group_id}&per_page=${perPage}&page=${page}`
  if (status) url += `&status=${status}`

  const ppRes = await fetch(url, { headers: { Authorization: `Bearer ${PP_KEY}` } })
  const ppData = await ppRes.json()
  return NextResponse.json(ppData)
}


