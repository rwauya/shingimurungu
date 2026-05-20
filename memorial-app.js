/*
  HOW TO ADD MY OWN PHOTOS AND VIDEOS

  Browser security does not allow a static HTML file to edit files or watch a
  folder by itself. The site reads ./media-manifest.js, which is generated from
  the real files in ./images by running:

    .\venv\Scripts\python.exe tools\sync_media_manifest.py

  To keep it updated while adding/removing files locally, run:

    .\venv\Scripts\python.exe tools\sync_media_manifest.py --watch

  Keep files inside the ./images folder. Use memorialData.mediaItems below only
  for optional titles/captions/metadata; if media-manifest.js exists, only files
  currently present in the manifest are displayed.
*/

function media(filename, details = {}) {
  const src = filename.startsWith("./") ? filename : `./images/${filename}`;
  const type = details.type || detectMediaType(src);
  const fallbackTitle = titleFromFilename(filename, type);

  return {
    src,
    type,
    title: details.title || fallbackTitle,
    caption: details.caption || "A memory held in the family archive.",
    date: details.date || inferDateFromFilename(filename),
    alt: details.alt || defaultAltText(type),
    featured: Boolean(details.featured),
    orientation: details.orientation || "",
    transcript: details.transcript || "",
    sphereThumbSrc: details.sphereThumbSrc || sphereThumbSrcFor(filename, type),
    galleryThumbSrc: details.galleryThumbSrc || galleryThumbSrcFor(filename, type),
    thumbSrc: details.thumbSrc || thumbnailSrcFor(filename, type),
    safeThumbSrc: details.safeThumbSrc || safeThumbnailSrcFor(filename, type),
    posterSrc: details.posterSrc || posterSrcFor(filename, type)
  };
}

function getExtension(src) {
  const clean = src.split("?")[0].split("#")[0];
  const match = clean.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "";
}

