# Sarjy 🎙️

> A voice-first assistant that helps you rediscover paintings from visual details you remember.

**Live Demo:** `TODO: production URL`

**Repository:** `TODO: GitHub URL`

**Walkthrough:** `TODO: Loom URL`

---

## What is Sarjy?

Sarjy is a real-time voice assistant designed to help you find information through natural conversation. It supports voice interactions, remembers useful information across sessions, and connects to external services.

For this take-home, I wanted to build something more specific than a general-purpose AI assistant: **what if you remember what a painting looks like, but not its name?**

You can describe details such as its subject, colors, or composition, and Sarjy helps you find the artwork you have in mind.

---

## ✨ Features

* 🎙️ Real-time voice conversations
* 🖼️ Artwork discovery from remembered visual details
* 🔌 External artwork API integration
* 🧠 Persistent memory across sessions
* 🔊 Real-time audio visualization
* 📱 Responsive frontend
* ⚡ LiveKit-based voice communication
* 🐍 Python voice agent
* ⚛️ Next.js + TypeScript frontend

---

## 🏗️ Architecture

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ LiveKit WebRTC
   ▼
Python Voice Agent
   │
   ├── Speech-to-Text
   ├── LLM
   ├── Text-to-Speech
   ├── Persistent Memory
   └── Artwork Search Tool
           │
           ▼
   Art Institute of Chicago API
```

The frontend handles the user experience and real-time audio interaction. The Python agent manages the voice pipeline, conversational logic, memory, and external API tools.

---

## 🎯 Deep Dive: Remember a Painting

**Selected focus: Something Else**

The idea builds on a problem I explored in an earlier project, **Ezibda**, where my team worked on making large personal photo libraries easier to search.

People often remember what an image contains rather than its filename. They might remember a place, an object, or a particular visual detail, but have no easy way to search for it. Ezibda explored this problem through local AI and CLIP-based visual analysis, with privacy in mind because personal photo libraries can contain sensitive information.

For Sarjy, I wanted to explore the same underlying problem from a different angle:

> *What if I remember what an image looks like, but I don't remember its name?*

Instead of searching private photo libraries, Sarjy applies this idea to museum artwork. Users can describe a painting in their own words, and the assistant uses conversational reasoning and artwork search to help narrow down possible matches.

This gives me a focused way to explore voice interaction, AI-assisted search, and visual content discovery together. The current implementation uses artwork metadata and an external API as its foundation. More advanced matching with embeddings or multimodal visual search could be explored in a future iteration.

---

## 🔌 External API

Sarjy integrates with the **Art Institute of Chicago API** to search its artwork collection.

The API provides artwork records that Sarjy can use to investigate a user's description and identify possible matches. This grounds the search in actual collection data rather than relying on the language model to invent artwork titles or details.

**Reliability principle:** Sarjy should only confirm an artwork when the search results support the match. If the description is too vague or no suitable result is found, it should ask a clarifying question or explain that it could not identify the painting confidently.

---

## 🧠 Memory

Sarjy can retain useful user-provided information across sessions, allowing relevant details to be recalled in later conversations.

For example:

```text
User: My favorite color is purple.

... later ...

User: What's my favorite color?

Sarjy: Your favorite color is purple.
```

The intention is to preserve useful information for future interactions rather than indiscriminately treating every part of a conversation as a permanent memory.

---

## 🛠️ Tech Stack

| Area                    | Technology                          |
| ----------------------- | ----------------------------------- |
| Voice Agent             | Python                              |
| Real-time Communication | LiveKit                             |
| Frontend                | Next.js                             |
| Language                | TypeScript                          |
| Styling                 | Tailwind CSS                        |
| AI                      | LLM, speech-to-text, text-to-speech |
| Artwork Search          | Art Institute of Chicago API        |
| Deployment              | `TODO`                              |

---

## 📌 Technical Notes

See [`TDD.md`](./TDD.md) for the technical design, including architecture, conversation flow, memory, artwork search, reliability considerations, and testing strategy.

---

## Built for Sarj 💜

Built as part of the Sarj Fullstack Engineering take-home assignment.
