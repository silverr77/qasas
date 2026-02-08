#!/usr/bin/env bash
# Download public-domain / no-copyright story images into assets/images/stories/
# All sources are public domain or CC0. Run from project root: ./scripts/download-story-images.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ASSETS="$PROJECT_ROOT/assets/images/stories"

mkdir -p "$ASSETS/prophets"
mkdir -p "$ASSETS/sahabah"
mkdir -p "$ASSETS/educational"
mkdir -p "$ASSETS/mothers"

# Helper: download URL to path; if extension is .jpg, convert to .png for app consistency
download_to() {
  local url="$1"
  local out_path="$2"
  local tmp="${out_path}.tmp"
  echo "Downloading: $url -> $out_path"
  curl -sL -o "$tmp" "$url" || { echo "Failed: $url"; rm -f "$tmp"; return 1; }
  if [[ "$out_path" == *.jpg ]]; then
    mv "$tmp" "$out_path"
  else
    # If we downloaded jpg but want png, convert
    if [[ "$tmp" == *.jpg ]] || file "$tmp" | grep -qi jpeg; then
      sips -s format png "$tmp" --out "$out_path" 2>/dev/null || mv "$tmp" "${out_path%.png}.jpg"
      rm -f "$tmp"
    else
      mv "$tmp" "$out_path"
    fi
  fi
}

# --- Prophets (public domain / author-released) ---

# Yunus (Jonah) — Public domain, Arabic calligraphy, author Aziz911q8 released into PD
if [[ ! -f "$ASSETS/prophets/yunus.png" ]]; then
  download_to "https://upload.wikimedia.org/wikipedia/commons/2/27/The_Prophet_Yunus_%28Jonah_In_Islam%29.png" "$ASSETS/prophets/yunus.png"
fi

# Yahya (John the Baptist) — Public domain (1875 Young People's Illustrated Bible History)
if [[ ! -f "$ASSETS/prophets/yahya.png" ]]; then
  curl -sL -o "$ASSETS/prophets/yahya.jpg" "https://upload.wikimedia.org/wikipedia/commons/4/45/John_the_Baptist_preaches.jpg"
  if command -v sips &>/dev/null; then
    sips -s format png "$ASSETS/prophets/yahya.jpg" --out "$ASSETS/prophets/yahya.png"
    rm -f "$ASSETS/prophets/yahya.jpg"
  else
    mv "$ASSETS/prophets/yahya.jpg" "$ASSETS/prophets/yahya.png" 2>/dev/null || true
  fi
fi

echo "Done. See docs/STORIES_AND_IMAGES_GUIDE.md for more public-domain sources."
