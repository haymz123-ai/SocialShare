
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { lat, lng, location } = await request.json();

   // 1. SerpApi Key
const SERPAPI_KEY = "cc38cf66185dc1de472dc2a92d594b1fdcb8c9d19276552c5882b6ff3223f035";



    if (!SERPAPI_KEY) {
      return NextResponse.json(
        { error: 'SerpAPI key not configured' },
        { status: 500 }
      );
    }

    // Search for food trucks using Google Maps via SerpAPI
    const searchUrl = `https://serpapi.com/search.json?engine=google_maps&q=food+trucks&ll=@${lat},${lng},13z&type=search&api_key=${SERPAPI_KEY}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch from SerpAPI');
    }

    const trucks = (data.local_results || []).map(place => ({
      name: place.title,
      address: place.address,
      phone: place.phone,
      website: place.website,
      rating: place.rating,
      reviews: place.reviews,
      type: place.type,
      hours: place.hours,
      service_options: place.service_options,
      description: place.description,
      position: place.gps_coordinates ? {
        lat: place.gps_coordinates.latitude,
        lng: place.gps_coordinates.longitude,
      } : null,
    }));

    return NextResponse.json({ trucks });
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search food trucks' },
      { status: 500 }
    );
  }
}


