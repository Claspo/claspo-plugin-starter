# Claspo Plugin Quickstart

Integration example for Claspo Plugin: editor, renderer, and static components.

## What You'll Build

This quickstart creates a complete widget editing environment:

- **Widget Editor** — drag-and-drop interface for building widgets
- **Widget Renderer** — preview widgets in real-time
- **Local API** — simple backend for widget storage

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Environment                            │
├──────────────┬──────────────┬───────────────────────────────────┤
│   Frontend   │   Backend    │      Static Components            │
│   :4302      │   :3200      │           :4301                   │
│  (Vite+nginx)│  (Express)   │         (nginx)                   │
└──────────────┴──────────────┴───────────────────────────────────┘
        │              │                    │
        │              │                    │
        ▼              ▼                    ▼
   Editor UI      Widget API         Component
```

## Prerequisites

- Node.js >= 22.20.0
- Docker & Docker Compose (for containerized deployment)

## Project Structure

```
quickstart/
├── frontend/              # Vite + TypeScript application
│   ├── src/
│   │   ├── editor.ts          # Editor initialization
│   │   ├── script.ts          # Renderer initialization
│   │   └── config/            # Editor and renderer configs
│   ├── index.html             # Navigation page
│   ├── editor.html            # Editor entry point
│   └── script.html            # Renderer entry point
├── backend/               # Express API server
│   ├── src/
│   │   ├── index.ts           # Server entry
│   │   └── routes/widgets.ts  # Widget CRUD endpoints
│   └── data/widgets.json      # File-based storage
├── static-components/     # Pre-built web components (demo only)
└── docker-compose.yml     # Container orchestration
```

## Local Development

### Quick Start (from repository root)

The easiest way to run everything is from the repository root:

```bash
# From repository root
npm run dev
```

This starts all services concurrently:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4202 | Editor and renderer UI |
| Backend | http://localhost:3100 | Widget API |
| Components | http://localhost:9590 | Component dev server |

Open pages:
- Editor: http://localhost:4202/editor.html
- Renderer: http://localhost:4202/script.html

### Running Services Separately

Install dependencies and run each service individually:

**Backend:**
```bash
cd quickstart/backend
npm install
npm run dev    # Starts on port 3100
```

**Frontend:**
```bash
cd quickstart/frontend
npm install
npm run dev    # Starts on port 4202
```

**Components** (from repository root):
```bash
npm run components:dev    # Starts on port 9590
```

## Docker Deployment

Docker Compose orchestrates three services with automatic networking.

### Services Overview

| Service | Port | Internal Port | Description |
|---------|------|---------------|-------------|
| frontend | 4302 | 80 | Editor UI served via nginx |
| backend | 3200 | 3100 | Express API for widget storage |
| static-components | 4301 | 80 | Component bundles served via nginx |

### Build & Run

```bash
cd quickstart
docker-compose up --build
```

Access points:
- Editor: http://localhost:4302/editor.html
- Renderer: http://localhost:4302/script.html
- API: http://localhost:3200/api/widgets/demo

Stop services:
```bash
docker-compose down
```

### Static Components

**Important:** The `static-components/` directory serves pre-built components for demonstration. It does not build components — only hosts them.

Components are built at the **repository root level**:

```bash
# From repository root (not quickstart/)
npm run components:build:prod
```

This creates `bundled-components/` folder at root. For the Docker demo, these files were copied to `quickstart/static-components/`.

**In production, you must:**

1. **Build components** — run `npm run components:build:prod` at repository root (see [root README](../README.md) for configuration)
2. **Serve from your infrastructure** — CDN, nginx, S3, or any static file server
3. **Configure the URL** — set `VITE_STATIC_RESOURCES_URL` to point to your component server

The Docker example uses nginx to serve `static-components/`. Choose the method that fits your infrastructure.

## Configuration

### Environment Variables

**Frontend** (`.env` files):

| Variable | Local Default | Docker Default | Description |
|----------|---------------|----------------|-------------|
| `VITE_STATIC_RESOURCES_URL` | `http://localhost:9590/` | `http://localhost:4301/` | URL to component server |

Create `.env.local` to override defaults:
```bash
VITE_STATIC_RESOURCES_URL=https://your-cdn.com/components/
```

## Troubleshooting

### Components not loading

**Symptom:** Editor shows empty component panel or broken component previews.

**Solution:** Verify `VITE_STATIC_RESOURCES_URL` points to a running component server:
```bash
# Check if components are accessible
curl http://localhost:9590/SysButtonComponent/SysButtonComponent.js
```

### CORS errors

**Symptom:** Browser console shows CORS policy errors.

**Solution:** Ensure your component server returns proper headers:
```
Access-Control-Allow-Origin: *
```

The nginx configs in `static-components/nginx.conf` and `frontend/nginx.conf` include these headers.
