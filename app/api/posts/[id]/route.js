import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function PATCH(req, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
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
    if (postBody !== null) outForm.append('post[body]', postBody)

    const scheduledAt = formData.get('post[scheduled_at]')
    if (scheduledAt !== null) outForm.append('post[scheduled_at]', scheduledAt)

    const draft = formData.get('post[draft]')
    if (draft !== null) outForm.append('post[draft]', draft)

    const profileEntries = formData.getAll('profiles[]')
    profileEntries.forEach(p => outForm.append('profiles[]', p))

    // Forward ALL platform params dynamically
    for (const key of formData.keys()) {
      if (/^platforms\[([^\]]+)\]\[([^\]]+)\]$/.test(key)) {
        const val = formData.get(key)
        if (val !== null && val !== '') outForm.append(key, val)
      }
    }

    const mediaFiles = formData.getAll('media[]')
    mediaFiles.forEach(file => {
      if (file && typeof file === 'object' && file.name) {
        outForm.append('media[]', file, file.name)
      }
    })

    const ppRes = await fetch(`${PP_BASE}/posts/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${PP_KEY}` },
      body: outForm,
    })

    const ppData = await ppRes.json()
    if (!ppRes.ok) return NextResponse.json({ error: ppData.error || ppData.errors || 'Update failed' }, { status: ppRes.status })
    return NextResponse.json(ppData)
  }

  // JSON PATCH
  const body = await req.json()
  const { groupId, post, profiles, platforms, media } = body

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  const payload = {
    profile_group_id: group.postproxy_group_id,
    ...(post && { post }),
    ...(profiles && { profiles }),
    ...(platforms && { platforms }),
    ...(media && { media }),
  }

  const ppRes = await fetch(`${PP_BASE}/posts/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${PP_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || ppData.errors || 'Update failed' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}

export async function GET(req, { params }) {
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
    `${PP_BASE}/posts/${id}?profile_group_id=${group.postproxy_group_id}`,
    { headers: { Authorization: `Bearer ${PP_KEY}` } }
  )

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Not found' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}

export async function DELETE(req, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = params
  const { searchParams } = new URL(req.url)
  const groupId = searchParams.get('groupId')
  const deleteOnPlatform = searchParams.get('delete_on_platform') === 'true'

  const { data: group } = await supabase
    .from('profile_groups')
    .select('postproxy_group_id')
    .eq('id', groupId)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  let url = `${PP_BASE}/posts/${id}?profile_group_id=${group.postproxy_group_id}`
  if (deleteOnPlatform) url += '&delete_on_platform=true'

  const ppRes = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${PP_KEY}` },
  })

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Delete failed' }, { status: ppRes.status })
  return NextResponse.json(ppData)
}