function sourceKey(src) {
  return String(src || "")
    .replace(/\\/g, "/")
    .replace(/^\.?\/*images\//, "")
    .replace(/^\.?\//, "")
    .trim();
}

function detectMediaType(src) {
  const extension = getExtension(src);
  if (["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(extension)) return "image";
  if (["mp4", "webm", "mov", "m4v"].includes(extension)) return "video";
  return "file";
}

function thumbnailSrcFor(filename, type) {
  const extension = getExtension(filename);
  if (type !== "image" || !["jpg", "jpeg", "png", "webp"].includes(extension)) return "";
  const clean = filename.replace(/^\.\/images\//, "").replace(/^images\//, "");
  const stem = clean.replace(/\.[^.]+$/, "");
  return `./images/optimized/thumbs/${stem}.webp`;
}

function safeThumbnailSrcFor(filename, type) {
  const extension = getExtension(filename);
  if (type !== "image" || !["jpg", "jpeg", "png", "webp"].includes(extension)) return "";
  const clean = filename.replace(/^\.\/images\//, "").replace(/^images\//, "");
  const stem = clean.replace(/\.[^.]+$/, "");
  return `./images/optimized/safe-thumbs/${stem}.webp`;
}

function sphereThumbSrcFor(filename, type) {
  const extension = getExtension(filename);
  const clean = filename.replace(/^\.\/images\//, "").replace(/^images\//, "");
  const stem = clean.replace(/\.[^.]+$/, "");
  if (type === "image" && ["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return `./images/optimized/sphere-thumbs/${stem}.webp`;
  }
  if (type === "video") {
    return `./images/optimized/video-posters/${stem}.webp`;
  }
  return "";
}

function galleryThumbSrcFor(filename, type) {
  const extension = getExtension(filename);
  if (type !== "image" || !["jpg", "jpeg", "png", "webp"].includes(extension)) return "";
  const clean = filename.replace(/^\.\/images\//, "").replace(/^images\//, "");
  const stem = clean.replace(/\.[^.]+$/, "");
  return `./images/optimized/gallery-thumbs/${stem}.webp`;
}

function posterSrcFor(filename, type) {
  if (type !== "video") return "";
  const clean = filename.replace(/^\.\/images\//, "").replace(/^images\//, "");
  const stem = clean.replace(/\.[^.]+$/, "");
  return `./images/optimized/video-posters/${stem}.webp`;
}

function titleFromFilename(filename, type) {
  const clean = sourceKey(filename);
  if (/murungu/i.test(clean)) return "Murungu";
  if (/^VIDEO-/i.test(clean)) return "Video Remembrance";
  if (/^PHOTO-/i.test(clean)) return "Family Photograph";
  if (type === "video") return "Video Memory";
  return "Family Memory";
}

function inferDateFromFilename(filename) {
  const match = filename.match(/(?:PHOTO|VIDEO)-(\d{4})-(\d{2})-(\d{2})/i);
  if (!match) return "Family archive";

  const [, year, month, day] = match;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function defaultAltText(type) {
  if (type === "video") return "Video from the Shingai Glen Mwedzi memorial archive";
  return "Photo from the Shingai Glen Mwedzi memorial archive";
}

/* EDITABLE MEMORIAL CONTENT */
const memorialData = {
  relativeName: "Shingai Glen Mwedzi",
  nickname: "Murungu",
  memorialSubtitle: "In loving memory",
  sunrise: "11-12-1999",
  sunset: "06-05-2026",
  laidToRest: "09-05-2026",
  heroImage: "./images/optimized/murungu-backdrop.webp",
  heroPortraitImage: "./images/optimized/murungu-portrait.webp",
  heroPortraitAlt: "Portrait of Shingai Glen Mwedzi, Murungu, wearing a red jacket and sunglasses",
  videoIntro: "Some memories live most clearly in motion: a turn of the head, a familiar expression, a voice, a laugh, a brief moment that brings someone close again.",
  closingMessage: "Forever remembered with love, with gratitude, and with the quiet certainty that his presence continues in every story, photograph, and heart that carries him.",
  mediaItems: [
    media("murungu.jpeg", {
      title: "Murungu",
      caption: "The portrait that anchors this remembrance.",
      date: "A treasured portrait",
      alt: "Portrait of Shingai Glen Mwedzi, Murungu, wearing a red jacket and sunglasses",
      featured: true,
      orientation: "portrait"
    }),
    media("494c7170-be10-490d-83fe-19508d037b28.MP4", { title: "Video Remembrance", featured: true }),
    media("657c48e9-89f1-41c0-9593-b27c272b5964.MP4"),
    media("b6cb800d-1ab1-4a9d-8439-fcf241bd4870.MP4"),
    media("IMG_6578.JPG", { title: "Family Moment", caption: "A bright memory held close.", featured: true, orientation: "portrait" }),
    media("IMG_6579.JPG"),
    media("IMG_6580.JPG", { title: "Together", caption: "A moment surrounded by family.", featured: true, orientation: "landscape" }),
    media("IMG_6583.JPG"),
    media("IMG_6585.JPG"),
    media("IMG_6586.JPG"),
    media("IMG_6587.JPG"),
    media("IMG_6588.JPG"),
    media("IMG_6591.JPG"),
    media("IMG_6592.JPG"),
    media("IMG_6593.JPG"),
    media("IMG_6594.JPG"),
    media("IMG_6595.JPG"),
    media("IMG_6596.JPG"),
    media("IMG_6597.JPG"),
    media("IMG_6598.JPG"),
    media("IMG_6602.JPG"),
    media("IMG_6603.JPG"),
    media("IMG_6610.JPG"),
    media("IMG_6614.JPG"),
    media("IMG_6688.JPG"),
    media("IMG_6689.JPG"),
    media("IMG_6694.JPG"),
    media("IMG_6707.JPG"),
    media("IMG_6708.JPG"),
    media("IMG_6709.JPG"),
    media("converted/IMG_6873.jpg"),
    media("converted/IMG_6888.jpg"),
    media("converted/IMG_7003.jpg"),
    media("converted/IMG_7004.jpg"),
    media("converted/IMG_7005.jpg"),
    media("converted/IMG_7006.jpg"),
    media("converted/IMG_7006(1).jpg"),
    media("converted/IMG_7007.jpg"),
    media("converted/IMG_7007(1).jpg"),
    media("converted/IMG_7008.jpg"),
    media("converted/IMG_7009.jpg"),
    media("converted/IMG_7009(1).jpg"),
    media("converted/IMG_7010.jpg"),
    media("converted/IMG_7010(1).jpg"),
    media("converted/IMG_7011.jpg"),
    media("converted/IMG_7011(1).jpg"),
    media("converted/IMG_7012.jpg"),
    media("converted/IMG_7012(1).jpg"),
    media("converted/IMG_7013.jpg"),
    media("converted/IMG_7013(1).jpg"),
    media("converted/IMG_7014.jpg"),
    media("converted/IMG_7014(1).jpg"),
    media("converted/IMG_7015.jpg"),
    media("converted/IMG_7015(1).jpg"),
    media("converted/IMG_7016.jpg"),
    media("converted/IMG_7016(1).jpg"),
    media("converted/IMG_7017.jpg"),
    media("converted/IMG_7017(1).jpg"),
    media("converted/IMG_7018.jpg"),
    media("converted/IMG_7019.jpg"),
    media("converted/IMG_7020.jpg"),
    media("converted/IMG_7131.jpg"),
    media("converted/IMG_7131(1).jpg"),
    media("converted/IMG_7132.jpg"),
    media("converted/IMG_7132(1).jpg"),
    media("converted/IMG_7133.jpg"),
    media("converted/IMG_7133(1).jpg"),
    media("converted/IMG_7134.jpg"),
    media("converted/IMG_7134(1).jpg"),
    media("converted/IMG_7135.jpg"),
    media("converted/IMG_7135(1).jpg"),
    media("converted/IMG_7136.jpg"),
    media("IMG_7137.MOV"),
    media("IMG_7137(1).MOV"),
    media("converted/IMG_7138.jpg"),
    media("converted/IMG_7138(1).jpg"),
    media("converted/IMG_7139.jpg"),
    media("converted/IMG_7139(1).jpg"),
    media("converted/IMG_7140.jpg"),
    media("converted/IMG_7140(1).jpg"),
    media("converted/IMG_7141.jpg"),
    media("converted/IMG_7141(1).jpg"),
    media("converted/IMG_7142.jpg"),
    media("converted/IMG_7142(1).jpg"),
    media("converted/IMG_7143.jpg"),
    media("converted/IMG_7143(1).jpg"),
    media("converted/IMG_7144.jpg"),
    media("converted/IMG_7144(1).jpg"),
    media("converted/IMG_7150.jpg"),
    media("converted/IMG_7150(1).jpg"),
    media("converted/IMG_7151.jpg"),
    media("converted/IMG_7151(1).jpg"),
    media("converted/IMG_7152.jpg"),
    media("converted/IMG_7152(1).jpg"),
    media("converted/IMG_7153.jpg"),
    media("converted/IMG_7153(1).jpg"),
    media("converted/IMG_7154.jpg"),
    media("converted/IMG_7154(1).jpg"),
    media("converted/IMG_7155.jpg"),
    media("converted/IMG_7155(1).jpg"),
    media("converted/IMG_7156.jpg"),
    media("converted/IMG_7156(1).jpg"),
    media("converted/IMG_7157.jpg"),
    media("converted/IMG_7157(1).jpg"),
    media("converted/IMG_7158.jpg"),
    media("converted/IMG_7158(1).jpg"),
    media("converted/IMG_7159.jpg"),
    media("converted/IMG_7159(1).jpg"),
    media("converted/IMG_7160.jpg"),
    media("converted/IMG_7160(1).jpg"),
    media("converted/IMG_7161.jpg"),
    media("converted/IMG_7161(1).jpg"),
    media("converted/IMG_7162.jpg"),
    media("converted/IMG_7162(1).jpg"),
    media("converted/IMG_7163.jpg"),
    media("converted/IMG_7163(1).jpg"),
    media("converted/IMG_7164.jpg"),
    media("converted/IMG_7164(1).jpg"),
    media("converted/IMG_7165.jpg"),
    media("converted/IMG_8332.jpg"),
    media("converted/IMG_8712.jpg"),
    media("IMG_8724.JPG"),
    media("IMG_8724(1).JPG"),
    media("IMG_8740.JPG"),
    media("IMG_8740(1).JPG"),
    media("IMG_8779.JPG"),
    media("IMG_8779(1).JPG"),
    media("converted/IMG_8852.jpg"),
    media("converted/IMG_8854.jpg"),
    media("converted/IMG_8910.jpg"),
    media("converted/IMG_8911.jpg"),
    media("converted/IMG_8912.jpg"),
    media("converted/IMG_8913.jpg"),
    media("converted/IMG_8914.jpg"),
    media("converted/IMG_8915.jpg"),
    media("converted/IMG_8962.jpg"),
    media("converted/IMG_8965.jpg"),
    media("converted/IMG_8965(1).jpg"),
    media("converted/IMG_9004.jpg"),
    media("converted/IMG_9005.jpg"),
    media("converted/IMG_9005(1).jpg"),
    media("converted/IMG_9007.jpg"),
    media("converted/IMG_9007(1).jpg"),
    media("converted/IMG_9008.jpg"),
    media("converted/IMG_9008(1).jpg"),
    media("converted/IMG_9009.jpg"),
    media("converted/IMG_9010.jpg"),
    media("IMG_9018.MOV"),
    media("PHOTO-2026-05-07-07-00-29.jpg"),
    media("PHOTO-2026-05-07-07-23-43.jpg"),
    media("PHOTO-2026-05-07-07-23-43(1).jpg"),
    media("PHOTO-2026-05-07-07-23-43(2).jpg"),
    media("PHOTO-2026-05-07-07-23-43(3).jpg"),
    media("PHOTO-2026-05-07-07-23-44.jpg"),
    media("PHOTO-2026-05-07-07-23-46.jpg"),
    media("PHOTO-2026-05-07-07-23-47.jpg"),
    media("PHOTO-2026-05-07-07-23-47(1).jpg"),
    media("PHOTO-2026-05-07-07-23-47(2).jpg"),
    media("PHOTO-2026-05-07-07-23-49.jpg"),
    media("PHOTO-2026-05-07-07-23-50.jpg"),
    media("PHOTO-2026-05-07-07-25-34.jpg"),
    media("PHOTO-2026-05-07-07-25-34(1).jpg"),
    media("PHOTO-2026-05-07-07-25-34(2).jpg"),
    media("PHOTO-2026-05-07-07-25-34(3).jpg"),
    media("PHOTO-2026-05-07-07-25-34(4).jpg"),
    media("PHOTO-2026-05-07-07-25-34(5).jpg"),
    media("PHOTO-2026-05-07-07-25-34(6).jpg"),
    media("PHOTO-2026-05-07-07-25-35.jpg"),
    media("PHOTO-2026-05-07-07-25-35(1).jpg"),
    media("PHOTO-2026-05-07-07-25-35(2).jpg"),
    media("PHOTO-2026-05-07-07-25-35(3).jpg"),
    media("PHOTO-2026-05-07-07-25-38.jpg"),
    media("PHOTO-2026-05-07-07-25-38(1).jpg"),
    media("PHOTO-2026-05-07-07-25-38(10).jpg"),
    media("PHOTO-2026-05-07-07-25-38(11).jpg"),
    media("PHOTO-2026-05-07-07-25-38(12).jpg"),
    media("PHOTO-2026-05-07-07-25-38(2).jpg"),
    media("PHOTO-2026-05-07-07-25-38(3).jpg"),
    media("PHOTO-2026-05-07-07-25-38(4).jpg"),
    media("PHOTO-2026-05-07-07-25-38(5).jpg"),
    media("PHOTO-2026-05-07-07-25-38(6).jpg"),
    media("PHOTO-2026-05-07-07-25-38(7).jpg"),
    media("PHOTO-2026-05-07-07-25-38(8).jpg"),
    media("PHOTO-2026-05-07-07-25-38(9).jpg"),
    media("PHOTO-2026-05-07-20-58-41.jpg"),
    media("PHOTO-2026-05-08-10-08-40.jpg"),
    media("PHOTO-2026-05-08-10-13-02.jpg"),
    media("PHOTO-2026-05-08-10-13-03.jpg"),
    media("PHOTO-2026-05-08-10-13-03(1).jpg"),
    media("PHOTO-2026-05-08-10-13-04.jpg"),
    media("PHOTO-2026-05-08-10-13-05.jpg"),
    media("PHOTO-2026-05-08-10-13-06.jpg"),
    media("PHOTO-2026-05-08-10-13-06(1).jpg"),
    media("PHOTO-2026-05-08-14-07-36.jpg"),
    media("PHOTO-2026-05-08-14-07-36(1).jpg"),
    media("PHOTO-2026-05-08-14-07-36(2).jpg"),
    media("PHOTO-2026-05-08-14-07-36(3).jpg"),
    media("PHOTO-2026-05-08-15-40-04.jpg"),
    media("PHOTO-2026-05-08-23-51-16.jpg"),
    media("PHOTO-2026-05-10-09-34-41.jpg"),
    media("PHOTO-2026-05-10-09-34-42.jpg"),
    media("PHOTO-2026-05-16-12-49-38.jpg"),
    media("PHOTO-2026-05-16-12-49-39.jpg"),
    media("PHOTO-2026-05-16-12-49-39(1).jpg"),
    media("VIDEO-2026-05-07-20-53-28.mp4"),
    media("VIDEO-2026-05-08-23-51-16.mp4"),
    media("VIDEO-2026-05-17-20-56-17.mp4")
  ]
};

const state = {
  currentFilter: "all",
  galleryExpanded: false,
  galleryRenderToken: 0,
  lightboxItems: [],
  lightboxIndex: 0,
  lastFocusedElement: null,
  sphere: {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    zoom: 0.72,
    baseZoom: 0.72,
    userZoomed: false,
    focusIndex: 0,
    spyMode: true,
    handTool: false,
    frozen: false,
    dragging: false,
    velocityX: 0,
    velocityY: 0,
    inertiaFrame: 0,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
    moved: false,
    pendingSrc: "",
    lastOpenedSrc: "",
    lastOpenedAt: 0,
    items: [],
    positions: [],
    idleFrame: 0,
    lastInteraction: 0
  }
};

const SPHERE_MIN_ZOOM = 0.42;
const SPHERE_MAX_ZOOM = 0.9;
const SPHERE_FOCUS_ZOOM = 0.86;
const GALLERY_BATCH_SIZE = 48;

const selectors = {
  loader: "[data-loader]",
  header: "[data-header]",
  heroImage: "#hero-image",
  heroPortraitImage: "#hero-portrait-image",
  memorialSubtitle: "#memorial-subtitle",
  personName: "#person-name",
  nickname: "#nickname",
  sunrise: "#sunrise",
  sunset: "#sunset",
  laidToRest: "#laid-to-rest",
  memorySphere: "#memory-sphere",
  sphereControls: "[data-sphere-action]",
  sphereSpy: "#sphere-spy",
  galleryPanel: "#gallery-panel",
  galleryReveal: "#gallery-reveal",
  galleryImagesGrid: "#gallery-images-grid",
  galleryVideosGrid: "#gallery-videos-grid",
  galleryImagesSection: "#images-gallery-section",
  galleryVideosSection: "#videos-gallery-section",
  galleryEmpty: "#gallery-empty",
  filterTabs: ".filter-tab",
  closingMessage: "#closing-message",
  closingDates: "#closing-dates",
  lightbox: "#lightbox",
  lightboxStage: "#lightbox-stage",
  lightboxTitle: "#lightbox-title",
  lightboxCaption: "#lightbox-caption",
  lightboxDate: "#lightbox-date",
  lightboxTranscript: "#lightbox-transcript"
};

let mediaItems = [];

document.addEventListener("DOMContentLoaded", init);

function init() {
  try {
    mediaItems = normaliseMediaItems(resolveMediaItems());
    applyMemorialData();
    renderMemorySphere();
    renderGallery();
    bindInteractions();
    setupReveal();
  } catch (error) {
    console.error("The memorial app could not finish initializing.", error);
  } finally {
    window.setTimeout(hideLoader, 180);
  }
}

function hideLoader() {
  document.body.classList.add("is-ready");
  const loader = document.querySelector(selectors.loader);
  if (loader) loader.classList.add("is-hidden");
}

function normaliseMediaItems(items) {
  return items
    .filter(Boolean)
    .map((item) => {
      const normalised = typeof item === "string" ? media(item) : item;
      return {
        ...normalised,
        type: normalised.type || detectMediaType(normalised.src),
        title: normalised.title || titleFromFilename(normalised.src, normalised.type),
        caption: normalised.caption || "A memory held in the family archive.",
        date: normalised.date || inferDateFromFilename(normalised.src),
        alt: normalised.alt || defaultAltText(normalised.type),
        sphereThumbSrc: normalised.sphereThumbSrc || sphereThumbSrcFor(normalised.src, normalised.type),
        galleryThumbSrc: normalised.galleryThumbSrc || galleryThumbSrcFor(normalised.src, normalised.type),
        thumbSrc: normalised.thumbSrc || thumbnailSrcFor(normalised.src, normalised.type),
        safeThumbSrc: normalised.safeThumbSrc || safeThumbnailSrcFor(normalised.src, normalised.type),
        posterSrc: normalised.posterSrc || posterSrcFor(normalised.src, normalised.type)
      };
    });
}

function resolveMediaItems() {
  const manifest = Array.isArray(window.memorialMediaManifest) ? window.memorialMediaManifest : [];
  if (!manifest.length) return memorialData.mediaItems;

  const metadataBySource = new Map(
    memorialData.mediaItems
      .filter(Boolean)
      .map((item) => {
        const normalised = typeof item === "string" ? media(item) : item;
        return [sourceKey(normalised.src), normalised];
      })
  );

  return manifest
    .map((entry) => {
      const filename = typeof entry === "string" ? entry : (entry.filename || entry.src || "");
      const key = sourceKey(filename);
      if (!key) return null;
      const details = metadataBySource.get(key) || {};
      return media(key, { ...details, ...(typeof entry === "object" ? entry : {}) });
    })
    .filter(Boolean);
}

function applyMemorialData() {
  setText(selectors.memorialSubtitle, memorialData.memorialSubtitle);
  setText(selectors.personName, memorialData.relativeName);
  setText(selectors.nickname, memorialData.nickname);
  setText(selectors.sunrise, memorialData.sunrise);
  setText(selectors.sunset, memorialData.sunset);
  setText(selectors.laidToRest, memorialData.laidToRest);
  setText(selectors.closingMessage, memorialData.closingMessage);
  setText(selectors.closingDates, `${memorialData.sunrise} - ${memorialData.sunset}`);
  const heroImage = document.querySelector(selectors.heroImage);
  if (heroImage) {
    heroImage.src = memorialData.heroImage;
    heroImage.alt = "";
  }

  const heroPortraitImage = document.querySelector(selectors.heroPortraitImage);
  if (heroPortraitImage) {
    heroPortraitImage.src = memorialData.heroPortraitImage || "./images/murungu.jpeg";
    heroPortraitImage.alt = memorialData.heroPortraitAlt || defaultAltText("image");
  }

  document.title = `${memorialData.relativeName} | ${memorialData.memorialSubtitle}`;
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text || "";
}

function renderMemorySphere() {
  const sphere = document.querySelector(selectors.memorySphere);
  if (!sphere) return;

  sphere.replaceChildren();
  const sourceItems = getGalleryMedia();
  const sphereItems = getSphereDisplayItems(sourceItems);
  const metrics = getSphereMetrics(sphereItems.length);
  const shell = sphere.closest(".memory-sphere");
  const fragment = document.createDocumentFragment();
  state.sphere.items = sphereItems;
  state.sphere.positions = [];
  state.sphere.baseZoom = getDefaultSphereZoom(metrics, shell);
  if (!state.sphere.userZoomed) {
    state.sphere.zoom = clamp(state.sphere.baseZoom, SPHERE_MIN_ZOOM, SPHERE_MAX_ZOOM);
  }

  if (shell) {
    shell.style.setProperty("--sphere-stage-size", `${metrics.stageSize}px`);
    shell.style.setProperty("--sphere-diameter", `${metrics.sphereDiameter}px`);
    shell.style.setProperty("--tile-base", `${metrics.tileBase}px`);
  }

  sphereItems.forEach((item, index) => {
    const tile = document.createElement("button");
    const cell = metrics.cells[index];
    tile.className = `sphere-tile${item.type === "video" ? " sphere-tile--video" : ""}`;
    tile.type = "button";
    tile.dataset.src = item.src;
    tile.dataset.index = String(index);
    tile.setAttribute("aria-label", `Open ${item.title} in the memorial viewer`);

    const rotateY = cell.rotateY;
    const rotateX = cell.rotateX;
    state.sphere.positions.push({ rotateX, rotateY });
    tile.style.setProperty("--rotate-y", `${rotateY}deg`);
    tile.style.setProperty("--rotate-x", `${rotateX}deg`);
    tile.style.setProperty("--depth", `${metrics.depth}px`);
    tile.style.setProperty("--tile-width", `${cell.width}px`);
    tile.style.setProperty("--tile-height", `${cell.height}px`);

    const tileSkin = document.createElement("span");
    tileSkin.className = "sphere-tile__skin";
    const thumbCandidates = getSphereThumbCandidates(item);
    if (thumbCandidates.length) {
      const img = document.createElement("img");
      img.src = thumbCandidates[0];
      img.alt = "";
      img.decoding = "async";
      img.loading = "lazy";
      attachImageFallback(img, thumbCandidates, () => {
        tileSkin.textContent = item.type === "video" ? "Video" : "Photo";
      });
      tileSkin.append(img);
    } else {
      tileSkin.textContent = item.type === "video" ? "Video" : "Photo";
    }
    tile.append(tileSkin);

    fragment.append(tile);
  });

  sphere.append(fragment);
  updateSphereTransform();
}

function getGalleryMedia() {
  return getFilteredMedia();
}

function getSphereDisplayItems(items) {
  if (items.length === 0) return [];
  const minimumTiles = items.length < 24 ? 72 : 0;
  if (!minimumTiles) return items;

  return Array.from({ length: minimumTiles }, (_, index) => items[index % items.length]);
}

function getSphereThumbCandidates(item) {
  if (item.type === "video") return uniqueSources([item.sphereThumbSrc, item.posterSrc]);
  return uniqueSources([item.sphereThumbSrc, item.galleryThumbSrc, item.safeThumbSrc, item.thumbSrc, item.src]);
}

function getGalleryThumbCandidates(item) {
  if (item.type === "video") return uniqueSources([item.posterSrc]);
  return uniqueSources([item.galleryThumbSrc, item.safeThumbSrc, item.thumbSrc, item.src]);
}

function uniqueSources(sources) {
  return sources.filter(Boolean).filter((src, index, list) => list.indexOf(src) === index);
}

function getSphereMetrics(count) {
  const density = Math.sqrt(Math.max(count, 1));
  const baseDepth = clamp(580 + density * 11, 680, 1900);
  const depth = baseDepth + 16;
  const sphereDiameter = depth * 2;
  const stageSize = sphereDiameter;
  const cells = createSphereSurfaceCells(count, depth);
  return {
    depth,
    sphereDiameter,
    stageSize,
    tileBase: clamp(78 - density * 0.85, 24, 70),
    viewHeight: clamp(sphereDiameter * 0.82 + 180, 760, 2600),
    cells
  };
}

function createSphereSurfaceCells(total, radius) {
  if (!total) return [];

  const rowCount = Math.min(total, clamp(Math.round(Math.sqrt(total) * 1.25), 5, 80));
  const weights = Array.from({ length: rowCount }, (_, row) => {
    const latitude = -Math.PI / 2 + ((row + 0.5) / rowCount) * Math.PI;
    return Math.max(Math.cos(latitude), 0.12);
  });
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const rawCounts = weights.map((weight) => (weight / weightTotal) * total);
  const rowCounts = rawCounts.map((value) => Math.max(1, Math.floor(value)));
  let assigned = rowCounts.reduce((sum, count) => sum + count, 0);

  while (assigned > total) {
    let candidate = 0;
    for (let index = 1; index < rowCounts.length; index += 1) {
      if (rowCounts[index] > rowCounts[candidate]) candidate = index;
    }
    rowCounts[candidate] -= 1;
    assigned -= 1;
  }

  const remainders = rawCounts
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let index = 0; assigned < total; index += 1) {
    rowCounts[remainders[index % remainders.length].index] += 1;
    assigned += 1;
  }

  const cells = [];
  const rowHeight = (Math.PI * radius) / rowCount;
  const fillRatio = total > 1200 ? 0.93 : 0.86;
  rowCounts.forEach((columns, row) => {
    const latitude = -Math.PI / 2 + ((row + 0.5) / rowCount) * Math.PI;
    const circumference = Math.max(2 * Math.PI * radius * Math.cos(latitude), rowHeight * 1.2);
    const tileWidth = (circumference / columns) * fillRatio;
    const tileHeight = rowHeight * fillRatio;
    const rowOffset = row % 2 ? 0.5 : 0;

    for (let column = 0; column < columns; column += 1) {
      const longitude = ((column + rowOffset) / columns) * 360;
      cells.push({
        rotateY: longitude,
        rotateX: latitude * 180 / Math.PI,
        width: tileWidth,
        height: tileHeight
      });
    }
  });

  return cells;
}

function getDefaultSphereZoom(metrics, shell) {
  const availableWidth = Math.max(320, (shell ? shell.clientWidth : window.innerWidth) - 28);
  const fitZoom = (availableWidth / metrics.stageSize) * 0.9;
  return clamp(fitZoom, 0.38, 0.82);
}

function renderGallery() {
  const imagesGrid = document.querySelector(selectors.galleryImagesGrid);
  const videosGrid = document.querySelector(selectors.galleryVideosGrid);
  const imagesSection = document.querySelector(selectors.galleryImagesSection);
  const videosSection = document.querySelector(selectors.galleryVideosSection);
  const empty = document.querySelector(selectors.galleryEmpty);
  if (!imagesGrid || !videosGrid || !imagesSection || !videosSection || !empty) return;

  const token = state.galleryRenderToken + 1;
  state.galleryRenderToken = token;
  const images = mediaItems.filter((item) => item.type === "image");
  const videos = mediaItems.filter((item) => item.type === "video");
  imagesGrid.replaceChildren();
  videosGrid.replaceChildren();

  empty.hidden = (images.length + videos.length) !== 0 || !state.galleryExpanded;
  imagesSection.hidden = images.length === 0 || !state.galleryExpanded;
  videosSection.hidden = videos.length === 0 || !state.galleryExpanded;

  if (state.galleryExpanded) {
    appendGalleryBatch(imagesGrid, images, images, token);
    appendGalleryBatch(videosGrid, videos, videos, token);
  }
}

function appendGalleryBatch(grid, items, lightboxScope, token, start = 0) {
  if (!items.length || token !== state.galleryRenderToken) return;

  const end = Math.min(start + GALLERY_BATCH_SIZE, items.length);
  const fragment = document.createDocumentFragment();
  for (let index = start; index < end; index += 1) {
    fragment.append(createGalleryCard(items[index], lightboxScope));
  }
  grid.append(fragment);

  if (end < items.length) {
    scheduleIdleWork(() => appendGalleryBatch(grid, items, lightboxScope, token, end));
  }
}

function scheduleIdleWork(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 220 });
    return;
  }
  window.setTimeout(callback, 24);
}

