// api/profile-groups

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

const PP_BASE = 'https://api.postproxy.dev/api'
const PP_KEY = process.env.NEXT_PUBLIC_POSTPROXY_API_KEY

export async function GET(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profile_groups')
    .select('*')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const ppRes = await fetch(`${PP_BASE}/profile_groups`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PP_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_group: { name } }),
  })

  const ppData = await ppRes.json()
  if (!ppRes.ok) return NextResponse.json({ error: ppData.error || 'Postproxy error' }, { status: ppRes.status })

  const { data, error } = await supabase
    .from('profile_groups')
    .insert({
      clerk_user_id: userId,
      postproxy_group_id: ppData.id,
      name: ppData.name,
      profiles_count: ppData.profiles_count ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  const { data: group } = await supabase
    .from('profile_groups')
    .select('*')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .single()

  if (!group) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { count } = await supabase
    .from('profile_groups')
    .select('*', { count: 'exact', head: true })
    .eq('clerk_user_id', userId)

  if (count <= 1) {
    return NextResponse.json(
      { error: 'Cannot delete your only workspace. Create another group first.' },
      { status: 400 }
    )
  }

  await fetch(`${PP_BASE}/profile_groups/${group.postproxy_group_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${PP_KEY}` },
  })

  await supabase.from('profile_groups').delete().eq('id', id)
  return NextResponse.json({ success: true })
}

