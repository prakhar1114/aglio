/**
 * Landing page helpers (intentionally minimal).
 *
 * Add your YouTube URL below. Accepted formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
const YOUTUBE_URL = "https://youtube.com/shorts/7_ReEvZLyNA?si=kyqXateBVmDwfMQ6";

function parseYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "").trim();
      return id || null;
    }

    // youtube.com/watch?v=<id>
    if (u.searchParams.get("v")) return u.searchParams.get("v");

    // youtube.com/shorts/<id>
    const parts = u.pathname.split("/").filter(Boolean);
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx !== -1 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];

    // youtube.com/embed/<id>
    const embedIdx = parts.indexOf("embed");
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch {
    // ignore invalid URLs
  }
  return null;
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function main() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const playBtn = document.querySelector("[data-open-video]");
  const hintEl = document.querySelector("[data-video-hint]");
  const dialog = document.querySelector("[data-video-modal]");
  const closeBtn = document.querySelector("[data-close-video]");
  const frame = document.querySelector("[data-video-frame]");

  const videoId = parseYouTubeId(YOUTUBE_URL);
  const hasVideo = Boolean(videoId);

  if (!hasVideo) {
    setText(hintEl, "Video URL not set yet. Share your YouTube link and I’ll wire it in.");
    if (playBtn) playBtn.setAttribute("disabled", "true");
  } else {
    setText(hintEl, "Opens a full-width video modal.");
    if (playBtn) playBtn.removeAttribute("disabled");
  }

  const isShort = YOUTUBE_URL.includes("shorts");
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

  function open() {
    if (!hasVideo || !dialog || !frame) return;
    frame.innerHTML = "";
    frame.classList.toggle("video-frame--short", isShort);
    dialog.classList.toggle("video-modal--short", isShort);

    const thumbnail = document.createElement("div");
    thumbnail.className = "video-thumbnail";
    thumbnail.setAttribute("role", "button");
    thumbnail.tabIndex = 0;
    thumbnail.setAttribute("aria-label", "Play video");

    const img = document.createElement("img");
    img.src = thumbUrl;
    img.alt = "";
    img.loading = "eager";
    img.dataset.videoThumb = "1";

    const playBtnOverlay = document.createElement("span");
    playBtnOverlay.className = "video-thumbnail-play";
    playBtnOverlay.setAttribute("aria-hidden", "true");

    thumbnail.appendChild(img);
    thumbnail.appendChild(playBtnOverlay);

    function playVideo() {
      thumbnail.remove();
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
        videoId,
      )}?autoplay=1&rel=0&modestbranding=1`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.title = "Aglio demo video";
      frame.appendChild(iframe);
    }

    thumbnail.addEventListener("click", playVideo);
    thumbnail.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playVideo();
      }
    });

    frame.appendChild(thumbnail);
    dialog.showModal();
  }

  function close() {
    if (!dialog || !frame) return;
    dialog.close();
    frame.innerHTML = "";
    dialog.classList.remove("video-modal--short");
  }

  playBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  dialog?.addEventListener("click", (e) => {
    // click outside modal inner closes
    if (e.target === dialog) close();
  });
  dialog?.addEventListener("cancel", close);
}

document.addEventListener("DOMContentLoaded", main);