function getFilteredMedia() {
  if (state.currentFilter === "photos") return mediaItems.filter((item) => item.type === "image");
  if (state.currentFilter === "videos") return mediaItems.filter((item) => item.type === "video");
  return mediaItems.filter((item) => item.type === "image" || item.type === "video");
}

function createGalleryCard(item, lightboxScope) {
  const article = document.createElement("article");
  article.className = "media-card";
  article.setAttribute("aria-label", item.title || "Memory");
  if (item.orientation) article.classList.add(`is-${item.orientation}`);
  if (item.type === "video") article.classList.add("is-video");

  const figure = document.createElement("figure");
  const frame = document.createElement("div");
  frame.className = "media-frame";

  const mediaElement = createMediaPreview(item, {
    controls: false,
    lazy: true,
    preload: "none",
    posterOnly: true,
    frame,
    card: article
  });
  frame.append(mediaElement);

  const openButton = document.createElement("button");
  openButton.className = "media-open-button";
  openButton.type = "button";
  openButton.textContent = `Open ${item.title}`;
  openButton.setAttribute("aria-label", `Open ${item.title} in the memorial viewer`);
  openButton.addEventListener("click", () => openLightboxBySrc(item.src, lightboxScope));
  frame.append(openButton);

  figure.append(frame);
  article.append(figure);
  return article;
}

