import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Check if API key is configured
const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!googleApiKey) {
  console.error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log('Received messages:', messages);
    console.log('Messages type:', typeof messages);
    console.log('Messages array length:', messages?.length);

    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Creating UI message stream with messages:', messages);

    try {
      const stream = createUIMessageStream({
        originalMessages: messages,
        execute: async ({ writer }) => {
          console.log('Executing streamText with converted messages');
          const result = await streamText({
            model: google('gemini-2.0-flash-exp'),
            messages: convertToModelMessages(messages),
            temperature: 0.7,
            onFinish: ({ text, finishReason, usage }) => {
              console.log('Stream finished:', { text: text.slice(0, 100), finishReason, usage });
            },
          });
          
          console.log('Merging result to UI message stream');
          writer.merge(result.toUIMessageStream());
        },
        onFinish: ({ messages }) => {
          console.log('Chat finished with messages:', messages.length);
        },
      });

      console.log('Creating UI message stream response');
      return createUIMessageStreamResponse({ stream });
    } catch (streamError) {
      console.error('Error creating stream:', streamError);
      throw streamError;
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
