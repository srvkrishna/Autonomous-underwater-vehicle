# AUV SONAR

Adaptive payload control dashboard for an autonomous underwater vehicle. The interface presents a low-power software-defined sonar workflow: read water conditions, select a waveform, inspect telemetry, and follow the technical control loop.

## Features

- Dashboard overview with live-style payload status and operating readouts
- Waveform comparison for LFM chirp, phase-coded pulse, and geometric sweep families
- Water-condition guidance for clear, turbid, and muddy environments
- Structured depth, turbidity, temperature, and salinity telemetry views
- Technical workflow from environmental sensing to transmitted pulse
- Responsive Tidal Instrument visual system with keyboard-accessible controls

## Requirements

- Node.js 20 or newer
- pnpm 10, as declared in `package.json`

## Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The application is then available at `http://localhost:3000` when the full server scaffold is present.

### Frontend-only fallback

This checkout currently does not include `server/_core/index.ts` or `server/routers`, so the configured full-stack command cannot start. To preview the frontend independently, run:

```bash
npx vite --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` in a browser. API-backed authentication and tRPC features require the missing backend scaffold.

## Routes

| Route | View |
| --- | --- |
| `/` | Dashboard overview |
| `/waveforms` | Waveform library |
| `/conditions` | Water conditions |
| `/telemetry` | Sensor telemetry |
| `/workflow` | Technical workflow |
| `/login` | Authentication page |

## Useful Commands

```bash
pnpm run check   # TypeScript validation
pnpm test        # Run tests
pnpm run build   # Build frontend and server
pnpm run format  # Format source files
```

## Project Structure

- `client/src/pages/` - route-level dashboard views
- `client/src/components/` - shared shell, charts, maps, and UI primitives
- `client/src/contexts/` - theme and application contexts
- `shared/` - shared client/server constants and contracts
- `drizzle/` - database schema and migrations
- `server/` - backend and embedded controller sources

## Status

The dashboard is currently a frontend presentation layer using representative ESP32 readings. The telemetry stream is prepared to be replaced by a serial, WebSocket, or HTTP feed. Frequency guidance is an engineering starting point and should be calibrated for the transducer, depth, salinity, temperature, sediment, and target conditions of the mission.