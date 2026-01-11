# Picture Element Card Editor

A Drag-and-Drop Web UI App to configure the Home Assistant "Picture Element Card".

## Features
- **Visual Editor**: Drag & Drop icons, resize, zoom/pan.
- **Live YAML**: Bi-directional YAML editor.
- **Deployment**: Docker, Portainer, and standard web hosting support.

## Quick Start
1.  Run the application (see Installation below).
2.  Open the editor in your browser (default: `http://localhost:8099`).
3.  **Connect**: Enter your Home Assistant URL and a Long-Lived Access Token.
4.  **Floorplan**: Upload your image or paste a URL.
5.  **Edit**: Drag icons onto the canvas, configure them in the sidebar.
6.  **Export**: Copy the YAML from the "Live Editor" panel and paste it into your HA Dashboard configuration.

## Installation

This application is distributed as a Docker container, making it easy to run on your Home Server (Unraid, Synology, Raspberry Pi, etc.) using Docker or Portainer.

### Option 1: Portainer Stack (Recommended)
If you use Portainer, this is the easiest method.

1.  Log into **Portainer**.
2.  Go to **Stacks** > **Add stack**.
3.  Name it `picture-element-card-editor`.
4.  Paste the following into the **Web editor**:

```yaml
version: '3'
services:
  editor:
    image: ghcr.io/spicylimes/picture-element-card-editor:main
    container_name: picture-element-card-editor
    ports:
      - "8099:3000"
    restart: unless-stopped
```

5.  Click **Deploy the stack**.

### Option 2: Docker CLI
If you prefer the command line:

```bash
docker run -d \
  --name picture-element-card-editor \
  -p 8099:3000 \
  --restart unless-stopped \
  ghcr.io/spicylimes/picture-element-card-editor:main
```

Access the editor at `http://YOUR_SERVER_IP:8099`.

### Option 3: Docker Compose
If you manage `docker-compose.yaml` files manually:

1.  Create visual editor service in your `docker-compose.yaml`:
    ```yaml
    version: '3'
    services:
      editor:
        image: ghcr.io/spicylimes/picture-element-card-editor:main
        container_name: picture-element-card-editor
        ports:
          - "8099:3000"
        restart: unless-stopped
    ```
2.  Run `docker-compose up -d`.

## Contributing
Interested in modifying the code? See [CONTRIBUTING.md](CONTRIBUTING.md) for development instructions.
