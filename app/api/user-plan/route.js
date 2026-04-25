// api/user-plan

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserPlan, ensureUser } from '../../../lib/getUserPlan'
import { getPlan } from '../../../lib/plans'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureUser(userId)
  const plan = await getUserPlan(userId)
  return NextResponse.json({ plan, limits: getPlan(plan) })
}