import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get and validate query parameters
    const text = req.nextUrl.searchParams.get('text');
    const teacher = req.nextUrl.searchParams.get('teacher') || 'Nanami';

    if (!text) {
      return NextResponse.json(
        { error: 'Missing required parameter: text' },
        { status: 400 }
      );
    }

    // Map teacher names to ElevenLabs voice IDs
    const voiceMap = {
      'Nanami': 'yl19hOoXOguaOr6ELkeE', // Provided voice ID for Nanami
      'Naoki': 'NFG5qt843uXKj4pFvR7C'   // Provided voice ID for Naoki
    };

    const voiceId = voiceMap[teacher] || voiceMap['Nanami'];
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

    if (!apiKey) {
      console.error('Missing ElevenLabs API key');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    // Validate text length (ElevenLabs has a limit, typically 2500 chars)
    if (text.length > 2500) {
      return NextResponse.json(
        { error: 'Text is too long. Maximum 2500 characters allowed.' },
        { status: 400 }
      );
    }

    console.log('Making TTS request to ElevenLabs:', {
      voiceId,
      textLength: text.length,
      teacher
    });

    try {
      // Simple retry mechanism
      const maxRetries = 3;
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Attempt ${attempt} to call ElevenLabs API`);
          
          // First, verify the voice exists
          const voiceResponse = await fetch(
            `https://api.elevenlabs.io/v1/voices/${voiceId}`,
            {
              method: 'GET',
              headers: {
                'xi-api-key': apiKey,
                'accept': 'application/json',
              },
            }
          );

          if (!voiceResponse.ok) {
            const errorText = await voiceResponse.text();
            throw new Error(`Voice verification failed: ${voiceResponse.status} ${errorText}`);
          }

          // Call ElevenLabs TTS API
          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
                'accept': 'audio/mpeg',
              },
              body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.5,
                }
                // Removed output_format as it's not a standard parameter
              }),
            }
          );

          if (response.ok) {
            // Return the successful response directly
            return new Response(response.body, {
              headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename=tts.mp3',
                'Visemes': JSON.stringify([]),
              },
            });
          }

          // If response is not ok, handle it
          const errorText = await response.text();
          lastError = new Error(`TTS API error: ${response.status} ${response.statusText} - ${errorText}`);
          
          // If it's a 429 (rate limit) or 5xx error, we'll retry
          if (response.status !== 429 && response.status < 500) {
            throw lastError; // Don't retry for client errors (4xx)
          }
          
          console.warn(`Attempt ${attempt} failed:`, lastError.message);
          
        } catch (error) {
          lastError = error;
          console.warn(`Attempt ${attempt} failed:`, error.message);
        }
        
        // Wait before retrying (exponential backoff: 1s, 2s, 4s)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // If we get here, all retries failed
      throw lastError;
    } catch (error) {
      console.error('Error in TTS API call:', error);
      return NextResponse.json(
        { 
          error: 'Error processing TTS request',
          details: error.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in TTS route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
