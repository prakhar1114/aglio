# Aglio landing page

This repo contains a simple, static landing page for **Aglio — AI Photo Manager**.

## Run locally

From the repo root:

```bash
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Add your YouTube demo

Open `script.js` and set:

```js
const YOUTUBE_URL = "https://www.youtube.com/watch?v=YOUR_VIDEO_ID";
```

## Add your App Store link

In `index.html`, replace the disabled “Download on the App Store” button `href="#"` with your App Store URL.
