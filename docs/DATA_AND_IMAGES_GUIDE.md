# Qasas App - Data & Images Guide

This guide explains where the app data is stored and how to add images for stories.

---

## 📁 Project Structure

```
qasas/
├── assets/
│   └── images/              # Store story images here
│       └── stories/         # Create this folder for story images
│           ├── prophets/    # Prophet story images
│           ├── sahabah/     # Sahaba story images
│           └── educational/ # Educational story images
├── data/
│   ├── stories.ts           # Story metadata (names, descriptions)
│   └── chapters.ts          # Chapter content and details
├── types/
│   └── index.ts             # TypeScript type definitions
└── components/
    └── ui/
        └── image-placeholder.tsx  # Current placeholder component
```

---

## 📖 Data Files

### 1. Stories Data (`data/stories.ts`)

This file contains all story metadata. Each story has:

```typescript
interface Story {
  id: string;              // Unique identifier (e.g., 'yusuf', 'abu-bakr')
  category: 'prophets' | 'sahabah' | 'educational';
  nameAr: string;          // Arabic name
  nameEn: string;          // English name
  shortDescriptionAr: string;  // Arabic description
  shortDescriptionEn: string;  // English description
  illustration: string;    // Currently emoji, will be image path
}
```

**Current Stories:**

| ID | Category | Name (En) | Name (Ar) |
|---|---|---|---|
| `yusuf` | prophets | Yusuf (Joseph) | يوسف |
| `ibrahim` | prophets | Ibrahim (Abraham) | إبراهيم |
| `musa` | prophets | Musa (Moses) | موسى |
| `nuh` | prophets | Nuh (Noah) | نوح |
| `abu-bakr` | sahabah | Abu Bakr As-Siddiq | أبو بكر الصديق |
| `umar` | sahabah | Umar ibn Al-Khattab | عمر بن الخطاب |
| `uthman` | sahabah | Uthman ibn Affan | عثمان بن عفان |
| `ali` | sahabah | Ali ibn Abi Talib | علي بن أبي طالب |
| `the-three-men` | educational | The Three Men in the Cave | قصة الثلاثة |
| `the-merchant` | educational | The Honest Merchant | قصة التاجر |

### 2. Chapters Data (`data/chapters.ts`)

This file contains all chapter content:

```typescript
interface StoryChapter {
  id: string;              // Format: '{storyId}-{chapterNumber}'
  storyId: string;         // Links to story
  category: 'prophets' | 'sahabah' | 'educational';
  chapterNumber: number;   // Order (1, 2, 3...)
  title: string;           // Chapter title
  content: string;         // Full chapter text
  estimatedReadingTime: number;  // Minutes
  reflectionPrompt: string;
  relatedAyahOrQuote: string;
}
```

---

## 🖼️ How to Add Images

### Step 1: Create Image Folder Structure

```bash
mkdir -p assets/images/stories/prophets
mkdir -p assets/images/stories/sahabah
mkdir -p assets/images/stories/educational
```

### Step 2: Image Requirements

| Attribute | Requirement |
|---|---|
| **Format** | PNG or WebP (prefer WebP for smaller size) |
| **Size** | 600x400 pixels (3:2 ratio) recommended |
| **Style** | Calm, peaceful, Islamic-inspired illustration |
| **No faces** | Avoid depicting faces of prophets/sahabah |
| **Naming** | Use story ID: `{storyId}.png` |

### Step 3: Save Images

Save each image with the story ID as filename:

```
assets/images/stories/prophets/
├── yusuf.png
├── ibrahim.png
├── musa.png
└── nuh.png

assets/images/stories/sahabah/
├── abu-bakr.png
├── umar.png
├── uthman.png
└── ali.png

assets/images/stories/educational/
├── the-three-men.png
└── the-merchant.png
```

### Step 4: Update the Image Placeholder Component

After adding images, update `components/ui/image-placeholder.tsx` to use actual images:

```typescript
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { StoryCategory } from '@/types';

// Import all story images
const storyImages: Record<string, any> = {
  // Prophets
  'yusuf': require('@/assets/images/stories/prophets/yusuf.png'),
  'ibrahim': require('@/assets/images/stories/prophets/ibrahim.png'),
  'musa': require('@/assets/images/stories/prophets/musa.png'),
  'nuh': require('@/assets/images/stories/prophets/nuh.png'),
  
  // Sahabah
  'abu-bakr': require('@/assets/images/stories/sahabah/abu-bakr.png'),
  'umar': require('@/assets/images/stories/sahabah/umar.png'),
  'uthman': require('@/assets/images/stories/sahabah/uthman.png'),
  'ali': require('@/assets/images/stories/sahabah/ali.png'),
  
  // Educational
  'the-three-men': require('@/assets/images/stories/educational/the-three-men.png'),
  'the-merchant': require('@/assets/images/stories/educational/the-merchant.png'),
};

interface StoryImageProps {
  storyId: string;
  width: number;
  height: number;
  borderRadius?: number;
}

export function StoryImage({ storyId, width, height, borderRadius = 12 }: StoryImageProps) {
  const source = storyImages[storyId];
  
  if (!source) {
    // Fallback to placeholder if image not found
    return <ImagePlaceholder width={width} height={height} category="prophets" />;
  }
  
  return (
    <Image
      source={source}
      style={{
        width,
        height,
        borderRadius,
      }}
      resizeMode="cover"
    />
  );
}
```

