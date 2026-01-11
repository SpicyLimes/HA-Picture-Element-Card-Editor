# Picture Element Card Editor

A Drag-and-Drop Web UI App to configure the Home Assistant "Picture Element Card".

## Choose Your Version

This app can be used in two ways:
1.  **Online (GitHub Pages)**: No installation required. (Requires Home Assistant over HTTPS).
2.  **Self-Hosted (Docker)**: Best for local networks.

---

## 🚀 Option 1: Online Version (GitHub Pages)

Visit the hosted URL: `https://your-username.github.io/ha-picture-element-card-editor/`

### Connectivity Note (HTTPS & CORS)
Because this version uses HTTPS, your Home Assistant must also be on **HTTPS** (e.g., Nabu Casa).
You must add this to your `configuration.yaml`:

```yaml
http:
  cors_allowed_origins:
    - "https://your-username.github.io"
```

---

## 🐋 Option 2: Self-Hosted (Docker)

Recommended for local networks where Home Assistant is using `http://`.

### Quick Start (Portainer / Docker Compose)
```yaml
services:
  editor:
    image: ghcr.io/spicylimes/ha-picture-element-card-editor:main
    container_name: ha-picture-element-card-editor
    ports:
      - "8099:3000"
    restart: unless-stopped
```

### Local Connectivity (CORS)
Add the following to your Home Assistant `configuration.yaml`:

```yaml
http:
  cors_allowed_origins:
    - "http://192.168.x.x:8099"  # The IP:Port of this editor
```

---

## Features
- **Visual Editor**: Drag & Drop icons, resize, zoom/pan.
- **Live YAML**: Bi-directional YAML editor.
- **Auto-Sync**: Elements appear immediately even without a background image.

## Development

```bash
npm install
npm run dev
```

### Build for Pages manually:
```bash
VITE_BASE=/ha-picture-element-card-editor/ npm run build
```
