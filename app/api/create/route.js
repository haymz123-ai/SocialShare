
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      latitude,
      longitude,
      address,
      phone,
      opening_time,
      closing_time,
      image_url,
      cuisine_type,
      average_price,
      dishes,
      clerk_user_id,
    } = body;

    if (!name || !latitude || !longitude || !address || !phone || !opening_time || !closing_time || !clerk_user_id || !cuisine_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('food_trucks')
      .insert([
        {
          name,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address,
          phone,
          opening_time,
          closing_time,
          image_url,
          cuisine_type,
          average_price,
          dishes: dishes || [],
          clerk_user_id,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create food truck' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, truck: data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