function createMediaPreview(item, options = {}) {
  if (item.type === "video") return createVideoPreview(item, options);
  if (item.type === "image") return createImagePreview(item, options);
  return createFallback(item, "This file type is listed but cannot be previewed here.");
}

function createImagePreview(item, options = {}) {
  if (isHeic(item.src)) {
    return createFallback(item, unsupportedMessage(item));
  }

  const sources = options.original ? [item.src] : getGalleryThumbCandidates(item);
  const img = document.createElement("img");
  img.src = sources[0] || item.src;
  img.alt = options.decorative ? "" : item.alt;
  img.decoding = "async";
  if (options.lazy) img.loading = "lazy";

  img.addEventListener("load", () => {
    if (options.card && !item.orientation) {
      options.card.classList.toggle("is-landscape", img.naturalWidth >= img.naturalHeight);
      options.card.classList.toggle("is-portrait", img.naturalWidth < img.naturalHeight);
    }
  });

  attachImageFallback(img, sources, () => {
    const fallback = createFallback(item, unsupportedMessage(item));
    if (options.frame) options.frame.replaceChildren(fallback);
    else img.replaceWith(fallback);
  });

  return img;
}

function attachImageFallback(img, sources, onEmpty) {
  let sourceIndex = 0;
  img.addEventListener("error", () => {
    sourceIndex += 1;
    if (sourceIndex < sources.length) {
      img.src = sources[sourceIndex];
      return;
    }
    if (typeof onEmpty === "function") onEmpty();
  });
}

