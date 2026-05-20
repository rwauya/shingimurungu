from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener

    register_heif_opener()
except Exception:
    register_heif_opener = None


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
OPTIMIZED = IMAGES / "optimized"
MANIFEST = ROOT / "media-manifest.js"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".m4v"}
EXCLUDED_DIRS = {"optimized", "__pycache__"}


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync the static media manifest with the images folder.")
    parser.add_argument("--watch", action="store_true", help="Keep watching images/ and rebuild on changes.")
    parser.add_argument("--interval", type=float, default=2.0, help="Watch polling interval in seconds.")
    args = parser.parse_args()

    if args.watch:
        watch(args.interval)
    else:
        sync_once()


def watch(interval: float) -> None:
    previous = None
    print("Watching images/ for memorial media changes. Press Ctrl+C to stop.")
    while True:
        snapshot = folder_snapshot()
        if snapshot != previous:
            sync_once()
            previous = folder_snapshot()
        time.sleep(interval)


def sync_once() -> None:
    IMAGES.mkdir(exist_ok=True)
    clean_stale_converted_files()
    manifest_entries: list[str] = []
    seen: set[str] = set()

    for source in iter_source_files():
        rel = to_posix(source.relative_to(IMAGES))
        ext = source.suffix.lower()

        if ext in {".heic", ".heif"}:
            converted = convert_heic(source)
            if converted:
                rel = to_posix(converted.relative_to(IMAGES))
                source = converted
            else:
                print(f"Skipped unsupported HEIC file: {rel}")
                continue

        if ext in IMAGE_EXTENSIONS:
            create_image_thumbnails(source)
        elif ext in VIDEO_EXTENSIONS:
            ensure_video_poster(source)
        else:
            continue

        if rel not in seen:
            manifest_entries.append(rel)
            seen.add(rel)

    manifest_entries.sort(key=manifest_sort_key)
    prune_optimized_files(manifest_entries)
    write_manifest(manifest_entries)
    print(f"Synced {len(manifest_entries)} media files into media-manifest.js")


def iter_source_files():
    if not IMAGES.exists():
        return

    for path in IMAGES.rglob("*"):
        if not path.is_file():
            continue
        rel_parts = path.relative_to(IMAGES).parts
        if any(part in EXCLUDED_DIRS for part in rel_parts):
            continue
        if path.suffix.lower() in IMAGE_EXTENSIONS | VIDEO_EXTENSIONS:
            yield path


def convert_heic(source: Path) -> Path | None:
    target = IMAGES / "converted" / source.relative_to(IMAGES).with_suffix(".jpg")
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.stat().st_mtime_ns >= source.stat().st_mtime_ns:
        return target

    try:
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.save(target, "JPEG", quality=90, optimize=True)
        return target
    except Exception as exc:
        print(f"Could not convert {source.name}: {exc}")
        return None


def clean_stale_converted_files() -> None:
    converted_root = IMAGES / "converted"
    if not converted_root.exists():
        return

    for converted in converted_root.rglob("*.jpg"):
        rel = converted.relative_to(converted_root)
        original_stem = IMAGES / rel.with_suffix("")
        candidates = [
            original_stem.with_suffix(".HEIC"),
            original_stem.with_suffix(".heic"),
            original_stem.with_suffix(".HEIF"),
            original_stem.with_suffix(".heif"),
        ]
        if any(candidate.exists() for candidate in candidates):
            continue
        converted.unlink()


def prune_optimized_files(manifest_entries: list[str]) -> None:
    image_allowed = {Path(entry).with_suffix(".webp").as_posix() for entry in manifest_entries}
    video_allowed = {
        Path(entry).with_suffix(".webp").as_posix()
        for entry in manifest_entries
        if Path(entry).suffix.lower() in VIDEO_EXTENSIONS
    }

    for folder_name in ("safe-thumbs", "gallery-thumbs", "sphere-thumbs"):
        folder = OPTIMIZED / folder_name
        if not folder.exists():
            continue
        for generated in folder.rglob("*.webp"):
            if to_posix(generated.relative_to(folder)) not in image_allowed:
                generated.unlink()

    video_folder = OPTIMIZED / "video-posters"
    if video_folder.exists():
        for generated in video_folder.rglob("*.webp"):
            if to_posix(generated.relative_to(video_folder)) not in video_allowed:
                generated.unlink()


def create_image_thumbnails(source: Path) -> None:
    rel = source.relative_to(IMAGES)
    stem = rel.with_suffix(".webp")
    targets = [
        (OPTIMIZED / "safe-thumbs" / stem, 760, 68),
        (OPTIMIZED / "gallery-thumbs" / stem, 520, 62),
        (OPTIMIZED / "sphere-thumbs" / stem, 132, 48),
    ]

    try:
        with Image.open(source) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            for target, size, quality in targets:
                if target.exists() and target.stat().st_mtime_ns >= source.stat().st_mtime_ns:
                    continue
                target.parent.mkdir(parents=True, exist_ok=True)
                thumb = image.copy()
                thumb.thumbnail((size, size), Image.Resampling.LANCZOS)
                thumb.save(target, "WEBP", quality=quality, method=6)
    except Exception as exc:
        print(f"Could not thumbnail {to_posix(rel)}: {exc}")


def ensure_video_poster(source: Path) -> None:
    target = OPTIMIZED / "video-posters" / source.relative_to(IMAGES).with_suffix(".webp")
    if target.exists():
        return

    target.parent.mkdir(parents=True, exist_ok=True)
    fallback = OPTIMIZED / "murungu-backdrop.webp"
    if not fallback.exists():
        fallback = IMAGES / "murungu.jpeg"

    try:
        with Image.open(fallback) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            image.thumbnail((640, 640), Image.Resampling.LANCZOS)
            image.save(target, "WEBP", quality=70, method=6)
    except Exception:
        Image.new("RGB", (640, 360), (30, 28, 24)).save(target, "WEBP", quality=70, method=6)


def write_manifest(entries: list[str]) -> None:
    payload = json.dumps(entries, indent=2)
    MANIFEST.write_text(
        "// Generated by tools/sync_media_manifest.py. Do not edit by hand.\n"
        f"window.memorialMediaManifest = {payload};\n",
        encoding="utf-8",
    )


def folder_snapshot() -> tuple[tuple[str, int, int], ...]:
    snapshot = []
    for path in iter_source_files() or []:
        stat = path.stat()
        snapshot.append((to_posix(path.relative_to(IMAGES)), stat.st_size, stat.st_mtime_ns))
    return tuple(sorted(snapshot))


def manifest_sort_key(path: str) -> tuple[int, str]:
    lowered = path.lower()
    if lowered == "murungu.jpeg":
        return (0, lowered)
    return (1, lowered)


def to_posix(path: Path) -> str:
    return path.as_posix()


if __name__ == "__main__":
    main()
