import { type BaseContentItem } from "@/types/content";
import { type TestModel } from "@/types/test";
import { type ReaderPage } from "@/components/ui/PagedReader";

/**
 * Bolalar bo'limi uchun mock kontent.
 *
 * DIQQAT: bekend hali ulanmagan — bu ma'lumotlar vaqtinchalik. Har bir bo'lim
 * (etiket, "men qila olaman", darslar, kitoblar, testlar) shu yerdan oziqlanadi.
 * Bekend tayyor bo'lganda faqat shu fayl API chaqiruvlariga almashtiriladi.
 */

// ----------------------------------------------------------------------------
// Umumiy tiplar
// ----------------------------------------------------------------------------

/** Video kontent birligi (Men hammasini qila olaman!, Darslar). */
export interface KidsVideo extends BaseContentItem {
  videoUrl: string;
  duration: string;
}

/** Reader kontent birligi (Etiket komikslari, Kitoblar). */
export interface KidsReadable extends BaseContentItem {
  pages: ReaderPage[];
  audioUrls?: { uz?: string; ru?: string; en?: string };
  /** Bog'langan test ID (oxirgi sahifada "Testga o'tish" chiqadi). */
  testId?: string;
}

// Namuna audio — 3 tildan faqat UZ mavjud, RU/EN nofaol ko'rinadi.
// (TZ 11: audio bo'lmagan til pereklyuchatelda disabled bo'ladi.)
const SAMPLE_AUDIO = { uz: "https://www.w3schools.com/html/horse.mp3" };

