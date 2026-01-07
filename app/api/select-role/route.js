import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const { clerkUserId, email, role } = await request.json();

    if (!clerkUserId || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already has a role assigned' },
        { status: 400 }
      );
    }

    // Insert new user with role
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          clerk_user_id: clerkUserId,
          email: email,
          role: role,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}