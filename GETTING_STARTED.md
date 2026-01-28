# Getting Started

## Introduction

Claspo provides a starter repository for plugin development that includes:

- **Custom Components Development** — initial project for developing your own components
- **Quickstart Demo** — Docker container examples for deployment (editor, renderer, backend)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 22.20.0 or higher)
- npm (version 8 or higher)
- Git

## Installation

Clone the starter template and install dependencies:

```bash
git clone https://github.com/Claspo/claspo-plugin-starter.git
cd claspo-plugin-starter
npm install
```

## Custom Components Development

Components are web components that extend `WcElement`. Each component lives in its own folder under `components/`:

```
components/
└── YourCustomComponent/
    ├── YourCustomComponent.js
    └── assets/
```

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run components:dev` | Start dev server with hot reload (port 9590) |
| `npm run components:build:prod` | Create production build in `bundled-components/` |

For detailed component development guide, see [README.md](./README.md#custom-components).

## Quickstart: Editor & Widget Rendering

The `quickstart/` folder provides Docker container examples for deploying Claspo plugin infrastructure:

- **Frontend** — Widget editor and renderer UI (Vite + nginx)
- **Backend** — Express API for widget storage
- **Static Components** — Pre-built component bundles (nginx)

### Running Locally

Start all services with a single command from the repository root:

```bash
npm run dev
```

This runs components dev server, backend, and frontend concurrently.

| Service | URL |
|---------|-----|
| Editor | http://localhost:4202/editor.html |
| Renderer | http://localhost:4202/script.html |

### Docker Deployment

For Docker deployment examples and detailed configuration, see [quickstart/README.md](./quickstart/README.md).

```bash
cd quickstart
docker-compose up --build
```

## Next Steps

- Read the full [README.md](./README.md) for detailed component documentation
- Explore [quickstart/README.md](./quickstart/README.md) for deployment configuration
- Visit [docs.claspo.io](https://docs.claspo.io) for complete platform documentation
