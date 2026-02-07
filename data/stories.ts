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
    shortDescriptionAr: 'قصة الصبر والمغفرة والإيمان الراسخ في مواجهة المحن',
    shortDescriptionEn: 'The story of patience, forgiveness, and unwavering faith through trials',
    illustration: '🌙',
  },
  {
    id: 'ibrahim',
    category: 'prophets',
    nameAr: 'إبراهيم',
    nameEn: 'Ibrahim (Abraham)',
    shortDescriptionAr: 'أبو الأنبياء الذي أظهر الثقة المطلقة بالله',
    shortDescriptionEn: 'The father of prophets, who showed ultimate trust in Allah',
    illustration: '⭐',
  },
  {
    id: 'musa',
    category: 'prophets',
    nameAr: 'موسى',
    nameEn: 'Musa (Moses)',
    shortDescriptionAr: 'النبي الذي كلم الله وقاد قومه إلى الحرية',
    shortDescriptionEn: 'The prophet who spoke directly to Allah and led his people to freedom',
    illustration: '🌊',
  },
  {
    id: 'nuh',
    category: 'prophets',
    nameAr: 'نوح',
    nameEn: 'Nuh (Noah)',
    shortDescriptionAr: 'النبي الصبور الذي دعا قومه ٩٥٠ سنة وبنى السفينة',
    shortDescriptionEn: 'The patient prophet who preached for 950 years and built the ark',
    illustration: '🕊️',
  },
  {
    id: 'yunus',
    category: 'prophets',
    nameAr: 'يونس',
    nameEn: 'Yunus (Jonah)',
    shortDescriptionAr: 'النبي في بطن الحوت والدعاء الذي لا يرد',
    shortDescriptionEn: 'The prophet in the belly of the whale and the supplication that is never rejected',
    illustration: '🐋',
  },
  {
    id: 'ayyub',
    category: 'prophets',
    nameAr: 'أيوب',
    nameEn: 'Ayyub (Job)',
    shortDescriptionAr: 'النبي الصابر في البلاء والشكر عند الفرج',
    shortDescriptionEn: 'The prophet of patience in trial and gratitude in relief',
    illustration: '💪',
  },
  {
    id: 'sulaiman',
    category: 'prophets',
    nameAr: 'سليمان',
    nameEn: 'Sulaiman (Solomon)',
    shortDescriptionAr: 'الملك النبي والحكمة والعدل',
    shortDescriptionEn: 'The prophet-king, wisdom and justice',
    illustration: '👑',
  },

  // Sahabah (الصحابة)
  {
    id: 'abu-bakr',
    category: 'sahabah',
    nameAr: 'أبو بكر الصديق',
    nameEn: 'Abu Bakr As-Siddiq',
    shortDescriptionAr: 'الخليفة الأول وأقرب الصحابة، عُرف بإيمانه الراسخ وصدقه',
    shortDescriptionEn: 'The first Caliph and closest companion, known for his unwavering faith and truthfulness',
    illustration: '⭐',
  },
  {
    id: 'umar',
    category: 'sahabah',
    nameAr: 'عمر بن الخطاب',
    nameEn: 'Umar ibn Al-Khattab',
    shortDescriptionAr: 'الخليفة الثاني، عُرف بعدله وقوته في الإيمان',
    shortDescriptionEn: 'The second Caliph, known for his justice and strength in faith',
    illustration: '⚖️',
  },
  {
    id: 'uthman',
    category: 'sahabah',
    nameAr: 'عثمان بن عفان',
    nameEn: 'Uthman ibn Affan',
    shortDescriptionAr: 'الخليفة الثالث، عُرف بكرمه وتواضعه',
    shortDescriptionEn: 'The third Caliph, known for his generosity and modesty',
    illustration: '📖',
  },
  {
    id: 'ali',
    category: 'sahabah',
    nameAr: 'علي بن أبي طالب',
    nameEn: 'Ali ibn Abi Talib',
    shortDescriptionAr: 'الخليفة الرابع وابن عم النبي، عُرف بعلمه وشجاعته',
    shortDescriptionEn: 'The fourth Caliph and cousin of the Prophet, known for his knowledge and courage',
    illustration: '🗡️',
  },
  {
    id: 'bilal',
    category: 'sahabah',
    nameAr: 'بلال بن رباح',
    nameEn: 'Bilal ibn Rabah',
    shortDescriptionAr: 'مؤذن الرسول والصبر تحت التعذيب',
    shortDescriptionEn: 'The Prophet\'s muezzin and steadfastness under torture',
    illustration: '🕌',
  },
  {
    id: 'khadija',
    category: 'sahabah',
    nameAr: 'خديجة بنت خويلد',
    nameEn: 'Khadija bint Khuwaylid',
    shortDescriptionAr: 'أول المؤمنات ونصيرة النبي',
    shortDescriptionEn: 'The first believer and supporter of the Prophet',
    illustration: '🌹',
  },

  // Educational Stories (قصص تعليمية)
  {
    id: 'the-three-men',
    category: 'educational',
    nameAr: 'قصة الثلاثة',
    nameEn: 'The Three Men in the Cave',
    shortDescriptionAr: 'قصة عن الدعاء الصادق والتوكل على الله',
    shortDescriptionEn: 'A story of sincere supplication and trust in Allah',
    illustration: '🕳️',
  },
  {
    id: 'the-merchant',
    category: 'educational',
    nameAr: 'قصة التاجر',
    nameEn: 'The Honest Merchant',
    shortDescriptionAr: 'درس في الصدق والأمانة في التجارة',
    shortDescriptionEn: 'A lesson in honesty and integrity in business',
    illustration: '💼',
  },
  {
    id: 'the-boy-and-the-king',
    category: 'educational',
    nameAr: 'الغلام والملك',
    nameEn: 'The Boy and the King',
    shortDescriptionAr: 'قصة الإيمان الثابت حتى الشهادة',
    shortDescriptionEn: 'A story of steadfast faith until martyrdom',
    illustration: '🕯️',
  },
  {
    id: 'the-man-and-the-dog',
    category: 'educational',
    nameAr: 'الرجل والكلب',
    nameEn: 'The Man Who Gave Water to a Dog',
    shortDescriptionAr: 'الرحمة بكل كائن سبب للمغفرة',
    shortDescriptionEn: 'Mercy to every creature as a cause for forgiveness',
    illustration: '🐕',
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
