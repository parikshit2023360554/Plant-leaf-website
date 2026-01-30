# Environment Configuration

This backend supports multiple environment files to match different branches and deployment targets.

## Files
- `.env` — Base defaults shared across environments (optional).
- `.env.dev` — Development environment.
- `.env.local` — Local developer overrides (highest precedence).
- `.env.prod` — Production environment.
- `.env.qa` — QA environment.

## Load Order and Precedence
The server loads env files in the following order and later files override earlier ones:
1. `.env`
2. `.env.<NODE_ENV>` (e.g., `.env.dev`, `.env.qa`, `.env.prod`)
3. `.env.local`

This is implemented in `src/server.js` using `dotenv` with `override: true`.

## Typical Branch Mapping
- `main` → Production (`NODE_ENV=production`, uses `.env.prod`)
- `qa` → QA (`NODE_ENV=qa`, uses `.env.qa`)
- `develop` / `dev` → Development (`NODE_ENV=development`, uses `.env.dev`)
- Local work → Local overrides (`.env.local` always overrides others)

## Variables
Each env file can define:
- `NODE_ENV` — `development` | `qa` | `production`.
- `PORT` — Server port.
- `LOG_LEVEL` — `debug` | `info` | `warn` | `error`.
- `ALLOW_ORIGIN` — Allowed frontend origin for CORS.

Examples provided:
- `.env.dev`:
  - `NODE_ENV=development`
  - `PORT=4000`
  - `LOG_LEVEL=debug`
  - `ALLOW_ORIGIN=http://localhost:3000`
- `.env.qa`:
  - `NODE_ENV=qa`
  - `PORT=5000`
  - `LOG_LEVEL=info`
  - `ALLOW_ORIGIN=https://your-qa-domain.com`
- `.env.prod`:
  - `NODE_ENV=production`
  - `PORT=8080`
  - `LOG_LEVEL=warn`
  - `ALLOW_ORIGIN=https://your-production-domain.com`
- `.env.local` (developer overrides):
  - `NODE_ENV=development`
  - `PORT=4001`
  - `LOG_LEVEL=debug`
  - `ALLOW_ORIGIN=http://localhost:3000`

## Running with a Specific Environment
Set `NODE_ENV` before starting the server to load the corresponding file:

```bash
# QA
NODE_ENV=qa node src/server.js

# Production
NODE_ENV=production node src/server.js

# Development
NODE_ENV=development node src/server.js
```

On macOS/Linux you can prefix the command as shown above; on Windows, set the variable with `set NODE_ENV=qa` in the same shell before running.

## Git Hygiene
All env variants are ignored by Git to protect secrets:
- `.env`
- `.env.*`

Use your CI/CD secrets manager (e.g., GitHub Actions secrets) for production values rather than committing them to the repo.