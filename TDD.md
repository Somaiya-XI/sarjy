# Sarjy - Technical Design Document

## 1. Overview

Sarjy is a voice-first conversational assistant built for the Sarj take-home assignment.

The application is designed to let users:

- Speak with Sarjy in real time and receive spoken responses.
- Retain selected user preferences and facts across sessions.
- Search museum artwork using details the user remembers.
- Interact through a responsive web interface.

The implementation is split into a Python voice agent and a web frontend so that real-time conversation logic remains independent from the presentation layer.

## 2. Technical Stack

### Voice Agent

- Python
- LiveKit Agents
- Large language model (LLM)
- Speech-to-text (STT)
- Text-to-speech (TTS)
- External API integration
- Persistent memory through the configured LiveKit memory mechanism

### Frontend

- Next.js
- TypeScript
- React
- LiveKit client components
- Tailwind CSS

### Infrastructure

- Python agent deployed as a persistent service on Railway.
- Next.js frontend deployed separately on Vercel.
- Environment variables used for secrets and service configuration.

## 3. High-Level Architecture

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ LiveKit WebRTC
   ▼
Python Voice Agent
   ├── Speech-to-Text
   ├── LLM
   ├── Text-to-Speech
   ├── Memory
   └── Artwork Search Tool
           │
           ▼
   Art Institute of Chicago API
```

The frontend is responsible for the user experience and real-time audio presentation, including conversation states, visualization, and responsive interaction.

The Python service owns conversational behavior, tool execution, memory handling, and the voice pipeline.

## 4. Core Flows

### Starting a conversation

1. The user opens the frontend and starts a conversation.
2. The frontend establishes a LiveKit connection.
3. The voice agent joins the room.
4. The user speaks.
5. The voice pipeline processes the audio.
6. Sarjy generates a response.
7. The response is converted to speech.
8. Audio is streamed back to the user.

### Finding a remembered painting

Sarjy helps when a user remembers visual details about a painting but not its name. The user might describe its subject, colors, composition, or other details.

1. Sarjy determines that an artwork search may help.
2. The artwork search tool queries the Art Institute of Chicago API using the user's description.
3. The response is filtered and processed.
4. Sarjy uses the returned records to discuss possible matches.
5. The result is presented conversationally, with relevant artwork details and images where supported by the implementation.

If the search results are inconclusive, Sarjy should ask a clarifying question or state that it cannot identify the painting confidently rather than inventing a match.

## 5. Memory

Sarjy is designed to remember useful user-provided facts across sessions, such as:

- Favorite color
- Preferred name
- Personal preferences

Memory should be selective and useful, rather than storing every part of every conversation. The exact storage and retrieval behavior depends on the configured LiveKit memory implementation and should be verified against the deployed application.

## 6. Frontend UX

The frontend aims to make voice interaction understandable without presenting itself as a generic chat interface.

Key UX considerations:

- Clear listening and speaking states
- Responsive layout
- Visual feedback during conversation
- Real-time audio visualization
- Artwork images and details when available in the painting discovery flow
- Minimal interaction friction
- A recognizable visual personality

## 7. Deep Dive: Remember a Painting

**Selected deep dive: Something Else**

The feature explores a voice-driven way to rediscover a painting from remembered visual details.

The idea came from an earlier project, Ezibda, where my team explored finding photographs inside large personal photo libraries. People often remember what is in an image rather than its filename, such as a location, object, person, or visual detail, but traditional metadata-based search cannot capture this type of memory.

Ezibda explored this problem using local AI and CLIP-based visual analysis to make personal image collections searchable by visual content. Because personal photo libraries contain sensitive data, this also raised questions about privacy and where visual analysis should happen.

For this take-home, I wanted to explore the same fundamental idea from a different angle:

> What if I remember what an image looks like, but I don't remember its name?

Instead of searching a user's private photo library, Sarjy applies the concept to museum artwork. This provides a well-defined collection while allowing exploration of how an LLM and external APIs can interpret natural-language visual descriptions and retrieve relevant artwork.

The current approach uses artwork metadata and conversational reasoning as its foundation. In a larger system, it could be extended with embeddings, image classification, and multimodal visual search to improve matching accuracy.

This feature connects three areas I enjoy working with: voice interfaces, AI-assisted search, and visual content discovery.

## 8. Security and Reliability

- Keep API keys and LiveKit credentials in environment variables, not in source control.
- Expose only client-safe configuration to the browser.
- Keep external API credentials server-side where possible.
- Treat external API responses as the source of truth for artwork details.
- Do not claim a specific artwork match unless the returned results support it.
- Handle empty, ambiguous, or failed search responses gracefully.

## 9. Deployment

The application is intended to run as two independently deployable components.

### Backend

The Python LiveKit agent runs as a persistent service on Railway. It requires the appropriate LiveKit credentials and provider API keys as environment variables.

### Frontend

The Next.js application is deployed on Vercel as the public entry point. Its production environment must point to the correct LiveKit project and use a secure token-generation flow appropriate to the application.

Final service settings, start commands, and public URLs should be documented after the actual deployment has been tested.

## 10. Testing

The core test plan covers:

- Agent startup and LiveKit connection
- Voice conversation and response generation
- Artwork search tool behavior
- Empty results, ambiguous matches, API failures, and timeouts
- Memory persistence and retrieval across sessions
- Frontend connection and conversation states
- Responsive behavior
- End-to-end voice interaction using the deployed frontend and agent

Record only tests that have actually been run and their observed results.

## 11. Future Improvements

With additional development time, the main areas to explore are:

- Further reducing time-to-first-audio
- More robust memory retrieval and ranking
- Better recovery from interrupted conversations
- Additional external tools
- More detailed voice UX analytics
- Thorough end-to-end voice testing
- Embedding-based or multimodal artwork retrieval
