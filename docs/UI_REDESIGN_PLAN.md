# UI Redesign Plan - Home & Stories Screens

## Overview
This document outlines the redesign of the home screen and stories/categories screens, inspired by modern children's story app interfaces. The design will maintain the spiritual and mindful essence of Qasas while adopting a more visual, engaging, and user-friendly layout.

---

## 🎨 Design System

### Color Palette
Based on the reference images, we'll use:

**Primary Colors:**
- **Cream/Beige Background**: `#FAF8F3` (main background)
- **Light Cream Card**: `#FDF9F3` (card backgrounds)
- **Orange Accent**: `#FF6B35` (primary buttons, highlights)
- **Soft Orange**: `#FF8C5A` (hover states, secondary accents)

**Text Colors:**
- **Primary Text**: `#2C2C2C` (dark gray for headings)
- **Secondary Text**: `#6B6B6B` (medium gray for body text)
- **Tertiary Text**: `#9B9B9B` (light gray for hints)

**Category Colors:**
- **Prophets (Sage Green)**: `#739A7B` with light background `#E8F0EA`
- **Sahabah (Gold)**: `#E8B130` with light background `#FDF8E8`
- **Educational (Soft Blue)**: `#4A7C7E` with light background `#E8F0F2`

**UI Elements:**
- **Border Color**: `#E5E5E5` (light gray)
- **Divider**: `#F0F0F0` (very light gray)
- **Shadow**: `rgba(0, 0, 0, 0.08)` (subtle shadows)

### Typography
- **Display Large**: 32px, Bold (screen titles)
- **Heading Large**: 24px, Bold (section titles)
- **Heading Medium**: 20px, SemiBold (card titles)
- **Body Large**: 16px, Regular (body text)
- **Body Medium**: 14px, Regular (descriptions)
- **Label Small**: 12px, Medium (labels, badges)

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **xxl**: 32px
- **xxxl**: 48px

### Border Radius
- **Small**: 8px (buttons, small cards)
- **Medium**: 12px (category buttons)
- **Large**: 16px (story cards)
- **XLarge**: 24px (large containers)

---

## 📱 Screen 1: Home Screen Redesign

### Layout Structure

```
┌─────────────────────────────────────┐
│ [Status Bar]                        │
├─────────────────────────────────────┤
│ [Header Section]                    │
│  • Profile/Icon (left)              │
│  • Welcome Message (center)         │
├─────────────────────────────────────┤
│ [Search Bar]                        │
│  • Search icon + placeholder       
├─────────────────────────────────────┤
│ [Story Categories]                  │
│  • Horizontal scrollable            │
│  • 4 category buttons               │
├─────────────────────────────────────┤
│ [Recommended Stories]                │
│  • Section header + "See all"       │
│  • Horizontal scrollable cards      │
│  • Large illustrations              │
├─────────────────────────────────────┤
│ [Continue Reading] (if applicable)  │
│  • Card with last read chapter      │
├─────────────────────────────────────┤
│ [Quick Stats] (optional)            │
│  • Mini progress widget             │
└─────────────────────────────────────┘
```

### Component Specifications

#### 1. Header Section
- **Height**: 80px
- **Background**: Transparent
- **Layout**: Flex row, space-between
- **Left**: Profile icon (circular, 40px) or app icon
- **Center**: 
  - "Welcome back" (12px, gray)
  - User name or "Assalamu Alaikum" (20px, bold, dark)
- **Right**: Notification bell icon (24px, gray)

#### 2. Search Bar
- **Height**: 48px
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#E5E5E5`
- **Border Radius**: 24px (fully rounded)
- **Padding**: 12px 16px
- **Layout**: Flex row, space-between, align-center
- **Left**: Search icon (20px, orange) + placeholder text
- **Right**: Voice search button (circular, 36px, orange background)

#### 3. Story Categories Section
- **Title**: "Story Categories" (18px, bold, dark)
- **Layout**: Horizontal ScrollView
- **Spacing**: 12px between cards
- **Category Button**:
  - **Width**: 100px
  - **Height**: 120px
  - **Background**: Light category color
  - **Border Radius**: 16px
  - **Padding**: 16px
  - **Content**: 
    - Icon (48px, centered)
    - Category name (14px, medium, dark, centered, bottom)
  - **Categories**:
    - Prophets: 🌙 icon, sage green
    - Sahabah: ⭐ icon, gold
    - Educational: 📚 icon, soft blue
    - All Stories: 📖 icon, orange

#### 4. Recommended Stories Section
- **Header**: 
  - "Recommended" (18px, bold, left)
  - "See all" (14px, orange, right, tappable)
