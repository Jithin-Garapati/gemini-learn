import { google } from '@ai-sdk/google';

export async function GET() {
  try {
    const model = google('gemini-2.0-flash-exp');
    const result = await model.generateText({
      prompt: 'Hello, this is a test. Respond with "API is working!"',
    });
    
    return Response.json({ 
      success: true, 
      response: result.text,
      apiKeySet: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    });
  } catch (error) {
    console.error('Test API error:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      apiKeySet: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    }, { status: 500 });
  }
}
