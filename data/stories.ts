/**
 * Seed data for stories
 * Supports all categories: Prophets, Sahabah, Educational Stories
 */

import { Story, StoryCategory } from '@/types';

const existingStories: Story[] = [
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

// New Prophets
const newProphets: Story[] = [
  {
    id: 'adam',
    category: 'prophets',
    nameAr: 'آدم',
    nameEn: 'Adam',
    shortDescriptionAr: 'أبو البشر وأول الأنبياء',
    shortDescriptionEn: 'The father of humanity and the first prophet',
    illustration: '🌍',
  },
  {
    id: 'idris',
    category: 'prophets',
    nameAr: 'إدريس',
    nameEn: 'Idris (Enoch)',
    shortDescriptionAr: 'الصديق النبي الذي رفعه الله مكاناً علياً',
    shortDescriptionEn: 'The truthful prophet whom Allah raised to a high station',
    illustration: '📚',
  },
  {
    id: 'hud',
    category: 'prophets',
    nameAr: 'هود',
    nameEn: 'Hud',
    shortDescriptionAr: 'رسول عاد وقصة التحدي',
    shortDescriptionEn: 'The messenger to \'Ad and the story of defiance',
    illustration: '🌪️',
  },
  {
    id: 'saleh',
    category: 'prophets',
    nameAr: 'صالح',
    nameEn: 'Saleh',
    shortDescriptionAr: 'ناقة الله وآية ثمود',
    shortDescriptionEn: 'The she-camel of Allah and the sign for Thamud',
    illustration: 'camel', // Placeholder for now, will use emoji if text
  },
  {
    id: 'lut',
    category: 'prophets',
    nameAr: 'لوط',
    nameEn: 'Lut (Lot)',
    shortDescriptionAr: 'النبي الذي واجه فساد قومه',
    shortDescriptionEn: 'The prophet who confronted the corruption of his people',
    illustration: '🔥',
  },
  {
    id: 'ismail',
    category: 'prophets',
    nameAr: 'إسماعيل',
    nameEn: 'Ismail (Ishmael)',
    shortDescriptionAr: 'الذبيح وجد العرب',
    shortDescriptionEn: 'The sacrificed one and the forefather of the Arabs',
    illustration: '🕋',
  },
  {
    id: 'ishaq',
    category: 'prophets',
    nameAr: 'إسحاق',
    nameEn: 'Ishaq (Isaac)',
    shortDescriptionAr: 'النبي البشارة للصالحين',
    shortDescriptionEn: 'The prophet of good tidings for the righteous',
    illustration: '✨',
  },
  {
    id: 'yaqub',
    category: 'prophets',
    nameAr: 'يعقوب',
    nameEn: 'Yaqub (Jacob)',
    shortDescriptionAr: 'إسرائيل الصابر المحتسب',
    shortDescriptionEn: 'Israel, the patient and steadfast',
    illustration: '🌦️',
  },
  {
    id: 'shuaib',
    category: 'prophets',
    nameAr: 'شعيب',
    nameEn: 'Shu\'aib (Jethro)',
    shortDescriptionAr: 'خطيب الأنبياء والعدل في المكيال',
    shortDescriptionEn: 'The orator of the prophets and justice in measure',
    illustration: '⚖️',
  },
  {
    id: 'dawud',
    category: 'prophets',
    nameAr: 'داود',
    nameEn: 'Dawud (David)',
    shortDescriptionAr: 'الملك النبي وصاحب الزبور',
    shortDescriptionEn: 'The prophet-king and bearer of the Zabur',
    illustration: '🛡️',
  },
  {
    id: 'zakariya',
    category: 'prophets',
    nameAr: 'زكريا',
    nameEn: 'Zakariya (Zechariah)',
    shortDescriptionAr: 'كافل مريم والنبي الصالح',
    shortDescriptionEn: 'The guardian of Maryam and the righteous prophet',
    illustration: '🕌',
  },
  {
    id: 'yahya',
    category: 'prophets',
    nameAr: 'يحيى',
    nameEn: 'Yahya (John)',
    shortDescriptionAr: 'السيد الحصور والنبي الشهيد',
    shortDescriptionEn: 'The chaste master and martyr prophet',
    illustration: '📖',
  },
  {
    id: 'isa',
    category: 'prophets',
    nameAr: 'عيسى',
    nameEn: 'Isa (Jesus)',
    shortDescriptionAr: 'كلمة الله وروح منه',
    shortDescriptionEn: 'The Word of Allah and a Spirit from Him',
    illustration: '🕊️',
  },
];

// New Sahabah
const newSahabah: Story[] = [
  {
    id: 'talha',
    category: 'sahabah',
    nameAr: 'طلحة بن عبيد الله',
    nameEn: 'Talha ibn Ubaidullah',
    shortDescriptionAr: 'طلحة الخير وصقر يوم أحد',
    shortDescriptionEn: 'Talha the Good and the Falcon of Uhud',
    illustration: '🦅',
  },
  {
    id: 'zubair',
    category: 'sahabah',
    nameAr: 'الزبير بن العوام',
    nameEn: 'Az-Zubair ibn Al-Awam',
    shortDescriptionAr: 'حوارى رسول الله',
    shortDescriptionEn: 'The disciple of the Messenger of Allah',
    illustration: '⚔️',
  },
  {
    id: 'abdur-rahman',
    category: 'sahabah',
    nameAr: 'عبد الرحمن بن عوف',
    nameEn: 'Abdur Rahman ibn Awf',
    shortDescriptionAr: 'التاجر الصدوق وأحد العشرة المبشرين',
    shortDescriptionEn: 'The honest trader and one of the ten promised Paradise',
    illustration: '💰',
  },
  {
    id: 'saad',
    category: 'sahabah',
    nameAr: 'سعد بن أبي وقاص',
    nameEn: 'Saad ibn Abi Waqqas',
    shortDescriptionAr: 'أول من رمى بسهم في سبيل الله',
    shortDescriptionEn: 'The first to shoot an arrow for the cause of Allah',
    illustration: '🏹',
  },
  {
    id: 'saeed',
    category: 'sahabah',
    nameAr: 'سعيد بن زيد',
    nameEn: 'Saeed ibn Zaid',
    shortDescriptionAr: 'المستجاب الدعوة والزاهد العابد',
    shortDescriptionEn: 'The one whose prayers were answered and the ascetic worshipper',
    illustration: '🤲',
  },
  {
    id: 'abu-ubaidah',
    category: 'sahabah',
    nameAr: 'أبو عبيدة بن الجراح',
    nameEn: 'Abu Ubaidah ibn Al-Jarrah',
    shortDescriptionAr: 'أمين هذه الأمة',
    shortDescriptionEn: 'The trustee of this nation',
    illustration: '🤝',
  },
  {
    id: 'hamza',
    category: 'sahabah',
    nameAr: 'حمزة بن عبد المطلب',
    nameEn: 'Hamza ibn Abdul-Muttalib',
    shortDescriptionAr: 'أسد الله وسيد الشهداء',
    shortDescriptionEn: 'The Lion of Allah and the Master of Martyrs',
    illustration: '🦁',
  },
  {
    id: 'khalid',
    category: 'sahabah',
    nameAr: 'خالد بن الوليد',
    nameEn: 'Khalid ibn Al-Walid',
    shortDescriptionAr: 'سيف الله المسلول',
    shortDescriptionEn: 'The Drawn Sword of Allah',
    illustration: '⚔️',
  },
  {
    id: 'musab',
    category: 'sahabah',
    nameAr: 'مصعب بن عمير',
    nameEn: 'Mus\'ab ibn Umair',
    shortDescriptionAr: 'أول سفير في الإسلام',
    shortDescriptionEn: 'The first ambassador in Islam',
    illustration: '📜',
  },
  {
    id: 'salman',
    category: 'sahabah',
    nameAr: 'سلمان الفارسي',
    nameEn: 'Salman Al-Farsi',
    shortDescriptionAr: 'الباحث عن الحقيقة وصاحب فكرة الخندق',
    shortDescriptionEn: 'The seeker of truth and the strategist of the Trench',
    illustration: '🏰',
  },
  {
    id: 'abu-dharr',
    category: 'sahabah',
    nameAr: 'أبو ذر الغفاري',
    nameEn: 'Abu Dharr Al-Ghifari',
    shortDescriptionAr: 'الزاهد الذي عاش وحيداً ومات وحيداً',
    shortDescriptionEn: 'The ascetic who lived alone and died alone',
    illustration: '🌵',
  },
  {
    id: 'ammar',
    category: 'sahabah',
    nameAr: 'عمار بن ياسر',
    nameEn: 'Ammar ibn Yasir',
    shortDescriptionAr: 'ابن الشهيدين والمبشر بالجنة',
    shortDescriptionEn: 'The son of two martyrs and promised Paradise',
    illustration: '🕋',
  },
  {
    id: 'suhaib',
    category: 'sahabah',
    nameAr: 'صهيب الرومي',
    nameEn: 'Suhaib Ar-Rumi',
    shortDescriptionAr: 'الربح البيع يا أبا يحيى',
    shortDescriptionEn: '"The transaction has profited, O Abu Yahya"',
    illustration: '💎',
  },
  {
    id: 'abdullah-bin-masud',
    category: 'sahabah',
    nameAr: 'عبد الله بن مسعود',
    nameEn: 'Abdullah ibn Masud',
    shortDescriptionAr: 'صاحب نعلي رسول الله وقارئ القرآن',
    shortDescriptionEn: 'The keeper of the Prophet’s sandals and reciter of the Quran',
    illustration: '📖',
  },
  {
    id: 'muadh',
    category: 'sahabah',
    nameAr: 'معاذ بن جبل',
    nameEn: 'Muadh ibn Jabal',
    shortDescriptionAr: 'أعلم الأمة بالحلال والحرام',
    shortDescriptionEn: 'The most knowledgeable of the nation in Halal and Haram',
    illustration: '⚖️',
  },
];

// Mothers of Believers
const mothers: Story[] = [
  {
    id: 'sawda',
    category: 'mothers',
    nameAr: 'سودة بنت زمعة',
    nameEn: 'Sawda bint Zam\'a',
    shortDescriptionAr: 'المضحية والمؤثرة لرضا رسول الله',
    shortDescriptionEn: 'The self-sacrificing and preferring the pleasure of the Messenger',
    illustration: '👵',
  },
  {
    id: 'aisha',
    category: 'mothers',
    nameAr: 'عائشة بنت أبي بكر',
    nameEn: 'Aisha bint Abi Bakr',
    shortDescriptionAr: 'الصديقة بنت الصديق، فقيهة الأمة',
    shortDescriptionEn: 'The truthful daughter of the truthful, the scholar of the nation',
    illustration: '📚',
  },
  {
    id: 'hafsa',
    category: 'mothers',
    nameAr: 'حفصة بنت عمر',
    nameEn: 'Hafsa bint Umar',
    shortDescriptionAr: 'حارسة القرآن والصوامة القوامة',
    shortDescriptionEn: 'The guardian of the Quran and the fasting, praying one',
    illustration: '📜',
  },
  {
    id: 'zaynab',
    category: 'mothers',
    nameAr: 'زينب بنت جحش',
    nameEn: 'Zaynab bint Jahsh',
    shortDescriptionAr: 'التي زوجها الله من فوق سبع سماوات',
    shortDescriptionEn: 'The one married by Allah from above seven heavens',
    illustration: '💍',
  },
  {
    id: 'umm-salama',
    category: 'mothers',
    nameAr: 'أخلفني الله خيراً منها',
    nameEn: 'Umm Salama',
    shortDescriptionAr: 'صاحبة الرأي السديد في الحديبية',
    shortDescriptionEn: 'The possessor of sound opinion at Hudaibiyah',
    illustration: '⛺',
  },
  {
    id: 'juwayriya',
    category: 'mothers',
    nameAr: 'جويرية بنت الحارث',
    nameEn: 'Juwayriya bint al-Harith',
    shortDescriptionAr: 'أعظم النساء بركة على قومها',
    shortDescriptionEn: 'The woman with the greatest blessing for her people',
    illustration: '🤝',
  },
];

// Quran Stories
const quranStories: Story[] = [
  {
    id: 'ashab-al-kahf',
    category: 'quran',
    nameAr: 'أصحاب الكهف',
    nameEn: 'Companions of the Cave',
    shortDescriptionAr: 'الفتية الذين آمنوا بربهم وزادهم الله هدى',
    shortDescriptionEn: 'The youths who believed in their Lord and were increased in guidance',
    illustration: '🕳️',
  },
  {
    id: 'sahib-al-jannatayn',
    category: 'quran',
    nameAr: 'صاحب الجنتين',
    nameEn: 'Owner of the Two Gardens',
    shortDescriptionAr: 'قصة الغرور والجحود وعاقبتهما',
    shortDescriptionEn: 'The story of arrogance and ingratitude and their consequence',
    illustration: '🍇',
  },
  {
    id: 'qarun',
    category: 'quran',
    nameAr: 'قارون',
    nameEn: 'Qarun (Korah)',
    shortDescriptionAr: 'المال الذي لم ينفع صاحبه',
    shortDescriptionEn: 'The wealth that did not benefit its owner',
    illustration: '💰',
  },
  {
    id: 'luqman',
    category: 'quran',
    nameAr: 'لقمان الحكيم',
    nameEn: 'Luqman the Wise',
    shortDescriptionAr: 'وصايا حكمية لخالدة',
    shortDescriptionEn: 'Timeless words of wisdom',
    illustration: '🧠',
  },
  {
    id: 'dhul-qarnayn',
    category: 'quran',
    nameAr: 'ذو القرنين',
    nameEn: 'Dhul-Qarnayn',
    shortDescriptionAr: 'الحاكم العادل الذي طاف الأرض',
    shortDescriptionEn: 'The just ruler who traveled the earth',
    illustration: '🌏',
  },
  {
    id: 'ashab-al-ukhdud',
    category: 'quran',
    nameAr: 'أصحاب الأخدود',
    nameEn: 'People of the Ditch',
    shortDescriptionAr: 'الثبات على العقيدة أمام النار',
    shortDescriptionEn: 'Steadfastness in faith before the fire',
    illustration: '🔥',
  },
  {
    id: 'ashab-al-fil',
    category: 'quran',
    nameAr: 'أصحاب الفيل',
    nameEn: 'Owners of the Elephant',
    shortDescriptionAr: 'كيف حمى الله بيته الحرام',
    shortDescriptionEn: 'How Allah protected His Sacred House',
    illustration: '🐘',
  },
  {
    id: 'uzair',
    category: 'quran',
    nameAr: 'عزير',
    nameEn: 'Uzair (Ezra)',
    shortDescriptionAr: 'الذي أماته الله مائة عام ثم بعثه',
    shortDescriptionEn: 'The one Allah caused to die for a hundred years then resurrected',
    illustration: '⏳',
  },
  {
    id: 'talut-jalut',
    category: 'quran',
    nameAr: 'طالوت وجالوت',
    nameEn: 'Talut and Jalut',
    shortDescriptionAr: 'كم من فئة قليلة غلبت فئة كثيرة',
    shortDescriptionEn: 'How many a small company has overcome a large company',
    illustration: '🛡️',
  },
];

export const stories: Story[] = [
  ...existingStories,
  ...newProphets,
  ...newSahabah,
  ...mothers,
  ...quranStories,
];


export const getStoryById = (id: string): Story | undefined => {
  return stories.find((s) => s.id === id);
};

// Order by importance (most prominent first) for display on category screens and homepage
const STORY_ORDER_BY_CATEGORY: Partial<Record<StoryCategory, string[]>> = {
  // Prophets: chronological (Adam → Isa), most foundational first
  prophets: [
    'adam', 'idris', 'nuh', 'hud', 'saleh', 'ibrahim', 'lut', 'ismail', 'ishaq', 'yaqub', 'yusuf',
    'ayyub', 'shuaib', 'musa', 'dawud', 'sulaiman', 'yunus', 'zakariya', 'yahya', 'isa',
  ],
  // Sahabah: Four Caliphs first, then ten promised Paradise, then by prominence (Hamza, Bilal, Khadija, etc.)
  sahabah: [
    'abu-bakr', 'umar', 'uthman', 'ali',
    'talha', 'zubair', 'abdur-rahman', 'saad', 'saeed', 'abu-ubaidah',
    'hamza', 'bilal', 'khadija', 'musab', 'salman', 'khalid',
    'abu-dharr', 'ammar', 'suhaib', 'abdullah-bin-masud', 'muadh',
  ],
  // Educational: most well-known first (Three Men in the Cave, then Merchant, Boy and King, Man and the Dog)
  educational: [
    'the-three-men', 'the-merchant', 'the-boy-and-the-king', 'the-man-and-the-dog',
  ],
  // Mothers: by prominence (Aisha, Hafsa, Umm Salama, then Sawda, Zaynab, Juwayriya)
  mothers: [
    'aisha', 'hafsa', 'umm-salama', 'sawda', 'zaynab', 'juwayriya',
  ],
  // Quran stories: most famous first (Companions of the Cave, Luqman, People of the Elephant, etc.)
  quran: [
    'ashab-al-kahf', 'luqman', 'ashab-al-fil', 'dhul-qarnayn', 'qarun',
    'ashab-al-ukhdud', 'sahib-al-jannatayn', 'uzair', 'talut-jalut',
  ],
};

export const getStoriesByCategory = (category: StoryCategory): Story[] => {
  const filtered = stories.filter((s) => s.category === category);
  const order = STORY_ORDER_BY_CATEGORY[category];
  if (!order?.length) return filtered;
  const orderMap = new Map(order.map((id, i) => [id, i]));
  return [...filtered].sort((a, b) => {
    const ai = orderMap.get(a.id) ?? 999;
    const bi = orderMap.get(b.id) ?? 999;
    return ai - bi;
  });
};

export const getAllStories = (): Story[] => {
  return stories;
};

// Legacy functions for backward compatibility
export const getProphetById = (id: string): Story | undefined => {
  return getStoryById(id);
};

export const prophets: Story[] = stories.filter((s) => s.category === 'prophets');