- **Layout**: Horizontal ScrollView
- **Spacing**: 16px between cards
- **Story Card**:
  - **Width**: 280px
  - **Height**: 360px
  - **Background**: `#FFFFFF`
  - **Border Radius**: 20px
  - **Shadow**: 0 4px 12px rgba(0,0,0,0.08)
  - **Content**:
    - **Illustration**: 280x200px, rounded top corners
    - **Title Overlay**: White text, 18px bold, positioned top-left on image
    - **Duration Badge**: Clock icon + "X mins", 12px, white background, bottom-left
    - **Play Button**: Large circular (64px), orange, centered at bottom, overlapping card edge
    - **Story Info**: Title (16px bold) + description (12px gray) below image

#### 5. Continue Reading Card (if applicable)
- **Width**: Full width minus 32px padding
- **Height**: 120px
- **Background**: `#FFFFFF`
- **Border Radius**: 16px
- **Shadow**: 0 2px 8px rgba(0,0,0,0.06)
- **Layout**: Flex row
- **Left**: Small thumbnail (80x80px, rounded 12px)
- **Right**: 
  - "Continue Reading" label (12px, gray)
  - Chapter title (16px, bold)
  - Story name (14px, gray)
  - Progress indicator

---

## 📱 Screen 2: Stories/Categories Screen Redesign

### Layout Structure

```
┌─────────────────────────────────────┐
│ [Status Bar]                        │
├─────────────────────────────────────┤
│ [Header Bar]                        │
│  • Back arrow (left)                │
│  • Category icon + title (center)   │
│  • Search/filter icon (right)       │
├─────────────────────────────────────┤
│ [Category Info]                      │
│  • Category name + count            │
│  • Description                      │
├─────────────────────────────────────┤
│ [Story List]                        │
│  • Vertical scrollable              │
│  • Story cards with illustrations   │
└─────────────────────────────────────┘
```

### Component Specifications

#### 1. Header Bar
- **Height**: 56px
- **Background**: `#FAF8F3`
- **Layout**: Flex row, space-between, align-center
- **Left**: Back arrow (24px, dark)
- **Center**: 
  - Category icon (32px)
  - Category name (20px, bold)
- **Right**: Search icon (24px, dark)

#### 2. Category Info Section
- **Height**: 100px
- **Background**: Light category color
- **Padding**: 20px
- **Content**:
  - Category name (24px, bold, dark)
  - Story count (14px, gray) - "X stories available"
  - Short description (12px, gray)

#### 3. Story List Item
- **Width**: Full width minus 32px padding
- **Height**: 180px
- **Background**: `#FFFFFF`
- **Border Radius**: 16px
- **Shadow**: 0 2px 8px rgba(0,0,0,0.06)
- **Margin**: 12px vertical
- **Layout**: Flex row
- **Left**: Illustration (140x140px, rounded 12px)
- **Right**: 
  - Story title (18px, bold, dark)
  - Story description (14px, gray, 2 lines max)
  - Duration (12px, gray) with clock icon
  - Play button (48px, circular, orange, bottom-right)

---

## 🎯 Implementation Details

### New Components to Create

1. **HomeHeader** (`components/home/home-header.tsx`)
   - Profile/icon, welcome message, notifications

2. **SearchBar** (`components/home/search-bar.tsx`)
   - Search input with voice button

3. **CategoryButton** (`components/home/category-button.tsx`)
   - Individual category button with icon

4. **StoryCard** (`components/stories/story-card.tsx`)
   - Large story card for home screen recommendations

5. **StoryListItem** (`components/stories/story-list-item.tsx`)
   - Story item for list view

6. **CategoryHeader** (`components/categories/category-header.tsx`)
   - Category screen header with icon

7. **CategoryInfo** (`components/categories/category-info.tsx`)
   - Category description section

### Updated Components

1. **HomeScreen** (`app/(tabs)/index.tsx`)
   - Complete redesign with new layout

2. **StoriesScreen** (`app/stories.tsx`)
   - New list-based layout

3. **CategoryScreen** (`app/categories/[categoryId].tsx`)
   - Enhanced with category info section

### Image Placeholders

For story illustrations, we'll use:
- **Placeholder Component**: `components/ui/image-placeholder.tsx`
- **Dimensions**: 
  - Home card: 280x200px
  - List item: 140x140px
- **Style**: 
  - Background: Light category color
  - Icon: Story category icon (🌙, ⭐, 📚)
  - Text: "Illustration Placeholder"
  - Border: 1px dashed `#E5E5E5`

### Animation & Interactions

1. **Card Press Animation**:
   - Scale: 0.98 on press
   - Duration: 150ms