// ----------------------------------------------------------------------------
// 1. ETIKET — komikslar (reader)
// ----------------------------------------------------------------------------
export const ETIQUETTE_COMICS: KidsReadable[] = [
  {
    id: "etq-salom",
    title: "Salomlashish odobi",
    description: "Do'stlar va kattalar bilan qanday chiroyli salomlashish kerakligi haqida qiziqarli komiks.",
    type: "etiquette",
    contentLanguage: "uz",
    date: "2026-07-10",
    hasTest: true,
    testId: "etq-test-salom",
    audioUrls: SAMPLE_AUDIO,
    pages: [
      {
        title: "Yangi kun boshlandi",
        content:
          "Aziz har kuni bog'chaga borishni yaxshi ko'radi. Bugun u eshik oldida tarbiyachi Nodira opani ko'rdi.",
        imageUrl:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "Chiroyli salom",
        content:
          "Aziz kulib turib: «Assalomu alaykum, Nodira opa!» — dedi. Nodira opa ham unga mehr bilan javob berdi.",
        imageUrl:
          "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "Do'stlar bilan",
        content:
          "Keyin Aziz do'stlari bilan qo'l berib ko'rishdi. Salomlashish — bu bir-birimizga hurmat ko'rsatishdir.",
        imageUrl:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "etq-rahmat",
    title: "«Rahmat» so'zining kuchi",
    description: "Yordam olganda minnatdorchilik bildirishni o'rgatuvchi mehribon hikoya.",
    type: "etiquette",
    contentLanguage: "uz",
    date: "2026-07-05",
    hasTest: false,
    audioUrls: SAMPLE_AUDIO,
    pages: [
      {
        title: "Kichkina yordam",
        content:
          "Malika o'yinchog'ini yerga tushirib yubordi. Uni do'sti Sardor olib berdi.",
        imageUrl:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "Sehrli so'z",
        content:
          "Malika iljayib: «Rahmat, Sardor!» — dedi. Sardorning ham kayfiyati ko'tarildi. «Rahmat» — bu sehrli so'z!",
        imageUrl:
          "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// 2. ETIKET — vaziyatli testlar (mustaqil)
// ----------------------------------------------------------------------------
export const ETIQUETTE_TESTS: TestModel[] = [
  {
    id: "etq-test-salom",
    title: "Salomlashish odobi testi",
    questions: [
      {
        id: "ets-1",
        type: "text",
        questionText: "Ertalab bog'chada tarbiyachini ko'rganingizda nima deysiz?",
        options: ["Hech narsa demayman", "Assalomu alaykum!", "Ketaman", "Baqiraman"],
        correctOptionIndex: 1,
      },
      {
        id: "ets-2",
        type: "text",
        questionText: "Do'sting senga o'yinchoq berdi. Nima deysan?",
        options: ["Rahmat!", "Ber yana!", "Xohlamayman", "Hech narsa"],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: "etq-test-dasturxon",
    title: "Dasturxon odobi testi",
    questions: [
      {
        id: "etd-1",
        type: "text",
        questionText: "Ovqatdan oldin nima qilish kerak?",
        options: ["Qo'lni yuvish", "Televizor ko'rish", "Yugurish", "Baqirish"],
        correctOptionIndex: 0,
      },
    ],
  },
];

/** Etiket testlarining ro'yxat adapterlari. */
export const ETIQUETTE_TEST_ITEMS: BaseContentItem[] = [
  {
    id: "etq-test-salom",
    title: "Salomlashish odobi testi",
    description: "Salomlashish qoidalarini qanchalik yaxshi bilishingizni tekshiring.",
    type: "tests",
    contentLanguage: "uz",
    date: "2026-07-10",
    hasTest: true,
  },
  {
    id: "etq-test-dasturxon",
    title: "Dasturxon odobi testi",
    description: "Ovqatlanish madaniyati bo'yicha kichik test.",
    type: "tests",
    contentLanguage: "uz",
    date: "2026-07-02",
    hasTest: true,
  },
];

// ----------------------------------------------------------------------------
// 3. MEN HAMMASINI QILA OLAMAN! — videolar
// ----------------------------------------------------------------------------
export const I_CAN_VIDEOS: KidsVideo[] = [
  {
    id: "ican-tish",
    title: "Tishlarni to'g'ri tozalash",
    description: "Har kuni ertalab va kechqurun tishlarni qanday tozalashni birga o'rganamiz.",
    type: "i-can",
    contentLanguage: "uz",
    date: "2026-07-12",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "03:20",
  },
  {
    id: "ican-tugma",
    title: "Ko'ylak tugmalarini qadash",
    description: "Kiyimni mustaqil kiyish — katta yutuq! Keling, tugma qadashni mashq qilamiz.",
    type: "i-can",
    contentLanguage: "uz",
    date: "2026-07-08",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    duration: "04:10",
  },
];

// ----------------------------------------------------------------------------
// 4. DARSLAR — videodarslar
// ----------------------------------------------------------------------------
export const LESSON_VIDEOS: KidsVideo[] = [
  {
    id: "lesson-ranglar",
    title: "Ranglar bilan tanishuv",
    description: "Asosiy ranglarni qiziqarli misollar orqali o'rganamiz.",
    type: "lessons",
    contentLanguage: "uz",
    date: "2026-07-14",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "05:30",
  },
  {
    id: "lesson-sanoq",
    title: "1 dan 10 gacha sanash",
    description: "Barmoqlar yordamida birga sanashni mashq qilamiz.",
    type: "lessons",
    contentLanguage: "uz",
    date: "2026-07-06",
    hasTest: false,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    duration: "06:15",
  },
];

// ----------------------------------------------------------------------------
// 5. KITOBLAR — reader
// ----------------------------------------------------------------------------
export const BOOKS: KidsReadable[] = [
  {
    id: "book-zumrad",
    title: "Zumrad va Qimmat",
    description: "Mehnatsevarlik va halollik haqidagi mashhur o'zbek xalq ertagi.",
    type: "books",
    contentLanguage: "uz",
    date: "2026-06-28",
    hasTest: true,
    testId: "book-test-zumrad",
    pageCount: 3,
    audioUrls: SAMPLE_AUDIO,
    pages: [
      {
        title: "Zumrad",
        content:
          "Bir bor ekan, bir yo'q ekan. O'tgan zamonda Zumrad degan mehribon va mehnatsevar qiz bo'lgan ekan.",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "O'rmonda",
        content:
          "Zumrad o'rmonda adashib qoldi. U kampirga duch keldi va unga ochiq ko'ngil bilan yordam berdi.",
        imageUrl:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "Mukofot",
        content:
          "Yaxshiligi uchun Zumrad sandiqcha to'la sovg'a oldi. Halollik va mehnat har doim mukofotlanadi.",
        imageUrl:
          "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "book-bulbul",
    title: "Bulbulning qo'shig'i",
    description: "Tabiatni sevish va do'stlik haqidagi she'riy hikoya.",
    type: "books",
    contentLanguage: "uz",
    date: "2026-06-15",
    hasTest: false,
    pageCount: 2,
    audioUrls: SAMPLE_AUDIO,
    pages: [
      {
        title: "Bog'dagi bulbul",
        content:
          "Katta bog'da mayin ovozli bulbul yashardi. Uning qo'shig'ini eshitish uchun hamma yig'ilardi.",
        imageUrl:
          "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=600&auto=format&fit=crop",
      },
      {
        title: "Baxtli bog'",
        content:
          "Bulbul kuylagach, gullar ochildi, bolalar quvondi. Go'zallik — birgalikda ulashilganda ko'payadi.",
        imageUrl:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// 6. MUSTAQIL TESTLAR (/tests) — hech narsaga bog'lanmagan + bog'langan testlar
// ----------------------------------------------------------------------------
export const KIDS_TESTS: TestModel[] = [
  ...ETIQUETTE_TESTS,
  {
    id: "book-test-zumrad",
    title: "«Zumrad va Qimmat» ertagi testi",
    questions: [
      {
        id: "bz-1",
        type: "text",
        questionText: "Zumrad qanday qiz edi?",
        options: ["Dangasa", "Mehnatsevar va mehribon", "Yolg'onchi", "Xasis"],
        correctOptionIndex: 1,
      },
      {
        id: "bz-2",
        type: "text",
        questionText: "Zumrad nima uchun mukofotlandi?",
        options: ["Yaxshiligi va halolligi uchun", "Baqirgani uchun", "Yugurgani uchun", "Uxlagani uchun"],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: "quiz-tabiat",
    title: "Tabiat va hayvonlar bo'yicha bilimlar bellashuvi",
    questions: [
      {
        id: "qt-1",
        type: "text",
        questionText: "Qaysi hayvon «miyov» deydi?",
        options: ["It", "Mushuk", "Sigir", "Qo'y"],
        correctOptionIndex: 1,
      },
      {
        id: "qt-2",
        type: "text",
        questionText: "Osmonda nima uchadi?",
        options: ["Baliq", "Qush", "Toshbaqa", "Ilon"],
        correctOptionIndex: 1,
      },
      {
        id: "qt-3",
        type: "text",
        questionText: "Yozda havo qanday bo'ladi?",
        options: ["Sovuq", "Issiq", "Qorli", "Muzli"],
        correctOptionIndex: 1,
      },
    ],
  },
];

/** Mustaqil testlar ro'yxati (/tests) uchun adapterlar. */
export const KIDS_TEST_ITEMS: BaseContentItem[] = [
  {
    id: "quiz-tabiat",
    title: "Tabiat va hayvonlar bo'yicha bilimlar bellashuvi",
    description: "3 ta qiziqarli savol orqali tabiat haqidagi bilimlaringizni sinang.",
    type: "tests",
    contentLanguage: "uz",
    date: "2026-07-18",
    hasTest: true,
    difficulty: "easy",
  },
  {
    id: "etq-test-salom",
    title: "Salomlashish odobi testi",
    description: "Salomlashish qoidalarini qanchalik yaxshi bilishingizni tekshiring.",
    type: "tests",
    contentLanguage: "uz",
    date: "2026-07-10",
    hasTest: true,
    difficulty: "easy",
  },
];

// ----------------------------------------------------------------------------
// Qidiruv yordamchilari (barcha testlar bir joyda)
// ----------------------------------------------------------------------------
export const ALL_KIDS_TESTS: TestModel[] = KIDS_TESTS;

export function findKidsTest(id: string): TestModel | undefined {
  return ALL_KIDS_TESTS.find((t) => t.id === id);
}
