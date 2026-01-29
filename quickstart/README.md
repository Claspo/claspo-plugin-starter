# Claspo Plugin Quickstart

Integration example for Claspo Plugin: editor, renderer, and static components.

> **Quick Start:** See [root README](../README.md) for the fastest way to run the project with `npm run install:all && npm run dev`.

## Architecture

```
┌──────────────┬──────────────┬───────────────────────────────────┐
│   Frontend   │   Backend    │      Static Components            │
│   :4202      │   :3100      │           :9590                   │
│   (Vite)     │  (Express)   │       (dev server)                │
└──────────────┴──────────────┴───────────────────────────────────┘
        │              │                    │
        ▼              ▼                    ▼
   Editor UI      Widget API          Components
```

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:4202 | Editor and renderer UI |
| Backend | http://localhost:3100 | Widget API |
| Components | http://localhost:9590 | Component dev server |

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
│   └── data/local-data/       # Auto-generated storage (gitignored)
├── static-components/     # Pre-built web components (demo only)
└── docker-compose.yml     # Container orchestration
```

## Running Services Separately

If you need to run services individually instead of using `npm run dev` from root:

**Backend:**
```bash
cd quickstart/backend
npm install
npm run dev    # Starts on port 3100
```

Backend automatically creates `data/local-data/` folder for widget storage on first run. To reset local state, delete this folder and restart.

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

## Configuration

### Environment Variables

**Frontend** (`.env` files):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_STATIC_RESOURCES_URL` | `http://localhost:9590/` | URL to component server |

Create `.env.local` to override:
```bash
VITE_STATIC_RESOURCES_URL=https://your-cdn.com/components/
```

## Docker Deployment (Optional)

Docker setup is provided as an **example of production-like deployment**. It is not required for local development.

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| frontend | 4302 | Editor UI served via nginx |
| backend | 3200 | Express API for widget storage |
| static-components | 4301 | Component bundles served via nginx |

### Build & Run

```bash
cd quickstart
docker-compose up --build
```

Access:
- Editor: http://localhost:4302/editor.html
- Renderer: http://localhost:4302/script.html
- API: http://localhost:3200/api/widgets/demo

### Static Components for Docker

The `static-components/` directory serves pre-built components for the Docker demo. Components are built at the **repository root level**:

```bash
# From repository root
npm run components:build:prod
```

This creates `bundled-components/` folder. For Docker, copy these files to `quickstart/static-components/`.

**In production:**
1. Build components with `npm run components:build:prod`
2. Serve from your infrastructure (CDN, nginx, S3)
3. Set `VITE_STATIC_RESOURCES_URL` to your component server URL

## Troubleshooting

### Components not loading

**Symptom:** Editor shows empty component panel or broken previews.

**Solution:** Verify component server is running:
```bash
curl http://localhost:9590/SysButtonComponent/SysButtonComponent.js
```

### CORS errors

**Symptom:** Browser console shows CORS policy errors.

**Solution:** Ensure component server returns proper headers:
```
Access-Control-Allow-Origin: *
```

The nginx configs in `static-components/nginx.conf` and `frontend/nginx.conf` include these headers.

### Backend not responding

**Symptom:** API calls fail or timeout.

**Solution:** Check backend is running on port 3100:
```bash
curl http://localhost:3100/api/widgets/demo
```
