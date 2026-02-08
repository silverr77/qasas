# Remaining Stories — Image Prompts for Generation

Stories that **do not yet have an image** in the app. Use the **Image description** (or your own variant) in your image generator. Save as **PNG** (or JPG) with the **Filename** under `assets/images/stories/{category}/`.

**Style suggestion:** Islamic / storybook illustration; dignified, warm colors; avoid depicting the Prophet Muhammad or detailed human faces if your tradition prefers symbolic or calligraphic art. For companions and mothers, stylized or respectful portrait-style is fine.

---

## Prophets

*All prophets now have images registered. None remaining.*

---

## Sahabah (Companions)

| Story ID | Name (En) | Folder | Filename | Short description | Image description for generation |
|----------|-----------|--------|----------|-------------------|-----------------------------------|
| **bilal** | Bilal ibn Rabah | sahabah | `bilal.png` | The Prophet's muezzin and steadfastness under torture | Stylized illustration of a noble Black man at a mosque or minaret, calling the adhan; warm light, Islamic geometric patterns; dignity and devotion. |
| **khadija** | Khadija bint Khuwaylid | sahabah | `khadija.png` | The first believer and supporter of the Prophet | Noble woman in rich but modest dress, desert or caravan setting; sense of wisdom, support, and faith; warm, dignified tones. |
| **talha** | Talha ibn Ubaidullah | sahabah | `talha.png` | Talha the Good and the Falcon of Uhud | Brave companion in simple warrior dress, shield or stance of protection; desert or battlefield; courage and loyalty. |
| **zubair** | Az-Zubair ibn Al-Awam | sahabah | `zubair.png` | The disciple of the Messenger of Allah | Young companion with sword, determined and loyal; desert or camp; “disciple” and readiness to serve. |
| **abdur-rahman** | Abdur Rahman ibn Awf | sahabah | `abdur-rahman.png` | The honest trader and one of the ten promised Paradise | Merchant in a market or with goods/caravan; honesty and generosity; warm, prosperous but humble. |
| **saad** | Saad ibn Abi Waqqas | sahabah | `saad.png` | The first to shoot an arrow for the cause of Allah | Archer with bow, desert or battle scene; first arrow for Islam; strength and devotion. |
| **saeed** | Saeed ibn Zaid | sahabah | `saeed.png` | The one whose prayers were answered and the ascetic worshipper | Humble, praying figure or simple desert setting; sincerity and answered prayer; calm, spiritual mood. |
| **abu-ubaidah** | Abu Ubaidah ibn Al-Jarrah | sahabah | `abu-ubaidah.png` | The trustee of this nation | Trustworthy figure, perhaps with scroll or keys; integrity and calm; Islamic or desert background. |
| **hamza** | Hamza ibn Abdul-Muttalib | sahabah | `hamza.png` | The Lion of Allah and the Master of Martyrs | Strong, lion-hearted warrior with spear or bow; Uhud or desert; courage and martyrdom. |
| **khalid** | Khalid ibn Al-Walid | sahabah | `khalid.png` | The Drawn Sword of Allah | Commander on horseback or with drawn sword; desert or battle; “sword of Allah,” strategy and strength. |
| **musab** | Mus'ab ibn Umair | sahabah | `musab.png` | The first ambassador in Islam | Young man with scroll or book, teaching or traveling; first ambassador; knowledge and da'wah. |
| **salman** | Salman Al-Farsi | sahabah | `salman.png` | The seeker of truth and the strategist of the Trench | Persian seeker, book or lamp, or trench/digging; journey to truth and the Trench; wisdom and perseverance. |
| **abu-dharr** | Abu Dharr Al-Ghifari | sahabah | `abu-dharr.png` | The ascetic who lived alone and died alone | Lone ascetic in desert or simple hut; solitude, simplicity, and faith; stark but peaceful. |
| **ammar** | Ammar ibn Yasir | sahabah | `ammar.png` | The son of two martyrs and promised Paradise | Family of believers under trial; desert sun, steadfastness; “son of two martyrs,” patience and Paradise. |
| **suhaib** | Suhaib Ar-Rumi | sahabah | `suhaib.png` | “The transaction has profited, O Abu Yahya” | Man leaving wealth behind (caravan or chest), walking toward light or Medina; migration and “profit” in the Hereafter. |
| **abdullah-bin-masud** | Abdullah ibn Masud | sahabah | `abdullah-bin-masud.png` | The keeper of the Prophet's sandals and reciter of the Quran | Thin, devoted figure with Quran or sandals; recitation or service; knowledge and humility. |
| **muadh** | Muadh ibn Jabal | sahabah | `muadh.png` | The most knowledgeable of the nation in Halal and Haram | Young scholar with book or scroll; teaching or judging; wisdom, halal and haram, Yemen. |

---

## Quran Stories

| Story ID | Name (En) | Folder | Filename | Short description | Image description for generation |
|----------|-----------|--------|----------|-------------------|-----------------------------------|
| **luqman** | Luqman the Wise | quran | `luqman.png` | Timeless words of wisdom | Wise figure (stylized) with a young son; giving advice; trees, nature, or simple home; wisdom and gentle authority. |

---

## Summary

| Category   | Count | Story IDs |
|------------|-------|-----------|
| Prophets   | 0     | — |
| Sahabah    | 17    | bilal, khadija, talha, zubair, abdur-rahman, saad, saeed, abu-ubaidah, hamza, khalid, musab, salman, abu-dharr, ammar, suhaib, abdullah-bin-masud, muadh |
| Quran      | 1     | luqman |
| **Total**  | **18**| |

---

## After generating

1. Save each image as the **Filename** in the table (e.g. `bilal.png`, `luqman.png`).
2. Put it in **`assets/images/stories/{Folder}/`** (e.g. `assets/images/stories/sahabah/bilal.png`).
3. Register in the app:
   - **`app/chapters/[prophetId].tsx`** — add a line in the `storyImages` object:  
     `'bilal': require('@/assets/images/stories/sahabah/bilal.png'),`
   - **`components/ui/image-placeholder.tsx`** — add the same line in the `storyImages` object there.

Use **.png** for new assets unless you prefer **.jpg** (then use `.jpg` in the require path).
