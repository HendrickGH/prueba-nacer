# AGENTS.md - Workspace Instructions & Conventions

This document provides context, conventions, architecture guidelines, and operational instructions for AI agents (and human developers) working in this repository.

---

## 1. Project Overview

**Prueba Nacer** is a full-stack application built with a decoupled architecture:
- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework using TypeScript) acting as a REST API. It handles external API integrations such as fetching user data from the GitHub API (`/user/:username`).
- **Frontend**: [Next.js](https://nextjs.org/) (React Framework using TypeScript & App Router) rendering a responsive, clean user interface.
- **Infrastructure**: Containerized with **Docker** and orchestrated via `docker-compose.yml`.

---

## 2. Directory Structure

```text
prueba-nacer/
├── backend/                # NestJS REST API project
│   ├── src/
│   │   ├── main.ts         # Application entry point (default port: 3000 or custom PORT env)
│   │   ├── app.module.ts   # Root NestJS module
│   │   └── user/           # User module (Controller, Service, DTOs, etc.)
│   ├── test/               # E2E tests
│   ├── Dockerfile          # Production/Dev Dockerfile for backend
│   └── package.json
├── frontend/               # Next.js App Router project
│   ├── src/
│   │   └── app/            # App Router (layout.tsx, page.tsx, styles)
│   ├── Dockerfile          # Production/Dev Dockerfile for frontend
│   └── package.json
├── docker-compose.yml      # Orchestrates backend and frontend services
└── .env.example            # Root environment variables template
```

---

## 3. Tech Stack & Commands

### Backend (`/backend`)
- **Framework**: NestJS 11+, TypeScript, RxJS, Axios/HttpModule.
- **Commands**:
  - Install dependencies: `npm install`
  - Start development server: `npm run start:dev`
  - Build for production: `npm run build`
  - Start production server: `npm run start:prod`
  - Run unit tests: `npm run test`
  - Run E2E tests: `npm run test:e2e`
  - Run linter: `npm run lint`

### Frontend (`/frontend`)
- **Framework**: Next.js 15+ (App Router), React 19, TypeScript.
- **Commands**:
  - Install dependencies: `npm install`
  - Start development server: `npm run dev`
  - Build application: `npm run build`
  - Start production build: `npm run start`
  - Run linter: `npm run lint`

### Docker (`/`)
- Start full setup: `docker compose up --build`
- Stop services: `docker compose down`

---

## 4. Coding Standards & Conventions

### TypeScript & Code Style
- Strict mode enabled (`strict: true` in `tsconfig.json`).
- Explicit return types for backend controller/service methods.
- Consistent formatting via Prettier and ESLint.

### Backend (NestJS) Conventions
- Follow NestJS modular structure: keep logic separated into `*.module.ts`, `*.controller.ts`, `*.service.ts`.
- Environment variables must be handled via `@nestjs/config` or process environment safely with fallback values.
- Handle external HTTP requests safely (e.g., GitHub API rate limits, non-existent user 404 errors) with proper NestJS HTTP exceptions (`NotFoundException`, `InternalServerErrorException`).

### Frontend (Next.js) Conventions
- Use App Router structure inside `src/app/`.
- Differentiate between Server Components (default) and Client Components (`"use client"` directive when state/hooks are required).
- Maintain responsive, accessible UI without unnecessary inline styles—prefer CSS Modules or global standard CSS.

---

## 5. Instructions for AI Agents

1. **Verification before completion**: Always ensure code compiles (`npm run build` or `npm run start:dev`) and existing tests pass (`npm run test`) before reporting completion.
2. **Environment Variables**: Never hardcode secret API tokens or private keys in the source code. Document any new environment variables in `.env.example`.
3. **No Unnecessary Dependencies**: Avoid adding heavy external libraries if native features or existing installed tools suffice.
4. **Git & File Edits**: Make precise, clean changes preserving existing code comments and style conventions.