2. **Scroll Animations**:
   - Fade in for cards as they enter viewport
   - Stagger animation for list items

3. **Category Selection**:
   - Scale animation: 1.05 on press
   - Color transition: 200ms

---

## 📋 Implementation Checklist

### Phase 1: Design System Setup
- [ ] Update theme colors in `constants/theme.ts`
- [ ] Add new spacing values
- [ ] Create image placeholder component
- [ ] Update typography scale

### Phase 2: Home Screen Components
- [ ] Create `HomeHeader` component
- [ ] Create `SearchBar` component
- [ ] Create `CategoryButton` component
- [ ] Create new `StoryCard` component (home version)
- [ ] Update `DailyRecommendation` to use new card
- [ ] Update `CategoryCards` to use new buttons

### Phase 3: Home Screen Layout
- [ ] Redesign `app/(tabs)/index.tsx`
- [ ] Implement new layout structure
- [ ] Add horizontal scroll views
- [ ] Integrate all components
- [ ] Add animations

### Phase 4: Stories Screen
- [ ] Create `StoryListItem` component
- [ ] Redesign `app/stories.tsx`
- [ ] Implement vertical list layout
- [ ] Add search functionality (UI only)

### Phase 5: Category Screen
- [ ] Create `CategoryHeader` component
- [ ] Create `CategoryInfo` component
- [ ] Redesign `app/categories/[categoryId].tsx`
- [ ] Add category-specific styling

### Phase 6: Polish & Testing
- [ ] Test on different screen sizes
- [ ] Verify RTL support
- [ ] Test animations
- [ ] Verify accessibility
- [ ] Test with real data

---

## 🎨 Visual Specifications

### Home Screen Measurements

**Header:**
- Top padding: 16px
- Height: 80px
- Profile icon: 40x40px
- Welcome text: 12px/20px

**Search Bar:**
- Margin: 16px horizontal, 24px vertical
- Height: 48px
- Border radius: 24px
- Voice button: 36x36px

**Categories:**
- Section padding: 16px horizontal
- Title margin bottom: 12px
- Card size: 100x120px
- Card spacing: 12px
- Icon size: 48px

**Recommended:**
- Section padding: 16px horizontal
- Title margin bottom: 16px
- Card size: 280x360px
- Card spacing: 16px
- Illustration: 280x200px
- Play button: 64x64px

### Stories Screen Measurements

**Header:**
- Height: 56px
- Icon: 32x32px
- Title: 20px bold

**Category Info:**
- Height: 100px
- Padding: 20px
- Title: 24px bold
- Count: 14px gray

**Story Item:**
- Height: 180px
- Padding: 16px
- Illustration: 140x140px
- Title: 18px bold
- Play button: 48x48px

---

## 🔄 Migration Notes

1. **Existing Components**: Some components like `ProphetCard` will be replaced by new `StoryCard` and `StoryListItem`
2. **Data Structure**: No changes needed - existing `Story` and `StoryChapter` types work
3. **Navigation**: Routes remain the same
4. **State Management**: No changes needed

---

## ✅ Success Criteria

1. **Visual Match**: Design matches reference images in layout and spacing
2. **Responsive**: Works on all iOS screen sizes
3. **Performance**: Smooth scrolling and animations
4. **Accessibility**: All elements accessible via screen reader
5. **RTL Support**: Layout works correctly in Arabic
6. **Theme Support**: Works with light/dark mode

---

## 🌍 Language Support

### Full Internationalization
- **Arabic Mode**: When user selects Arabic, the entire app interface switches to Arabic
  - All text, labels, buttons, and UI elements in Arabic
  - RTL (Right-to-Left) layout direction
  - Arabic typography and spacing adjustments
  - Mirrored layouts for RTL

- **English Mode**: When user selects English, the entire app interface switches to English
  - All text, labels, buttons, and UI elements in English
  - LTR (Left-to-Right) layout direction
  - No mixing of languages in the UI

### Implementation Requirements
- All components must use `useTranslation()` hook
- All hardcoded strings must be replaced with translation keys
- RTL layout support using `I18nManager.forceRTL()`
- Dynamic layout direction based on selected language
- Text alignment adjustments for RTL
- Icon and arrow mirroring for RTL
- All new components must support both languages from the start

## 📝 Notes

- All images will use placeholder components initially
- User will regenerate images using Gemini
- Color palette can be adjusted based on user feedback
- Animations should be subtle and mindful (not distracting)
- Maintain the spiritual, calm feeling of Qasas while being more visual
- **No language mixing**: UI must be fully in one language at a time

---

*This plan is ready for review. Once approved, implementation will begin following the checklist above.*