function createVideoPreview(item, options = {}) {
  if (options.posterOnly && item.posterSrc) {
    const img = document.createElement("img");
    img.src = item.posterSrc;
    img.alt = options.decorative ? "" : item.alt;
    img.decoding = "async";
    if (options.lazy) img.loading = "lazy";
    return img;
  }

  const video = document.createElement("video");
  video.src = item.src;
  if (item.posterSrc) video.poster = item.posterSrc;
  video.controls = Boolean(options.controls);
  video.preload = options.preload || (options.controls ? "metadata" : "none");
  video.playsInline = true;
  video.setAttribute("aria-label", item.alt || item.title);
  if (!options.controls) {
    video.muted = true;
  }

  video.addEventListener("loadedmetadata", () => {
    if (options.card && !item.orientation && video.videoWidth && video.videoHeight) {
      options.card.classList.toggle("is-landscape", video.videoWidth >= video.videoHeight);
      options.card.classList.toggle("is-portrait", video.videoWidth < video.videoHeight);
    }
  });

  video.addEventListener("error", () => {
    const fallback = createFallback(item, unsupportedMessage(item));
    if (options.frame) options.frame.replaceChildren(fallback);
    else video.replaceWith(fallback);
  });

  return video;
}

function unsupportedMessage(item) {
  const extension = getExtension(item.src).toUpperCase();
  if (["HEIC", "HEIF"].includes(extension)) {
    return "This HEIC image may not preview in every browser. The original file is still available.";
  }
  if (extension === "MOV") {
    return "This MOV video may not play in every browser. The original file is still available.";
  }
  return "This memory could not be previewed in the browser.";
}

function isHeic(src) {
  return ["heic", "heif"].includes(getExtension(src));
}

