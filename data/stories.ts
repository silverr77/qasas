/**
 * Seed data for stories
 * Supports all categories: Prophets, Sahabah, Educational Stories
 */

import { Story, StoryCategory } from '@/types';

export const stories: Story[] = [
  // Prophets (الأنبياء)
  {
    id: 'yusuf',
    category: 'prophets',
    nameAr: 'يوسف',
    nameEn: 'Yusuf (Joseph)',
    shortDescription: 'The story of patience, forgiveness, and unwavering faith through trials',
    illustration: '🌙',
  },
  {
    id: 'ibrahim',
    category: 'prophets',
    nameAr: 'إبراهيم',
    nameEn: 'Ibrahim (Abraham)',
    shortDescription: 'The father of prophets, who showed ultimate trust in Allah',
    illustration: '⭐',
  },
  {
    id: 'musa',
    category: 'prophets',
    nameAr: 'موسى',
    nameEn: 'Musa (Moses)',
    shortDescription: 'The prophet who spoke directly to Allah and led his people to freedom',
    illustration: '🌊',
  },
  {
    id: 'nuh',
    category: 'prophets',
    nameAr: 'نوح',
    nameEn: 'Nuh (Noah)',
    shortDescription: 'The patient prophet who preached for 950 years and built the ark',
    illustration: '🕊️',
  },
  
  // Sahabah (الصحابة)
  {
    id: 'abu-bakr',
    category: 'sahabah',
    nameAr: 'أبو بكر الصديق',
    nameEn: 'Abu Bakr As-Siddiq',
    shortDescription: 'The first Caliph and closest companion, known for his unwavering faith and truthfulness',
    illustration: '⭐',
  },
  {
    id: 'umar',
    category: 'sahabah',
    nameAr: 'عمر بن الخطاب',
    nameEn: 'Umar ibn Al-Khattab',
    shortDescription: 'The second Caliph, known for his justice and strength in faith',
    illustration: '⚖️',
  },
  {
    id: 'uthman',
    category: 'sahabah',
    nameAr: 'عثمان بن عفان',
    nameEn: 'Uthman ibn Affan',
    shortDescription: 'The third Caliph, known for his generosity and modesty',
    illustration: '📖',
  },
  {
    id: 'ali',
    category: 'sahabah',
    nameAr: 'علي بن أبي طالب',
    nameEn: 'Ali ibn Abi Talib',
    shortDescription: 'The fourth Caliph and cousin of the Prophet, known for his knowledge and courage',
    illustration: '🗡️',
  },
  
  // Educational Stories (قصص تعليمية)
  {
    id: 'the-three-men',
    category: 'educational',
    nameAr: 'قصة الثلاثة',
    nameEn: 'The Three Men in the Cave',
    shortDescription: 'A story of sincere supplication and trust in Allah',
    illustration: '🕳️',
  },
  {
    id: 'the-merchant',
    category: 'educational',
    nameAr: 'قصة التاجر',
    nameEn: 'The Honest Merchant',
    shortDescription: 'A lesson in honesty and integrity in business',
    illustration: '💼',
  },
];

export const getStoryById = (id: string): Story | undefined => {
  return stories.find((s) => s.id === id);
};

export const getStoriesByCategory = (category: StoryCategory): Story[] => {
  return stories.filter((s) => s.category === category);
};

export const getAllStories = (): Story[] => {
  return stories;
};

// Legacy functions for backward compatibility
export const getProphetById = (id: string): Story | undefined => {
  return getStoryById(id);
};

export const prophets: Story[] = stories.filter((s) => s.category === 'prophets');
