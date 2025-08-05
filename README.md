# Dubla‑API 🎙️

**Dubla‑API** is an **asynchronous dubbing API** built with **NestJS** that uses **Resemble AI** for text-to-speech (TTS). Users can create projects, write scripts, generate synthetic voice clips, and merge them into a complete voiceover. Audio generation is handled via a job queue system, supporting status tracking and retries.

## 🚀 Key Features

- Project and script management with multiple voices.
- Integration with Resemble AI for custom voice synthesis.
- Asynchronous audio generation via queues (BullMQ or similar).
- Job status tracking and automatic retries on failure.
- Final audio export by merging multiple clips.
- Secure API with authentication (JWT) and input validation.

## 🏗️ Technical Architecture

- **Backend**: NestJS with TypeScript, modular architecture.
- **Queue System**: BullMQ + Redis for job processing.
- **Database**: PostgreSQL (via TypeORM or Prisma).
- **Audio Processing**: FFmpeg or streaming-based clip merging.
- Multi-voice support per project.
- Retry logic, structured logging, and observability tools.

## 🧰 Tech Stack

| Layer             | Technologies                |
|------------------|-----------------------------|
| API / Backend     | NestJS, TypeScript         |
| Job Queue         | BullMQ, Redis              |
| Database          | PostgreSQL, TypeORM/Prisma |
| Voice AI          | Resemble AI API            |
| Audio Processing  | FFmpeg, audio streams      |
| Auth              | JWT, Passport.js           |
| Monitoring        | Logs, retries, observability hooks |

## 🔧 Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dubla-ai/dubla-api.git
   cd dubla-api