### Step 5: Update Components to Use StoryImage

Replace `ImagePlaceholder` with `StoryImage` in:

1. `components/stories/story-card.tsx`
2. `components/stories/story-list-item.tsx`
3. `app/(tabs)/index.tsx` (Continue Reading section)

Example change:

```typescript
// Before
<ImagePlaceholder
  width={280}
  height={200}
  category={story.category}
  borderRadius={Radius.lg}
/>

// After
<StoryImage
  storyId={story.id}
  width={280}
  height={200}
  borderRadius={Radius.lg}
/>
```

---

## 🎨 Image Generation Prompts for Gemini/AI

### Style Guidelines

Use these consistent prompts for generating images:

**Base Style Prompt:**
```
Create a peaceful, serene Islamic illustration style image. 
Use soft, warm colors (beige, sand, soft green, gentle blues).
No human faces depicted. 
Style: Modern minimalist with Islamic geometric patterns.
Mood: Calm, spiritual, contemplative.
Aspect ratio: 3:2 (600x400 pixels)
```

### Individual Story Prompts

**Prophet Yusuf:**
```
A starlit desert night sky with eleven bright stars and a crescent moon. 
Soft golden glow emanating from the stars. 
An ancient well silhouetted in the foreground.
Palm trees in the distance.
Islamic geometric border patterns.
```

**Prophet Ibrahim:**
```
The Kaaba in a golden sunset light.
Desert landscape with gentle sand dunes.
A starry sky transitioning from day to night.
Architectural arches with Islamic patterns.
No human figures.
```

**Prophet Musa:**
```
Parted waters forming a dramatic pathway.
Mount Sinai with divine light from above.
Desert landscape with palm trees.
Flowing robes without a figure.
Soft blue and gold color palette.
```

**Prophet Nuh:**
```
A majestic wooden ark on calm waters.
Rainbow in a clearing sky after rain.
Doves and olive branches.
Peaceful waters reflecting sunset colors.
Mountain peaks in the distance.
```

**Abu Bakr As-Siddiq:**
```
An ancient Islamic scroll with calligraphy.
Cave entrance with soft light filtering in.
Desert landscape at dawn.
Green and gold Islamic patterns.
Symbolic representation of truthfulness.
```

**Umar ibn Al-Khattab:**
```
Scales of justice in golden light.
Strong architectural pillars with Islamic carvings.
A sword and shield in symbolic arrangement.
Desert fortress silhouette.
Colors of justice: deep blue and gold.
```

**The Three Men in the Cave:**
```
A mountain cave entrance with dramatic lighting.
Three different symbolic objects (wheat, staff, treasure).
Rock formations with natural beauty.
Light breaking through darkness.
Earth tones with spiritual glow.
```

**The Honest Merchant:**
```
Ancient marketplace with geometric patterns.
Golden coins and measuring scales.
Silk fabrics and spices.
Warm sunset lighting through arched doorways.
Symbols of honest trade.
```

---

## 🔧 Adding New Stories

### 1. Add Story to `data/stories.ts`

```typescript
{
  id: 'new-story-id',
  category: 'prophets', // or 'sahabah' or 'educational'
  nameAr: 'الاسم بالعربية',
  nameEn: 'English Name',
  shortDescriptionAr: 'وصف قصير بالعربية',
  shortDescriptionEn: 'Short description in English',
  illustration: '🌙', // Temporary emoji
},
```

### 2. Add Chapters to `data/chapters.ts`

```typescript
{
  id: 'new-story-id-1',
  storyId: 'new-story-id',
  category: 'prophets',
  chapterNumber: 1,
  title: 'Chapter Title',
  estimatedReadingTime: 5,
  reflectionPrompt: 'Reflection question...',
  relatedAyahOrQuote: 'Quran verse or hadith...',
  content: `Full chapter content here...`,
},
```

### 3. Add Image

1. Generate image using AI with style guidelines
2. Save as `assets/images/stories/{category}/{story-id}.png`
3. Add to `storyImages` mapping in the image component

---

## 📝 Quick Reference

| Task | File to Edit |
|---|---|
| Add new story | `data/stories.ts` |
| Add new chapter | `data/chapters.ts` |
| Add story image | `assets/images/stories/{category}/` |
| Update image component | `components/ui/image-placeholder.tsx` |
| Modify story types | `types/index.ts` |

---

## ✅ Image Checklist

- [ ] Create folder: `assets/images/stories/prophets/`
- [ ] Create folder: `assets/images/stories/sahabah/`
- [ ] Create folder: `assets/images/stories/educational/`
- [ ] Generate image: `yusuf.png`
- [ ] Generate image: `ibrahim.png`
- [ ] Generate image: `musa.png`
- [ ] Generate image: `nuh.png`
- [ ] Generate image: `abu-bakr.png`
- [ ] Generate image: `umar.png`
- [ ] Generate image: `uthman.png`
- [ ] Generate image: `ali.png`
- [ ] Generate image: `the-three-men.png`
- [ ] Generate image: `the-merchant.png`
- [ ] Update `image-placeholder.tsx` to use actual images
- [ ] Test all images display correctly