function createFallback(item, message) {
  const fallback = document.createElement("div");
  fallback.className = "media-fallback";
  const title = document.createElement("strong");
  title.textContent = item.title || "Memory";
  const text = document.createElement("span");
  text.textContent = message;
  const link = document.createElement("a");
  link.href = item.src;
  link.textContent = "Open Original";
  link.setAttribute("aria-label", `Open original file for ${item.title || "this memory"}`);
  fallback.append(title, text, link);
  return fallback;
}

function createMeta(text) {
  const meta = document.createElement("p");
  meta.className = "media-date";
  meta.textContent = text || "Family archive";
  return meta;
}

function createHeading(level, text) {
  const heading = document.createElement(level);
  heading.textContent = text || "";
  return heading;
}

function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text || "";
  return paragraph;
}

function bindInteractions() {
  const header = document.querySelector(selectors.header);
  const lightbox = document.querySelector(selectors.lightbox);

  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }, { passive: true });

  window.addEventListener("resize", debounce(() => {
    state.sphere.userZoomed = false;
    renderMemorySphere();
  }, 160), { passive: true });

  document.querySelectorAll(selectors.filterTabs).forEach((button) => {
    button.addEventListener("click", () => {
      state.currentFilter = button.dataset.filter || "all";
      state.sphere.rotationX = 0;
      state.sphere.rotationY = 0;
      state.sphere.rotationZ = 0;
      state.sphere.focusIndex = 0;
      state.sphere.userZoomed = false;
      cancelSphereInertia();
      clearSphereFocus();
      renderSphereSpy(null);
      document.querySelectorAll(selectors.filterTabs).forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", String(active));
      });
      renderMemorySphere();
      renderGallery();
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-close-lightbox]").forEach((element) => {
      element.addEventListener("click", closeLightbox);
    });

    const prev = lightbox.querySelector("[data-lightbox-prev]");
    const next = lightbox.querySelector("[data-lightbox-next]");
    if (prev) prev.addEventListener("click", showPreviousMemory);
    if (next) next.addEventListener("click", showNextMemory);
  }

  document.addEventListener("keydown", handleKeyboard);
  bindGalleryReveal();
  bindSphereToolbar();
  bindHandControls();
  bindSphereControls();
  startSphereDrift();
}

function bindGalleryReveal() {
  const reveal = document.querySelector(selectors.galleryReveal);
  const panel = document.querySelector(selectors.galleryPanel);
  if (!reveal || !panel) return;

  reveal.addEventListener("click", () => {
    state.galleryExpanded = !state.galleryExpanded;
    panel.hidden = !state.galleryExpanded;
    reveal.setAttribute("aria-expanded", String(state.galleryExpanded));
    const label = reveal.querySelector("span");
    if (label) label.textContent = state.galleryExpanded ? "Close Full Gallery" : "Open Full Gallery";
    renderGallery();
  });
}

function bindSphereToolbar() {
  document.querySelectorAll(selectors.sphereControls).forEach((button) => {
    button.addEventListener("click", () => handleSphereAction(button.dataset.sphereAction || "", button));
  });
}

function handleSphereAction(action, button) {
  if (action === "freeze") {
    state.sphere.frozen = !state.sphere.frozen;
    if (state.sphere.frozen) cancelSphereInertia();
    if (button) {
      button.setAttribute("aria-pressed", String(state.sphere.frozen));
      button.textContent = state.sphere.frozen ? "Resume Motion" : "Pause Motion";
    }
  }
  if (action === "zoom-in") {
    state.sphere.zoom = clamp(state.sphere.zoom + 0.1, SPHERE_MIN_ZOOM, SPHERE_MAX_ZOOM);
    state.sphere.userZoomed = true;
  }
  if (action === "zoom-out") {
    state.sphere.zoom = clamp(state.sphere.zoom - 0.1, SPHERE_MIN_ZOOM, SPHERE_MAX_ZOOM);
    state.sphere.userZoomed = true;
  }
  if (action === "hand-tool") {
    setHandTool(!state.sphere.handTool, button);
    return;
  }
  if (action === "reset") {
    cancelSphereInertia();
    state.sphere.rotationX = 0;
    state.sphere.rotationY = 0;
    state.sphere.rotationZ = 0;
    state.sphere.zoom = state.sphere.baseZoom || 0.72;
    state.sphere.userZoomed = false;
    state.sphere.focusIndex = 0;
    setHandTool(false);
    clearSphereFocus();
    renderSphereSpy(null);
  }
  if (action === "snipe") {
    focusSphereItem(state.sphere.focusIndex + 1, state.sphere.spyMode);
    return;
  }
  if (action === "open-focused") {
    const item = state.sphere.items[state.sphere.focusIndex];
    if (item) openLightboxBySrc(item.src, getFilteredMedia());
    return;
  }
  if (action === "spy") {
    state.sphere.spyMode = !state.sphere.spyMode;
    if (button) {
      button.setAttribute("aria-pressed", String(state.sphere.spyMode));
      button.textContent = state.sphere.spyMode ? "Hide Preview" : "Show Preview";
    }
    if (state.sphere.spyMode) {
      focusSphereItem(state.sphere.focusIndex, true);
      return;
    }
    renderSphereSpy(null);
  }
  state.sphere.lastInteraction = performance.now();
  updateSphereTransform();
}

