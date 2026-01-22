/**
 * Seed data for prophets
 * MVP: Starting with Prophet Yusuf (Joseph) - one of the most beautiful stories in the Quran
 */

import { Prophet } from '@/types';

export const prophets: Prophet[] = [
  {
    id: 'yusuf',
    nameAr: 'يوسف',
    nameEn: 'Yusuf (Joseph)',
    shortDescription: 'The story of patience, forgiveness, and unwavering faith through trials',
    illustration: '🌙', // Using emoji for MVP, can be replaced with actual illustrations
  },
  {
    id: 'ibrahim',
    nameAr: 'إبراهيم',
    nameEn: 'Ibrahim (Abraham)',
    shortDescription: 'The father of prophets, who showed ultimate trust in Allah',
    illustration: '⭐',
  },
  {
    id: 'musa',
    nameAr: 'موسى',
    nameEn: 'Musa (Moses)',
    shortDescription: 'The prophet who spoke directly to Allah and led his people to freedom',
    illustration: '🌊',
  },
  {
    id: 'nuh',
    nameAr: 'نوح',
    nameEn: 'Nuh (Noah)',
    shortDescription: 'The patient prophet who preached for 950 years and built the ark',
    illustration: '🕊️',
  },
];

export const getProphetById = (id: string): Prophet | undefined => {
  return prophets.find((p) => p.id === id);
};
