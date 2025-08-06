# Dubla‑API 🎙️

**Dubla‑API** is a text-to-speech API built with **NestJS** and integrated with **Resemble AI**. It allows users to create projects, write scripts, generate voice clips using custom AI voices, and merge them into a single audio track. The API is designed to support content creators and automation workflows for voiceover generation.

## 🚀 Key Features

- Project and script management
- Voice clip generation using Resemble AI
- Audio merging to create full-length voiceovers
- RESTful API built with NestJS and TypeScript
- Simple and clean architecture
- Extensible design for future queuing, retries, and status tracking

## 🏗️ Technical Architecture

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (with TypeORM)
- **Voice synthesis**: Resemble AI
- **Audio merging**: Uses internal logic and Resemble's merge capabilities
- **Authentication**: JWT-based (optional or in progress depending on current version)
- No job queue (yet) — all audio processing is synchronous or handled via Resemble's async APIs

## 🧰 Tech Stack

| Layer             | Technologies            |
|------------------|-------------------------|
| Backend           | NestJS, TypeScript     |
| Database          | PostgreSQL, TypeORM    |
| Voice AI          | Resemble AI            |
| Audio Merging     | Resemble API + Node.js |
| Auth              | JWT                    |

## 🔧 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dubla-ai/dubla-api.git
   cd dubla-api
   ```

2. Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/dubla
   RESEMBLE_API_KEY=your-resemble-api-key
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

4. Run database migrations (if applicable):
   ```bash
   yarn typeorm migration:run
   ```

5. Start the server:
   ```bash
   yarn start:dev
   ```

## 🧪 Example API Flow

- `POST /projects` – Create a new dubbing project
- `POST /paragraphs` – Add a paragraph of text to the project
- `POST /audios` – Generate audio from paragraph using Resemble AI
- `POST /audios/merge/:projectId` – Merge all audios into a single file

## 🎯 Motivation

This project was created to explore AI-driven voice synthesis and content automation. It reflects:
- Strong software engineering principles with clean structure
- Integration with real-world AI APIs (Resemble)
- A use case with media processing and content generation

It also shows potential for scaling through async processing and job orchestration in the future.

## 🌱 Roadmap / Ideas

- Add job queue (BullMQ or others) for async clip generation
- Add status tracking and retries
- Support for more TTS providers (e.g. ElevenLabs)
- Frontend dashboard for managing projects and downloads
- Metrics and rate limiting
