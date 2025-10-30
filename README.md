# Gemini Learn

An AI-powered learning platform designed to improve the user experience of learning with chatbots. Built with Next.js and Google's Gemini API.

## Problem

When students use AI chatbots to learn complex topics, they often encounter unfamiliar terms in the explanations. The current solution requires opening a new chat, which breaks the learning flow and loses context.

## Solution

Gemini Learn introduces Guided Learning, a feature that lets users highlight any term and press Ctrl+Shift+E to open a focused subchat. This provides instant, contextual explanations without disrupting the main conversation.

## Key Features

- Contextual learning with floating subchats
- Smooth streaming responses from Gemini 2.0 Flash
- Markdown rendering with syntax-highlighted code blocks
- Keyboard-first interaction (Ctrl+Shift+E)
- Clean, minimal interface with dark mode support

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your Gemini API key:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- Next.js 16
- React
- TypeScript
- Vercel AI SDK v5
- Google Gemini 2.0 Flash
- Tailwind CSS
- shadcn/ui components

## UX Improvements

This project focuses on solving real user experience problems in AI-powered learning:

- Maintains conversation context while exploring new concepts
- Reduces cognitive load by keeping related information visible
- Provides quick, concise explanations to avoid information overload
- Uses familiar keyboard shortcuts for efficient interaction
- Implements smooth animations and transitions for better flow
