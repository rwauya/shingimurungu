# Deployment

This memorial is a static site. The live site does not need Python, Node, a backend, or a folder watcher.

Before deployment, generate the static media files:

```powershell
.\build-static.ps1
```

That writes `media-manifest.js` from the files that actually exist in `images/` and refreshes optimized thumbnails. The HTML page then loads `media-manifest.js` like a normal static JavaScript file.

For local editing, keep the manifest synced while adding or deleting media:

```powershell
.\watch-media.ps1
```

For Cloudflare Pages, use:

```text
Build command: python -m pip install -r requirements.txt && python tools/sync_media_manifest.py
Build output directory: .
```

For GitHub Pages, the included `.github/workflows/pages.yml` runs the same manifest generation step before publishing.
