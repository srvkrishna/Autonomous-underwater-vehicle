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

### ESP32 Wi-Fi telemetry

The ESP32 sketch exposes sensor data at `/status`. Connect the ESP32 and the computer running this dashboard to the same Wi-Fi network, copy `.env.example` to `.env`, and set the device URL:

```dotenv
VITE_ESP32_STATUS_URL=http://192.168.1.42/status
```

Restart the development server after changing `.env`. The telemetry page polls the endpoint once per second. Without this variable, it displays the built-in representative demo stream.

The ESP32 `/status` response has this shape:

```json
{
	"distance": 184.0,
	"turbRaw": 1488,
	"turbVoltage": 1.2,
	"temperature": 18.6,
	"humidity": 62.4,
	"bmeTemperature": 18.8,
	"pressure": 1012.6,
	"gasResistance": 84.2
}
```

`temperature` comes from the DS18B20, while the BME680 supplies humidity, BME temperature, pressure, and gas resistance. Install the Arduino `Adafruit BME680 Library` and its dependencies before compiling the sketch. The ESP32 prints its assigned IP address to the Serial Monitor after joining Wi-Fi.

For the complete hardware setup, data flow, troubleshooting steps, and cross-question preparation, see [TECHNICAL_WORKFLOW.md](TECHNICAL_WORKFLOW.md).

### Frontend-only fallback

To preview the frontend independently from the backend, run:

```bash
npx vite --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` in a browser. API-backed features require the full-stack development server.

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