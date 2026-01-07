// src/app/api/generate/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert image to base64 for sending to Replicate
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${imageFile.type};base64,${base64Image}`;

    // Make the API call to Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait' // Wait for the processing to complete
      },
      body: JSON.stringify({
        version: '407b7fd425e00eedefe7db3041662a36a126f1e4988e6fbadfc49b157159f015',
        input: {
          image: dataURI,
          model: 'dev',
          prompt: 'recreate this image in ghibli style',
          go_fast: false,
          lora_scale: 0.85,
          megapixels: '1',
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'jpg',
          guidance_scale: 3,
          output_quality: 100,
          prompt_strength: 0.7,
          extra_lora_scale: 1,
          num_inference_steps: 28
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.detail || 'Error processing image' }, { status: response.status });
    }

    // Get the result
    const result = await response.json();
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Server error processing request' }, { status: 500 });
  }
}