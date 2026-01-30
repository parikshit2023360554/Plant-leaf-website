# Backend (Express)

Modern Express backend scaffold with routers, middleware, and configuration.

## Quick Start

- Copy `.env.example` to `.env` and adjust as needed.
- Install dependencies: `npm install`
- Start development server: `npm run dev`

## Endpoints

- `GET /api/health` — health check

## Structure

- `src/server.js` — bootstrap and listen
- `src/app.js` — middleware wiring and route mounting
- `src/routes/*` — route modules
- `src/controllers/*` — request handlers
- `src/middleware/*` — error handling and more
- `src/config/index.js` — environment configuration
- `src/utils/*` — helpers for controllers and middleware

### Utils

- `asyncHandler.js` — wraps async controllers to pass errors to the central handler.
- `logger.js` — simple timestamped logger with structured meta.
- `response.js` — standardized success/error JSON responses.
- `requestId.js` — middleware that adds `req.id` and `X-Request-ID` header; included in logs.

Requests now include a unique ID in the logs for easier debugging.