function bindSphereControls() {
  const sphere = document.querySelector(selectors.memorySphere);
  if (!sphere) return;
  const shell = sphere.closest(".memory-sphere");
  const preview = document.querySelector(selectors.sphereSpy);

  if (shell) {
    shell.addEventListener("pointerleave", () => {
      scheduleSphereSpyHide(0);
    });
  }

  if (preview) {
    preview.addEventListener("pointerenter", () => {
      window.clearTimeout(renderSphereSpy.hideTimer);
    });
    preview.addEventListener("pointerleave", () => {
      scheduleSphereSpyHide(80);
    });
  }

  sphere.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const tile = event.target.closest(".sphere-tile");
    cancelSphereInertia();
    renderSphereSpy(null);
    state.sphere.dragging = true;
    state.sphere.lastX = event.clientX;
    state.sphere.lastY = event.clientY;
    state.sphere.startX = event.clientX;
    state.sphere.startY = event.clientY;
    state.sphere.moved = false;
    state.sphere.pendingSrc = tile ? tile.dataset.src || "" : "";
    state.sphere.lastInteraction = performance.now();
    sphere.classList.add("is-dragging");
    sphere.setPointerCapture(event.pointerId);
  });

  sphere.addEventListener("pointermove", (event) => {
    if (!state.sphere.dragging) return;
    const deltaX = event.clientX - state.sphere.lastX;
    const deltaY = event.clientY - state.sphere.lastY;
    const totalX = event.clientX - state.sphere.startX;
    const totalY = event.clientY - state.sphere.startY;
    state.sphere.lastX = event.clientX;
    state.sphere.lastY = event.clientY;
    if (Math.hypot(totalX, totalY) > 14) state.sphere.moved = true;
    state.sphere.velocityY = deltaX * 0.28;
    state.sphere.velocityX = state.sphere.handTool ? -deltaY * 0.22 : 0;
    state.sphere.rotationY += state.sphere.velocityY;
    if (state.sphere.handTool) {
      state.sphere.rotationX = clamp(state.sphere.rotationX + state.sphere.velocityX, -58, 58);
    } else {
      state.sphere.rotationX = 0;
      state.sphere.rotationZ = 0;
    }
    state.sphere.lastInteraction = performance.now();
    updateSphereTransform();
  });

  sphere.addEventListener("pointermove", (event) => {
    if (state.sphere.dragging || !state.sphere.spyMode) return;
    const tile = event.target.closest(".sphere-tile");
    if (!tile) {
      scheduleSphereSpyHide(80);
      return;
    }
    updateSpherePreviewPosition(event);
  });

  const endDrag = (event) => {
    if (!state.sphere.dragging) return;
    state.sphere.dragging = false;
    state.sphere.lastInteraction = performance.now();
    sphere.classList.remove("is-dragging");
    if (sphere.hasPointerCapture(event.pointerId)) {
      sphere.releasePointerCapture(event.pointerId);
    }
    if (!state.sphere.moved && state.sphere.pendingSrc) {
      openSphereTile(state.sphere.pendingSrc);
    } else if (state.sphere.moved) {
      startSphereInertia();
    }
    state.sphere.pendingSrc = "";
  };

  sphere.addEventListener("pointerup", endDrag);
  sphere.addEventListener("pointercancel", endDrag);
  sphere.addEventListener("click", (event) => {
    const tile = event.target.closest(".sphere-tile");
    if (!tile || state.sphere.moved) return;
    event.preventDefault();
    openSphereTile(tile.dataset.src);
  });
  sphere.addEventListener("pointerover", (event) => {
    const tile = event.target.closest(".sphere-tile");
    if (!tile) return;
    window.clearTimeout(renderSphereSpy.hideTimer);
    const index = Number(tile.dataset.index || 0);
    state.sphere.focusIndex = index;
    if (state.sphere.spyMode) renderSphereSpy(state.sphere.items[index], false, event);
  });
  sphere.addEventListener("pointerout", (event) => {
    const tile = event.target.closest(".sphere-tile");
    if (!tile) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget && (tile.contains(nextTarget) || preview?.contains(nextTarget))) return;
    scheduleSphereSpyHide(90);
  });
  sphere.addEventListener("focusin", (event) => {
    const tile = event.target.closest(".sphere-tile");
    if (!tile) return;
    const index = Number(tile.dataset.index || 0);
    state.sphere.focusIndex = index;
    if (state.sphere.spyMode) renderSphereSpy(state.sphere.items[index], false, tile);
  });
  sphere.addEventListener("keydown", (event) => {
    const tile = event.target.closest(".sphere-tile");
    if (tile && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      openSphereTile(tile.dataset.src);
      return;
    }

    const step = event.shiftKey ? 18 : 8;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") state.sphere.rotationY -= step;
    if (event.key === "ArrowRight") state.sphere.rotationY += step;
    if (event.key === "ArrowUp") {
      state.sphere.rotationX = state.sphere.handTool ? clamp(state.sphere.rotationX - step, -58, 58) : 0;
    }
    if (event.key === "ArrowDown") {
      state.sphere.rotationX = state.sphere.handTool ? clamp(state.sphere.rotationX + step, -58, 58) : 0;
    }
    state.sphere.lastInteraction = performance.now();
    updateSphereTransform();
  });
}

function bindHandControls() {
  document.querySelectorAll("[data-sphere-hand]").forEach((button) => {
    button.addEventListener("click", () => {
      setHandTool(true);
      applyHandRotation(button.dataset.sphereHand || "");
    });
  });
}

function setHandTool(enabled, controlButton) {
  state.sphere.handTool = Boolean(enabled);
  const button = controlButton || document.querySelector('[data-sphere-action="hand-tool"]');
  const pad = document.querySelector("#sphere-hand-pad");
  if (button) {
    button.setAttribute("aria-pressed", String(state.sphere.handTool));
    button.textContent = state.sphere.handTool ? "Hand Active" : "Hand Tool";
  }
  if (pad) pad.hidden = !state.sphere.handTool;
  if (!state.sphere.handTool) {
    state.sphere.rotationX = 0;
    state.sphere.rotationZ = 0;
  }
  state.sphere.lastInteraction = performance.now();
  updateSphereTransform();
}

function applyHandRotation(direction) {
  const step = 12;
  cancelSphereInertia();
  if (direction === "left") state.sphere.rotationY -= step;
  if (direction === "right") state.sphere.rotationY += step;
  if (direction === "up") state.sphere.rotationX = clamp(state.sphere.rotationX - step, -58, 58);
  if (direction === "down") state.sphere.rotationX = clamp(state.sphere.rotationX + step, -58, 58);
  if (direction === "roll-left") state.sphere.rotationZ -= step;
  if (direction === "roll-right") state.sphere.rotationZ += step;
  state.sphere.lastInteraction = performance.now();
  updateSphereTransform();
}

function focusSphereItem(index, showPanel) {
  const count = state.sphere.items.length;
  if (!count) return;
  const nextIndex = (index + count) % count;
  const position = state.sphere.positions[nextIndex];
  state.sphere.focusIndex = nextIndex;
  if (position) {
    state.sphere.rotationY = -position.rotateY;
    state.sphere.rotationX = 0;
    state.sphere.rotationZ = 0;
    state.sphere.zoom = clamp(Math.max(state.sphere.zoom, SPHERE_FOCUS_ZOOM), SPHERE_MIN_ZOOM, SPHERE_MAX_ZOOM);
    state.sphere.userZoomed = true;
  }
  clearSphereFocus();
  const tile = document.querySelector(`.sphere-tile[data-index="${nextIndex}"]`);
  if (tile) {
    tile.classList.add("is-focused");
    tile.focus({ preventScroll: true });
  }
  if (showPanel) renderSphereSpy(state.sphere.items[nextIndex], true, tile || null);
  state.sphere.lastInteraction = performance.now();
  updateSphereTransform();
}

function openSphereTile(src) {
  if (!src) return;
  const now = performance.now();
  if (src === state.sphere.lastOpenedSrc && now - state.sphere.lastOpenedAt < 220) return;
  state.sphere.lastOpenedSrc = src;
  state.sphere.lastOpenedAt = now;
  openLightboxBySrc(src, getFilteredMedia());
}

function scheduleSphereSpyHide(delay = 120) {
  window.clearTimeout(renderSphereSpy.hideTimer);
  renderSphereSpy.hideTimer = window.setTimeout(() => renderSphereSpy(null), delay);
}

function clearSphereFocus() {
  document.querySelectorAll(".sphere-tile.is-focused").forEach((tile) => tile.classList.remove("is-focused"));
}

function renderSphereSpy(item, temporary, anchor) {
  const panel = document.querySelector(selectors.sphereSpy);
  if (!panel) return;
  window.clearTimeout(renderSphereSpy.hideTimer);
  panel.replaceChildren();
  if (!item) {
    panel.hidden = true;
    return;
  }

  const previewButton = document.createElement("button");
  previewButton.className = `sphere-preview-card${item.type === "video" ? " is-video" : ""}`;
  previewButton.type = "button";
  previewButton.setAttribute("aria-label", `Open ${item.title || "memory"} in the memorial viewer`);
  previewButton.addEventListener("click", () => openSphereTile(item.src));

  const thumb = item.type === "video" ? item.posterSrc : (item.galleryThumbSrc || item.safeThumbSrc || item.thumbSrc || item.src);
  if (thumb) {
    const img = document.createElement("img");
    img.src = thumb;
    img.alt = "";
    img.decoding = "async";
    previewButton.append(img);
  }

  const text = document.createElement("span");
  text.className = "sphere-preview-meta";
  text.textContent = `${item.title || "Memory"}${item.date ? ` - ${item.date}` : ""}`;
  previewButton.append(text);
  panel.append(previewButton);
  panel.hidden = false;
  window.requestAnimationFrame(() => updateSpherePreviewPosition(anchor));

  if (temporary && !state.sphere.spyMode) {
    renderSphereSpy.hideTimer = window.setTimeout(() => renderSphereSpy(null), 2600);
  }
}

