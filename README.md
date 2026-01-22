# Qasas - قصص الأنبياء

A calm, mindful Islamic reading app focused on the Stories of the Prophets (قصص الأنبياء).

## 🌙 Overview

Qasas is designed to encourage intentional, time-boxed reading with reflection instead of binge reading. The experience is spiritual, respectful, and distraction-free.

## ✨ Core Features

- **Page-by-page reading** - No infinite scroll, encouraging focused reading
- **Time-boxed sessions** - Choose 3, 5, or 10 minute reading sessions
- **Intentional reading** - Set your intention before each session
- **Reflection prompts** - Meaningful questions after each session
- **Daily discipline** - Chapters lock for 24 hours after completion
- **Progress tracking** - Gentle tracking of your reading journey
- **Dark mode support** - Beautiful in both light and dark themes

## 🎨 Design Philosophy

- **Calm & minimal UX**
- **No aggressive gamification**
- **No ads during reading**
- **Accessibility-first**
- **Page-by-page reading (not infinite scroll)**
- **Encourage daily consistency without pressure**

## 📱 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🏗️ Project Structure

```
qasas/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigator screens
│   │   ├── index.tsx        # Home screen
│   │   └── explore.tsx      # Progress screen
│   ├── prophets.tsx         # Prophets list
│   ├── chapters/            # Chapter selection
│   ├── reading-setup/       # Reading session setup
│   ├── reading/             # Reading experience
│   └── reflection/          # Post-reading reflection
├── components/              # Reusable components
│   ├── ui/                  # Base UI components
│   ├── prophet-card.tsx     # Prophet display card
│   ├── chapter-item.tsx     # Chapter list item
│   ├── reading-pager.tsx    # Page-by-page reader
│   └── progress-indicator.tsx
├── constants/
│   └── theme.ts             # Design system & colors
├── data/
│   ├── prophets.ts          # Prophet seed data
│   └── chapters.ts          # Story chapters
├── hooks/                   # Custom React hooks
├── store/
│   └── reading-store.ts     # Zustand state management
├── types/
│   └── index.ts             # TypeScript types
└── utils/
    ├── paginate-text.ts     # Text pagination
    └── timer.ts             # Time utilities
```

## 📖 Data Models

### Prophet
- `id`: Unique identifier
- `nameAr`: Arabic name
- `nameEn`: English name
- `shortDescription`: Brief description
- `illustration`: Emoji or asset path

### StoryChapter
- `id`: Unique identifier
- `prophetId`: Reference to prophet
- `title`: Chapter title
- `content`: Story text
- `estimatedReadingTime`: Minutes
- `reflectionPrompt`: Question for reflection
- `relatedAyahOrQuote`: Related Quranic verse

### ReadingSession
- `id`: Session identifier
- `chapterId`: Chapter being read
- `selectedDuration`: 3, 5, or 10 minutes
- `startTime`: Session start
- `endTime`: Session end
- `isCompleted`: Completion status
- `lockedUntil`: 24-hour lock timestamp

## 🎯 User Flow

1. **Home Screen** - Greeting, continue reading, choose prophet
2. **Prophets List** - Browse available prophets
3. **Chapter Selection** - Choose a chapter to read
4. **Reading Setup** - Set intention, duration, font size
5. **Reading Experience** - Page-by-page with timer
6. **Reflection** - Post-reading reflection and notes

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Zustand with AsyncStorage persistence
- **Animations**: React Native Reanimated
- **Date/Time**: Day.js
- **Haptics**: Expo Haptics

## 🎨 Design System

### Colors
- **Primary**: Soft sage green (#5A7D61)
- **Accent**: Muted gold (#E8B130)
- **Background**: Warm sand (#FDF9F3)
- **Text**: Warm neutral (#252521)

### Typography
- System fonts with Arabic text support
- Dynamic font sizing for accessibility
- Comfortable line heights for reading

## 📱 Accessibility

- Dynamic font scaling support
- Screen reader friendly
- Large tap areas (44pt minimum)
- High contrast support
- Semantic labels on all interactive elements

## 🔮 Future Enhancements

- [ ] Audio recitation support
- [ ] More prophets and stories
- [ ] Search functionality
- [ ] Bookmarking
- [ ] Sharing quotes
- [ ] Widget support
- [ ] Cloud sync

## 📄 License

This project is private and not licensed for distribution.

---

جزاكم الله خيرا
*May Allah reward you with goodness*
