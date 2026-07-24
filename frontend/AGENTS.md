<!-- BEGIN:nextjs-agent-rules -->
# Next.js & Frontend Agent Guidelines

This project uses **Next.js App Router** with TypeScript.

For general repository conventions, environment setup, and backend integrations, see the root [/AGENTS.md](file:///Users/hendrick/Documents/prueba-nacer/AGENTS.md).

### Frontend Specific Rules:
- Keep pages and components inside `src/app/`.
- Use `'use client'` only when interactive state, hooks (`useState`, `useEffect`), or DOM events are needed.
- Follow CSS modules or standard clean CSS styling guidelines defined in `globals.css` and `*.module.css`.
- Handle async API calls gracefully with loading states and user-friendly error fallback screens.
<!-- END:nextjs-agent-rules -->
