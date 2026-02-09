# Qasas — Stories & Images Guide

Summary of existing stories, which have images, and where to add or place content.

---

## 1. Summary of existing stories

### Legend

| Symbol | Meaning |
|--------|--------|
| ✅ | Story has an image (file exists and is registered) |
| ⬜ | Story uses **placeholder** (no image file or not in map) |

### By category

#### Prophets (الأنبياء) — `prophets`

| Story ID   | Name (En)           | Name (Ar) | Chapters | Image |
|------------|---------------------|-----------|----------|-------|
| `yusuf`    | Yusuf (Joseph)      | يوسف      | 4        | ✅    |
| `ibrahim`  | Ibrahim (Abraham)   | إبراهيم   | 4        | ✅    |
| `musa`     | Musa (Moses)        | موسى      | 4        | ✅    |
| `nuh`      | Nuh (Noah)          | نوح       | 4        | ✅    |
| `yunus`    | Yunus (Jonah)       | يونس      | 3        | ⬜    |
| `ayyub`    | Ayyub (Job)         | أيوب      | 3        | ⬜    |
| `sulaiman` | Sulaiman (Solomon)  | سليمان    | 3        | ⬜    |

#### Sahabah (الصحابة) — `sahabah`

| Story ID    | Name (En)                | Name (Ar)           | Chapters | Image |
|-------------|--------------------------|---------------------|----------|-------|
| `abu-bakr`  | Abu Bakr As-Siddiq       | أبو بكر الصديق      | 4        | ✅    |
| `umar`      | Umar ibn Al-Khattab      | عمر بن الخطاب       | 4        | ✅    |
| `uthman`    | Uthman ibn Affan         | عثمان بن عفان       | 4        | ✅    |
| `ali`       | Ali ibn Abi Talib        | علي بن أبي طالب     | 4        | ✅    |
| `bilal`     | Bilal ibn Rabah          | بلال بن رباح        | 3        | ⬜    |
| `khadija`   | Khadija bint Khuwaylid   | خديجة بنت خويلد     | 3        | ⬜    |

#### Educational (قصص تعليمية) — `educational`

| Story ID              | Name (En)                     | Name (Ar)      | Chapters | Image |
|-----------------------|-------------------------------|----------------|----------|-------|
| `the-three-men`      | The Three Men in the Cave     | قصة الثلاثة    | 3        | ✅    |
| `the-merchant`       | The Honest Merchant           | قصة التاجر     | 3        | ✅    |
| `the-boy-and-the-king` | The Boy and the King        | الغلام والملك  | 3        | ⬜    |
| `the-man-and-the-dog`  | The Man Who Gave Water to a Dog | الرجل والكلب | 3        | ⬜    |

### Quick counts

- **Total stories:** 17  
- **With image:** 10  
- **Without image (placeholder):** 7  
- **Categories:** 3 (`prophets`, `sahabah`, `educational`)

---

## 2. Where to place story images

### Folder structure

Images live under **`assets/images/stories/`**, grouped by category:

```
assets/
  images/
    stories/
      prophets/       ← Prophets
        yusuf.png
        ibrahim.png
        musa.png
        nuh.png
        # Add: yunus.png, ayyub.png, sulaiman.png
      sahabah/       ← Sahabah
        abu-bakr.png
        umar.png
        uthman.png
        ali.png
        # Add: bilal.png, khadija.png
      educational/   ← Educational
        the-three-men.png
        the-merchant.png
        # Add: the-boy-and-the-king.png, the-man-and-the-dog.png
```

### Naming rule

- **File name** must match the **story `id`** in `data/stories.ts`, plus `.png`.  
- Examples: `yunus.png`, `bilal.png`, `the-boy-and-the-king.png`.

### Registering the image in the app

After adding the file, register it in **`components/ui/image-placeholder.tsx`** in the `storyImages` object:

```ts
const storyImages: Record<string, ImageSourcePropType> = {
  // Prophets
  'yusuf': require('@/assets/images/stories/prophets/yusuf.png'),
  'ibrahim': require('@/assets/images/stories/prophets/ibrahim.png'),
  // ... existing entries ...

  // Add new ones, e.g.:
  'yunus': require('@/assets/images/stories/prophets/yunus.png'),
  'ayyub': require('@/assets/images/stories/prophets/ayyub.png'),
  'sulaiman': require('@/assets/images/stories/prophets/sulaiman.png'),
  'bilal': require('@/assets/images/stories/sahabah/bilal.png'),
  'khadija': require('@/assets/images/stories/sahabah/khadija.png'),
  'the-boy-and-the-king': require('@/assets/images/stories/educational/the-boy-and-the-king.png'),
  'the-man-and-the-dog': require('@/assets/images/stories/educational/the-man-and-the-dog.png'),
};
```

- If a story **id** is **not** in `storyImages`, the app shows the **placeholder** (category icon + “Illustration” label).  
- So: **place file** in the correct folder, **add one line** in `image-placeholder.tsx` for that `id`.

---

## 3. Where to add new stories (and chapters)

### Step 1: Add the story entry — `data/stories.ts`

In the `stories` array, add an object with:

- **`id`** — unique string (e.g. `'idris'`, `'khadija'`). Use kebab-case.
- **`category`** — `'prophets'` | `'sahabah'` | `'educational'`
- **`nameAr`** — Arabic title
- **`nameEn`** — English title
- **`shortDescriptionAr`** — short Arabic description
- **`shortDescriptionEn`** — short English description
- **`illustration`** — emoji or placeholder string (e.g. `'🌙'`); used if no image is registered

Example:

