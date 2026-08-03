/**
 * «Biz haqimizda» sahifasi — STATIK MARKETING MATNI.
 *
 * Bu «mock» emas. Boshqa bo'limlar (kitob, dars, test, lug'at, ko'ngillilar
 * hikoyalari, slaydlar, statistika) API ga o'tkazilgan; bu yerdagi kontent
 * uchun bekendda MOS JADVAL YO'Q, shuning uchun u kodda saqlanadi.
 *
 * DIQQAT: matnlar 3 tilga tarjima qilinmagan (bir tilda qattiq yozilgan).
 * To'g'ri yechim — ularni `messages/*.json` ga ko'chirish yoki bekendga
 * mos jadval qo'shish.
 */

export interface AboutUsBlock {
  id: string
  title: string
  description: string
  imageUrl: string
  align: 'left' | 'right'
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
}

export interface RegionTravel {
  id: string
  title: string
  description: string
  date: string
  imageUrl: string
}

export interface RegionVideo {
  id: string
  title: string
  duration: string
  videoUrl: string
  thumbnailUrl: string
}

export interface ImpactMetric {
  id: string
  value: string
  label: string
}

export interface AboutUsData {
  hero: { title: string; subtitle: string; description: string }
  blocks: AboutUsBlock[]
  results: ImpactMetric[]
  testimonials: Testimonial[]
  travels: RegionTravel[]
  videos: RegionVideo[]
}

export const ABOUT_US: AboutUsData = {
  hero: {
    title: 'Biz haqimizda',
    subtitle: 'Teng imkoniyatlar dunyosini birgalikda yaratamiz.',
    description:
      "Smart Inclusive loyihasi har bir bolaning ta'lim olish va jamiyatda o'z o'rnini topish huquqini ta'minlash maqsadida boshlangan. Biz inklyuziv ta'lim vositalarini ochiq va barcha uchun bepul qilamiz.",
  },
  blocks: [
    {
      id: 'block-1',
      title: 'Bizning Asosiy Maqsadimiz',
      description:
        "Biz alohida ehtiyojli bolalar uchun dars olishni o'yin shakliga o'tkazamiz. Ularning intellektual va sensor ko'nikmalarini oshirib, jamiyatga integratsiyalashuvini osonlashtiramiz. Bu jarayonda zamonaviy vizual moslashuv va mavzu tizimlari yordam beradi.",
      imageUrl:
        'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop',
      align: 'right',
    },
    {
      id: 'block-2',
      title: "Ota-onalarni Qo'llab-quvvatlash",
      description:
        "Pedagog va psixolog maslahatlari, qonuniy huquqlar va uy sharoitida o'qitish bo'yicha amaliy darslarni ota-onalarga bepul yetkazamiz. Ota-onalar farzandlarining ta'limdagi progressini kuzatib boradilar.",
      imageUrl:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      align: 'left',
    },
  ],
  results: [
    { id: 'stat-1', value: '850+', label: "Ro'yxatdan o'tgan oilalar" },
    { id: 'stat-2', value: '24/7', label: 'Bepul foydalanish' },
    { id: 'stat-3', value: '100%', label: 'Inklyuziv moslashuv' },
  ],
  testimonials: [
    {
      id: 'testi-1',
      quote:
        "Smart Inclusive yordamida o'g'lim ilk bor lug'atdagi so'zlarni mustaqil o'rganishni boshladi. Ovoz berish va rasmlar juda do'stona ishlangan.",
      author: 'Zuhra Karimova',
      role: 'Alijonning onasi',
    },
    {
      id: 'testi-2',
      quote:
        "Biz ko'ngilli sifatida maktabga borib dars o'tishimiz uchun bu saytdagi metodik materiallar juda foydali bo'ldi. Hamma narsa sodda va ilmiy asoslangan.",
      author: 'Temur Aliyev',
      role: 'Volontyor, Toshkent',
    },
  ],
  travels: [
    {
      id: 'travel-1',
      title: 'Samarqand viloyati inklyuziv maktablari',
      description:
        "Biz Samarqand shahridagi 3-sonli ixtisoslashtirilgan maktabga tashrif buyurib, bolalarga sensorli o'quv jihozlarini ulashdik va ko'ngillilar bilan uchrashdik.",
      date: '2026-05-18',
      imageUrl:
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'travel-2',
      title: "Farg'ona vodiysi bo'ylab inklyuziv sayohat",
      description:
        "Vodiy viloyatlaridagi uyda ta'lim oladigan bolalarni yo'qladik. Ota-onalar bilan individual dars rejalarini tuzish bo'yicha seminar o'tkazdik.",
      date: '2026-06-22',
      imageUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
    },
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Samarqand tashrifi kundaligi',
      duration: '05:20',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'vid-2',
      title: "Farg'onadagi darslarimiz",
      duration: '08:15',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop',
    },
  ],
}
