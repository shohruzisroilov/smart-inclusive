import { type TestModel } from "@/types/test";
import { type BaseContentItem } from "@/types/content";

// ----------------------------------------------------------------------------
// DATA TYPES
// ----------------------------------------------------------------------------
export interface ParentVideo extends BaseContentItem {
  videoUrl: string;
  duration: string; // e.g. "12:45"
}

export interface ParentArticle extends BaseContentItem {
  content: string; // long copy
  readingTime: string; // e.g. "5 daqiqa"
  category: string;
}

export interface SlideItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

// ----------------------------------------------------------------------------
// 1. TESTS (TestWizard Compatible)
// ----------------------------------------------------------------------------
export const PARENT_TESTS: TestModel[] = [
  {
    id: "parent-test-1",
    title: "Boladagi inklyuzivlikni tushunish testi",
    questions: [
      {
        id: "pq-1",
        type: "text",
        questionText: "Inklyuziv ta'limning asosiy maqsadi nima?",
        options: [
          "Maxsus bolalarni jamiyatdan ajratish",
          "Barcha bolalarga, ularning ehtiyojlaridan qat'i nazar, teng sharoitda ta'lim berish",
          "Faqat iqtidorli bolalarni o'qitish",
          "Bolalarni baholar bo'yicha saralash",
        ],
        correctOptionIndex: 1,
      },
      {
        id: "pq-2",
        type: "text",
        questionText: "Bolada rivojlanishda o'zgarish sezilganda birinchi navbatda kimga murojaat qilish lozim?",
        options: [
          "Qo'shnilar va yaqin do'stlar maslahatiga suyanish",
          "Internetdagi forumlardan ma'lumot qidirish",
          "Mutaxassis shifokor (pediatr, nevrolog) yoki pedagog-psixologga",
          "Bolani o'z holiga qo'yib kutish",
        ],
        correctOptionIndex: 2,
      },
      {
        id: "pq-3",
        type: "text",
        questionText: "Bolaning muloqot qobiliyatini rivojlantirish uchun uyda qanday mashg'ulotlar tavsiya etiladi?",
        options: [
          "Kunning ko'p qismida televizor ko'rishini ta'minlash",
          "Birgalikda kitob o'qish, rasmlarni muhokama qilish va ko'p suhbatlashish",
          "Uni mustaqil xonasida yolg'iz qoldirish",
          "Faqat telefon o'yinlari orqali o'ynatish",
        ],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "parent-test-2",
    title: "Uyda o'qitish metodikasi testi",
    questions: [
      {
        id: "pq-2-1",
        type: "text",
        questionText: "Bolaning kun tartibini qanday tuzish kerak?",
        options: [
          "Rejasiz, bola xohlagan paytda o'ynav, xohlaganda uxlaydi",
          "Moslashuvchan, lekin uyqu, ovqatlanish va dars vaqtlari aniq belgilangan tartibda",
          "Faqat o'qishdan iborat bo'lgan juda qattiq tartibda",
          "Kun tartibi mutlaqo kerak emas",
        ],
        correctOptionIndex: 1,
      },
      {
        id: "pq-2-2",
        type: "text",
        questionText: "O'rganish paytida bolani rag'batlantirishning eng to'g'ri usuli qaysi?",
        options: [
          "Har doim faqat moddiy sovg'alar berish",
          "Harakatini samimiy maqtash, qo'llab-quvvatlash va kichik yutuqlarini qayd etish",
          "Xato qilganda qattiq jazolash",
          "Rag'batlantirmaslik, buni majburiyat deb hisoblash",
        ],
        correctOptionIndex: 1,
      },
    ],
  },
];

// Content list adapters for parent tests
export const PARENT_TESTS_ITEMS: BaseContentItem[] = [
  {
    id: "parent-test-1",
    title: "Boladagi inklyuzivlikni tushunish testi",
    description: "Farzandingizda inklyuziv ta'lim ehtiyojlarini aniqlash va mos yordam choralari haqida so'rovnoma.",
    contentLanguage: "uz",
    date: "2026-07-15",
    type: "parents-tests",
    hasTest: true,
  },
  {
    id: "parent-test-2",
    title: "Uyda o'qitish metodikasi testi",
    description: "Farzandingizni uy sharoitida o'qitish samaradorligi va rag'batlantirish usullari haqida test.",
    contentLanguage: "uz",
    date: "2026-07-20",
    type: "parents-tests",
    hasTest: true,
  },
];

// ----------------------------------------------------------------------------
// 2. VIDEOS
// ----------------------------------------------------------------------------
export const PARENT_VIDEOS: ParentVideo[] = [
  {
    id: "parent-video-1",
    title: "Inklyuziv ta'lim asoslari va tamoyillari",
    description: "Ushbu videodarsda inklyuziv ta'limning jamiyatdagi o'rni va uning asosiy qoidalari haqida so'z boradi.",
    contentLanguage: "uz",
    date: "2026-06-10",
    type: "videos",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "10:24",
  },
  {
    id: "parent-video-2",
    title: "Как адаптировать ребенка с ООП дома",
    description: "Практические советы психолога по адаптации домашнего пространства для развития особых детей.",
    contentLanguage: "ru",
    date: "2026-06-18",
    type: "videos",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    duration: "15:40",
  },
  {
    id: "parent-video-3",
    title: "Inclusive Teaching Strategies for Parents",
    description: "Brief video instruction on establishing home sensory support techniques for fast progress.",
    contentLanguage: "en",
    date: "2026-07-02",
    type: "videos",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "08:12",
  },
];

// ----------------------------------------------------------------------------
// 3. LEGAL ARTICLES (Huquqiy maqolalar)
// ----------------------------------------------------------------------------
export const PARENT_LEGAL_ARTICLES: ParentArticle[] = [
  {
    id: "legal-1",
    title: "Inklyuziv ta'lim to'g'risidagi qonunchilik va kafolatlar",
    description: "O'zbekiston Respublikasida alohida ehtiyojli bolalarni ta'limga jalb qilishning qonuniy asoslari.",
    contentLanguage: "uz",
    date: "2026-05-15",
    type: "lessons",
    hasTest: false,
    category: "Qonunchilik",
    readingTime: "6 daqiqa",
    content: `
O'zbekiston Respublikasida barcha bolalarning sifatli ta'lim olish huquqi qonun bilan kafolatlanadi. Yangi tahrirdagi "Ta'lim to'g'risida"gi Qonunda inklyuziv ta'lim tizimi rasman e'tirof etilgan va alohida ehtiyojli bolalarni davlat maktablarida o'qitish sharoitlarini yaratish belgilangan.

Asosiy kafolatlar:
1. Hududiy maktablarda to'siqsiz muhit yaratilishi.
2. Maxsus pedagoglar va tyutorlar ko'magi.
3. Individual o'quv dasturlarini tuzish huquqi.
4. Bepul darsliklar va moslashtirilgan ta'lim materiallari bilan ta'minlash.

Ota-onalar farzandining inklyuziv sharoitlarda ta'lim olishini talab qilish va maktab ma'muriyati bilan hamkorlikda individual ta'lim rejalarini ko'rib chiqish huquqiga egadirlar.
    `.trim(),
  },
  {
    id: "legal-2",
    title: "Права родителей детей с инвалидностью в школе",
    description: "Правовые основы и права опекунов при выборе формы обучения и получении образования.",
    contentLanguage: "ru",
    date: "2026-05-22",
    type: "lessons",
    hasTest: false,
    category: "Законодательство",
    readingTime: "8 минут",
    content: `
Законодательство гарантирует равный доступ к образованию для всех категорий граждан. Родители имеют право выбирать форму обучения (домашнее, инклюзивное в обычной школе или специализированное в коррекционном классе).

Ключевые аспекты:
1. Запрет на дискриминацию и отказ в приеме в общеобразовательную школу по причине инвалидности.
2. Право на бесплатную консультацию психолого-медико-педагогической комиссии (ПМПК).
3. Обеспечение тьютором и ассистентом при рекомендации комиссии.
4. Разработка индивидуальной адаптированной образовательной программы (АООП).
    `.trim(),
  },
];

// ----------------------------------------------------------------------------
// 4. PLATFORM ARTICLES (Platforma maqolalari)
// ----------------------------------------------------------------------------
export const PARENT_PLATFORM_ARTICLES: ParentArticle[] = [
  {
    id: "article-1",
    title: "Platformamiz orqali bolani rivojlantirish yo'riqnomasi",
    description: "Smart Inclusive platformasining barcha bo'limlaridan unumli foydalanish tartiblari.",
    contentLanguage: "uz",
    date: "2026-07-01",
    type: "lessons",
    hasTest: false,
    category: "Qo'llanma",
    readingTime: "4 daqiqa",
    content: `
Ushbu platforma bolalar, ota-onalar va ko'ngillilar uchun integratsiyalashgan ta'lim muhitini taqdim etadi. Bolalar bo'limidagi darsliklar, lug'atlar, qiziqarli etiket kitoblari va testlar bolaning mustaqil o'rganishi uchun mo'ljallangan.

Samarali foydalanish bosqichlari:
1. **Kundalik 15 daqiqa:** Bolani majburlamagan holda har kuni 15 daqiqa davomida darslarni o'tishga rag'batlantiring.
2. **Lug'at bilan ishlash:** Rasmli lug'at orqali bolaning so'z boyligini vizual vartsa kengaytiring.
3. **Ota-onalar testlari:** O'z bilimlaringizni oshirish uchun ushbu bo'limdagi testlarni topshirib boring.
4. **Ko'ngillilar yordami:** Zarurat tug'ilganda, bolangizga darslarda ko'maklashish uchun platformadan ko'ngilli chaqirishingiz mumkin.
    `.trim(),
  },
];

// ----------------------------------------------------------------------------
// 5. HOME EDUCATION (Uyda ta'lim)
// ----------------------------------------------------------------------------
export const PARENT_HOME_ED_ARTICLES: ParentArticle[] = [
  {
    id: "home-ed-1",
    title: "Sensor o'yinlar orqali uyda o'qitish metodlari",
    description: "Uy sharoitida sensorik ko'nikmalarni rivojlantiruvchi qiziqarli mashg'ulotlar rejasini tuzish.",
    contentLanguage: "uz",
    date: "2026-06-25",
    type: "lessons",
    hasTest: false,
    category: "Metodika",
    readingTime: "5 daqiqa",
    content: `
Sensorli darslar diqqatni jamlash, mayda motorika va hissiy integratsiyani yaxshilashga yordam beradi. Ularni uy sharoitida oddiy narsalardan tayyorlash mumkin.

Sensorli o'yinlar namunalari:
1. **Guruch va makaron qutilari:** Turli donlarni aralashtirib, ichiga mayda o'yinchoqlarni yashirish va boladan ularni topishni so'rash.
2. **Loy va xamir bilan ishlash:** Turli hayvonlar yoki mevalar shaklini yasash.
3. **Musiqiy pauza:** Turli tovushli asboblarni (qo'ng'iroq, qoshiqlar) chalib ritmlarni takrorlash.

Bu kabi darslar bolaning miya faoliyatini rag'batlantiradi va o'qish jarayonini stressiz o'yin shakliga o'tkazadi.
    `.trim(),
  },
];

// ----------------------------------------------------------------------------
// 6. ONBOARDING & PRESENTATION SLIDES
// ----------------------------------------------------------------------------
export const PARENT_ONBOARDING_SLIDES: SlideItem[] = [
  {
    id: "onboard-1",
    title: "Smart Inclusive-ga xush kelibsiz!",
    description: "Ushbu qisqa yo'riqnoma sizga platformadagi imkoniyatlardan maksimal foydalanishga yordam beradi. Bolalar darslari, lug'atlar, ota-onalar uchun testlar va maqolalar barchasi bitta joyda jamlangan.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "onboard-2",
    title: "Bolalar progressini kuzating",
    description: "Farzandingiz o'qigan har bir kitobi, bajargan testi yoki lug'atdagi so'zlari bo'yicha progress avtomatik ravishda saqlanadi. Istalgan vaqtda bolangizning yutuqlarini tekshirib borishingiz mumkin.",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "onboard-3",
    title: "Ko'ngillilar ko'magini oling",
    description: "Agar uyda o'qitish jarayonida yordam kerak bo'lsa, platformaning maxsus bo'limi orqali tajribali inklyuziv ta'lim ko'ngillilarini jalb qilishingiz va hamkorlikda ishlashingiz mumkin.",
    imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=400&auto=format&fit=crop",
  },
];

export const PARENT_PRESENTATION_SLIDES: SlideItem[] = [
  {
    id: "pres-1",
    title: "Smart Inclusive Platformasi taqdimoti",
    description: "Bizning loyihamiz alohida ehtiyojli bolalar, ularning ota-onalari va ko'ngillilarni birlashtiruvchi yagona ekotizimdir. Maqsadimiz - inklyuzivlikni keng yoyish.",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pres-2",
    title: "Zamonaviy visual accessibility",
    description: "Platforma yuqori kontrast, shrift kattalashtirish hamda klaviatura navigatsiyasi, screen reader kabi xususiyatlar bilan to'liq jihozlangan.",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "pres-3",
    title: "Biz bilan birga bo'ling!",
    description: "Loyiha doimiy rivojlanib boradi. Barcha foydalanuvchilar ota-onalarga yordam bo'lishi va bolalar ta'lim olishi uchun platformamizni bepul foydalanishlari kafolatlanadi.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
  },
];

export const ABOUT_PROJECT_SLIDES: SlideItem[] = [
  {
    id: "about-1",
    title: "Loyiha haqida ma'lumot",
    description: "Smart Inclusive - alohida ehtiyojli bolalar uchun ta'lim jarayonini osonlashtirish va inklyuziv yondashuvlarni kengaytirish uchun yaratilgan platformadir.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "about-2",
    title: "Asosiy maqsadlar",
    description: "1. Jamiyatda alohida ehtiyojli bolalarga bo'lgan qarashni o'zgartirish.\n2. Ota-onalar va ko'ngillilar orasidagi hamkorlikni osonlashtirish.\n3. Ovozli lug'at va testlar yordamida interaktiv darslar taqdim etish.",
    imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop",
  },
];