```ts
{
  id: 'idris',
  category: 'prophets',
  nameAr: 'إدريس',
  nameEn: 'Idris (Enoch)',
  shortDescriptionAr: '...',
  shortDescriptionEn: '...',
  illustration: '📜',
},
```

Place it in the right category block (Prophets, Sahabah, or Educational) so the list stays organized.

### Step 2: Add chapters — `data/chapters.ts`

In the `chapters` array, add one object per chapter. Each chapter needs:

- **`id`** — unique, e.g. `'idris-1'`, `'idris-2'` (convention: `{storyId}-{chapterNumber}`)
- **`storyId`** — same as the story’s `id` in `stories.ts`
- **`category`** — same as the story’s `category`
- **`chapterNumber`** — 1, 2, 3, …
- **`titleEn`** / **`titleAr`** — chapter title (and optional legacy **`title`**)
- **`estimatedReadingTime`** — number (minutes)
- **`reflectionPrompt`** — question for the reader
- **`relatedAyahOrQuote`** — verse or quote (escape single quotes as `\'` if needed)
- **`content`** — full chapter text in English
- **`contentAr`** — full chapter text in Arabic (optional but recommended)

Add chapters in order (by `storyId` and `chapterNumber`) so the file stays easy to maintain. New story’s chapters can be added at the end of the array before the closing `];`.

### Step 3 (optional): Add a story image

- Add the image file under **`assets/images/stories/{category}/{story-id}.png`**.
- Register it in **`components/ui/image-placeholder.tsx`** in **`storyImages`** as shown in section 2.

If you skip this, the story will still work and will show the **placeholder**.

---

## 4. Categories reference

| Category      | Type value      | Arabic      | Folder (images) |
|---------------|-----------------|------------|-------------------|
| Prophets      | `prophets`      | الأنبياء   | `prophets/`       |
| Sahabah       | `sahabah`       | الصحابة   | `sahabah/`        |
| Educational   | `educational`   | قصص تعليمية | `educational/`    |

- **Stories** are filtered by `category` on the home/category screens.  
- **Chapters** use the same `category` so they stay grouped with the right story and category.

---

## 5. Files to touch when adding content

| What you’re doing        | File(s) to edit |
|--------------------------|------------------|
| Add a new story          | `data/stories.ts` |
| Add chapters             | `data/chapters.ts` |
| Add or fix story image   | 1) Add file under `assets/images/stories/{category}/{id}.png`<br>2) `components/ui/image-placeholder.tsx` → `storyImages` |

No other code changes are required for a new story with chapters; the app reads from `stories` and `chapters` and shows the placeholder when no image is registered.

---

## 6. Public-domain image sources (no copyright)

Use **public domain** or **CC0** images only so you can use them without attribution or copyright risk.

### Automated download (script)

From the project root, run:

```bash
./scripts/download-story-images.sh
```

This downloads:

- **Yunus** — [Wikimedia Commons: The Prophet Yunus (Jonah In Islam)](https://commons.wikimedia.org/wiki/File:The_Prophet_Yunus_(Jonah_In_Islam).png) (public domain, Arabic calligraphy)
- **Yahya** — [Wikimedia Commons: John the Baptist preaches](https://commons.wikimedia.org/wiki/File:John_the_Baptist_preaches.jpg) (public domain, 1875 Bible illustration)

Saved as `prophets/yunus.png` and `prophets/yahya.png`. After running, register them in `app/chapters/[prophetId].tsx` and `components/ui/image-placeholder.tsx` if not already there.

### Where to find more (no copyright)

| Source | License | How to use |
|--------|--------|------------|
| **Wikimedia Commons** | Public domain / CC / GFDL | Search e.g. "Prophet Jonah", "King David", "Job Bible", "Solomon king". Filter by "No copyright" or "Public domain". Download, then save as `{story-id}.png` in the right folder. |
| **Pixabay** | Pixabay License (free, no attribution) | [pixabay.com](https://pixabay.com) → search "Islamic", "prophet", "mosque", "calligraphy". Download and rename to story id. |
| **Unsplash** | Unsplash License (free) | [unsplash.com](https://unsplash.com) → search "Islamic art", "mosque", "calligraphy". Good for generic Sahabah/Mothers placeholders. |

### Suggested Commons searches (public domain)

- **Prophets:** `Prophet Jonah`, `King David`, `Solomon Israel`, `Job Bible`, `Jesus Christ painting`, `John the Baptist`, `Moses Bible`, `Jacob Israel`, `Isaac Bible`, `Zechariah Bible`
- **Generic Islamic:** `Islamic calligraphy`, `Arabic calligraphy`, `mosque illustration`

Download the image, save as `assets/images/stories/{category}/{story-id}.png`, then add the same key to `storyImages` in `app/chapters/[prophetId].tsx` and `components/ui/image-placeholder.tsx`.

---

## 4. Reflection screen — Arabic translations

When the app language is Arabic, the reflection screen shows the **quote** and **reflection question** in Arabic if the chapter has `relatedAyahOrQuoteAr` and `reflectionPromptAr` in `data/chapters.ts`.

**Already translated (example):** Muadh (muadh-1, muadh-2), Khalid (khalid-1, khalid-2).

**To add Arabic for more chapters:** In each chapter object in `data/chapters.ts`, add:

- `reflectionPromptAr`: Arabic text of the reflection question.
- `relatedAyahOrQuoteAr`: Arabic text of the quote/ayah.

If these are missing, the app falls back to the English text when the user has Arabic selected. Add them for all chapters over time so every story shows translated sentences on the reflection page.