function updateSpherePreviewPosition(anchor) {
  const panel = document.querySelector(selectors.sphereSpy);
  const shell = panel ? panel.closest(".memory-sphere") : null;
  if (!panel || !shell || panel.hidden) return;

  const shellRect = shell.getBoundingClientRect();
  const panelWidth = panel.offsetWidth || 320;
  const panelHeight = panel.offsetHeight || 260;
  let anchorX = shellRect.width / 2;
  let anchorY = shellRect.height / 2;

  if (anchor && typeof anchor.clientX === "number") {
    anchorX = anchor.clientX - shellRect.left;
    anchorY = anchor.clientY - shellRect.top;
  } else if (anchor && anchor.getBoundingClientRect) {
    const rect = anchor.getBoundingClientRect();
    anchorX = rect.left + rect.width / 2 - shellRect.left;
    anchorY = rect.top + rect.height / 2 - shellRect.top;
  }

  const side = anchorX > shellRect.width * 0.58 ? -1 : 1;
  const x = clamp(anchorX + side * 34, 16, shellRect.width - panelWidth - 16);
  const y = clamp(anchorY - panelHeight * 0.5, 16, shellRect.height - panelHeight - 16);
  panel.style.setProperty("--preview-x", `${x}px`);
  panel.style.setProperty("--preview-y", `${y}px`);
}

function updateSphereTransform() {
  const sphere = document.querySelector(selectors.memorySphere);
  if (!sphere) return;
  const shell = sphere.closest(".memory-sphere");
  if (!state.sphere.handTool) {
    state.sphere.rotationX = 0;
    state.sphere.rotationZ = 0;
  } else {
    state.sphere.rotationX = clamp(state.sphere.rotationX, -58, 58);
  }
  state.sphere.zoom = clamp(state.sphere.zoom, SPHERE_MIN_ZOOM, SPHERE_MAX_ZOOM);
  sphere.style.setProperty("--sphere-rotate-x", `${state.sphere.rotationX}deg`);
  sphere.style.setProperty("--sphere-rotate-y", `${state.sphere.rotationY}deg`);
  sphere.style.setProperty("--sphere-rotate-z", `${state.sphere.rotationZ}deg`);
  sphere.style.setProperty("--sphere-zoom", String(state.sphere.zoom));
  if (shell) {
    const stageSize = Number.parseFloat(getComputedStyle(shell).getPropertyValue("--sphere-diameter")) || 980;
    const buffer = clamp(window.innerWidth * 0.14, 170, 310);
    const viewHeight = clamp(stageSize * state.sphere.zoom + buffer, 720, 2600);
    shell.style.setProperty("--sphere-view-height", `${viewHeight}px`);
  }
}

function startSphereInertia() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || state.sphere.frozen) return;
  cancelSphereInertia();

  const glide = () => {
    state.sphere.velocityX *= 0.94;
    state.sphere.velocityY *= 0.94;

    if (Math.abs(state.sphere.velocityX) < 0.018 && Math.abs(state.sphere.velocityY) < 0.018) {
      cancelSphereInertia();
      return;
    }

    state.sphere.rotationY += state.sphere.velocityY;
    if (state.sphere.handTool) {
      state.sphere.rotationX = clamp(state.sphere.rotationX + state.sphere.velocityX, -58, 58);
    } else {
      state.sphere.rotationX = 0;
      state.sphere.rotationZ = 0;
    }
    updateSphereTransform();
    state.sphere.inertiaFrame = window.requestAnimationFrame(glide);
  };

  state.sphere.inertiaFrame = window.requestAnimationFrame(glide);
}

function cancelSphereInertia() {
  if (state.sphere.inertiaFrame) {
    window.cancelAnimationFrame(state.sphere.inertiaFrame);
    state.sphere.inertiaFrame = 0;
  }
}

function startSphereDrift() {
  const sphere = document.querySelector(selectors.memorySphere);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!sphere || reduceMotion) return;

  const drift = (time) => {
    if (!state.sphere.frozen && !state.sphere.dragging && !state.sphere.inertiaFrame && time - state.sphere.lastInteraction > 1800) {
      state.sphere.rotationY += 0.035;
      updateSphereTransform();
    }
    state.sphere.idleFrame = window.requestAnimationFrame(drift);
  };

  if (!state.sphere.idleFrame) {
    state.sphere.idleFrame = window.requestAnimationFrame(drift);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function debounce(callback, delay) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

function openLightboxBySrc(src, scope) {
  const scopedItems = scope && scope.length ? scope : getFilteredMedia();
  const index = scopedItems.findIndex((item) => item.src === src);
  state.lightboxItems = scopedItems;
  state.lightboxIndex = index >= 0 ? index : 0;
  openLightbox();
}

function openLightbox() {
  const lightbox = document.querySelector(selectors.lightbox);
  if (!lightbox || !state.lightboxItems.length) return;

  state.lastFocusedElement = document.activeElement;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  renderLightboxItem();

  const closeButton = lightbox.querySelector(".lightbox-close");
  if (closeButton) closeButton.focus();
}

function renderLightboxItem() {
  const item = state.lightboxItems[state.lightboxIndex];
  const stage = document.querySelector(selectors.lightboxStage);
  const title = document.querySelector(selectors.lightboxTitle);
  const caption = document.querySelector(selectors.lightboxCaption);
  const date = document.querySelector(selectors.lightboxDate);
  const transcript = document.querySelector(selectors.lightboxTranscript);
  if (!item || !stage || !title || !caption || !date || !transcript) return;

  stage.replaceChildren();
  stage.append(createMediaPreview(item, { controls: item.type === "video", lazy: false, original: true, frame: stage }));
  title.textContent = item.title || "Memory";
  caption.textContent = item.caption || "";
  date.textContent = item.date || "Family archive";
  transcript.textContent = item.transcript || "";
  transcript.hidden = !item.transcript;
}

function showPreviousMemory() {
  if (!state.lightboxItems.length) return;
  state.lightboxIndex = (state.lightboxIndex - 1 + state.lightboxItems.length) % state.lightboxItems.length;
  renderLightboxItem();
}

function showNextMemory() {
  if (!state.lightboxItems.length) return;
  state.lightboxIndex = (state.lightboxIndex + 1) % state.lightboxItems.length;
  renderLightboxItem();
}

function closeLightbox() {
  const lightbox = document.querySelector(selectors.lightbox);
  if (!lightbox) return;

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  const stage = document.querySelector(selectors.lightboxStage);
  if (stage) stage.replaceChildren();
  if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === "function") {
    state.lastFocusedElement.focus();
  }
}

function handleKeyboard(event) {
  const lightbox = document.querySelector(selectors.lightbox);
  const lightboxOpen = lightbox && !lightbox.hidden;
  if (!lightboxOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPreviousMemory();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showNextMemory();
  }
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => observer.observe(item));
}
