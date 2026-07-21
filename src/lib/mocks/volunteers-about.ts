// Types for Volunteers Hub
export interface VolunteerCase {
  id: string;
  title: string;
  volunteerName: string;
  volunteerTitle: string;
  description: string;
  longDescription: string;
  date: string;
  imageUrl: string;
  mediaUrl?: string; // Optional video URL
  mediaType: "image" | "video";
}

export interface VolunteerActivity {
  id: string;
  title: string;
  description: string;
  iconName: "book" | "heart" | "award" | "users";
}

export interface ImpactMetric {
  id: string;
  value: string;
  label: string;
}

export interface VolunteerHubData {
  hero: {
    title: string;
    subtitle: string;
  };
  activities: VolunteerActivity[];
  results: ImpactMetric[];
  cases: VolunteerCase[];
}

// Types for About Us Page
export interface AboutUsAlternatingBlock {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  align: "left" | "right";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatarUrl?: string;
}

export interface RegionTravel {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export interface RegionVideo {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface AboutUsData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  blocks: AboutUsAlternatingBlock[];
  results: ImpactMetric[];
  testimonials: Testimonial[];
  travels: RegionTravel[];
  videos: RegionVideo[];
}

// ----------------------------------------------------------------------------
// VOLUNTEER MOCK DATA
// ----------------------------------------------------------------------------
export const MOCK_VOLUNTEER_HUB: VolunteerHubData = {
  hero: {
    title: "Bizning Ko'ngillilar Jamoasi",
    subtitle: "Alohida ehtiyojli bolalar ta'limi yo'lida ezgu maqsad bilan birlashgan yoshlar va mutaxassislar.",
  },
  activities: [
    {
      id: "act-1",
      title: "Interaktiv darslar o'tish",
      description: "Bolalar bilan maktabda yoki uy sharoitida etiket, matematika, muloqot va ijodiy darslarni o'tkazish.",
      iconName: "book",
    },
    {
      id: "act-2",
      title: "Materiallar tayyorlash",
      description: "Audio kitoblar yozish, vizual kartochkalar yasash va dars ishlanmalarini moslashtirish.",
      iconName: "heart",
    },
    {
      id: "act-3",
      title: "Texnik yordam ko'rsatish",
      description: "Inklyuziv texnologiyalarni o'rnatish, saytdan foydalanishda oilalarga yordam berish.",
      iconName: "users",
    },
    {
      id: "act-4",
      title: "Tadbirlar tashkil etish",
      description: "Bolalar uchun bayramlar, sport tadbirlari va integratsiyalashgan ekskursiyalar uyushtirish.",
      iconName: "award",
    },
  ],
  results: [
    { id: "res-1", value: "70+", label: "Faol ko'ngillilar" },
    { id: "res-2", value: "1,500+", label: "O'tilgan dars soatlari" },
    { id: "res-3", value: "350+", label: "Yordam olgan bolalar" },
    { id: "res-4", value: "12+", label: "Qamrab olingan hududlar" },
  ],
  cases: [
    {
      id: "case-1",
      title: "Alijon bilan ilk muvaffaqiyatimiz",
      volunteerName: "Madina Axmedova",
      volunteerTitle: "Pedagogika yo'nalishi talabasi",
      description: "Alijon darslarimizning dastlabki kunlarida juda tortinchoq edi, biroq sensor xamir o'yinlari orqali u muloqotga kirishdi.",
      longDescription: `
Madina Axmedova Alijon bilan 3 oy davomida haftasiga 2 marta sensorika va nutq darslarini olib bordi. Dastlabki darslarda bola ko'z aloqasini o'rnatishga qiynalgan bo'lsa, keyinchalik loydan haykalchalar yasash va rasmli lug'at orqali u so'z boyligini 40 taga ko'paytirdi.

"Bolaning yuzidagi tabassum va ota-onasining minnatdorchiligi har qanday moddiy mukofotdan ustun. Smart Inclusive platformasidagi o'quv materiallari va dars rejalaridan foydalanib Alijon bilan juda tez til topishdik," — deydi Madina.
      `.trim(),
      date: "2026-06-12",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      id: "case-2",
      title: "Audio darsliklar loyihasi muvaffaqiyati",
      volunteerName: "Doston Qodirov",
      volunteerTitle: "Audio-injener & Volontyor",
      description: "Ko'rish qobiliyati cheklangan bolalar uchun etiket kitoblarini audio formatga o'tkazish tajribasi haqida.",
      longDescription: `
Doston Qodirov Smart Inclusive jamoasiga ko'ngilli diktor sifatida qo'shildi. U 5 ta etiket va odob-axloq mavzusidagi interaktiv bolalar kitobini professional studiyada o'zbek, rus va ingliz tillarida ovozlashtirib chiqdi.

Loyiha natijasida 100 dan ortiq ko'zi ojiz va ko'rish qobiliyati zaif bolalar odob-axloq qoidalarini mustaqil ravishda eshitib o'rganish imkoniyatiga ega bo'ldi. Doston darslarni yozish jarayonida bolalar hissiyotiga mos intonatsiya tanlash ustida ishladi.
      `.trim(),
      date: "2026-07-05",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      mediaType: "video",
    },
  ],
};

// ----------------------------------------------------------------------------
// ABOUT US MOCK DATA
// ----------------------------------------------------------------------------
export const MOCK_ABOUT_US: AboutUsData = {
  hero: {
    title: "Biz haqimizda",
    subtitle: "Teng imkoniyatlar dunyosini birgalikda yaratamiz.",
    description: "Smart Inclusive loyihasi har bir bolaning ta'lim olish va jamiyatda o'z o'rnini topish huquqini ta'minlash maqsadida boshlangan. Biz inklyuziv ta'lim vositalarini ochiq va barcha uchun bepul qilamiz.",
  },
  blocks: [
    {
      id: "block-1",
      title: "Bizning Asosiy Maqsadimiz",
      description: "Biz alohida ehtiyojli bolalar uchun dars olishni o'yin shakliga o'tkazamiz. Ularning intellektual va sensor ko'nikmalarini oshirib, jamiyatga integratsiyalashuvini osonlashtiramiz. Bu jarayonda zamonaviy vizual accessibility va theme tizimlari yordam beradi.",
      imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
      align: "right",
    },
    {
      id: "block-2",
      title: "Ota-onalarni Qo'llab-quvvatlash",
      description: "Pedagog va psixolog maslahatlari, qonuniy huquqlar va uy sharoitida o'qitish bo'yicha amaliy darslarni ota-onalarga bepul yetkazamiz. Ota-onalar farzandlarining ta'limdagi progressini kuzatib boradilar.",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
      align: "left",
    },
  ],
  results: [
    { id: "stat-1", value: "850+", label: "Ro'yxatdan o'tgan oilalar" },
    { id: "stat-2", value: "24/7", label: "Bepul foydalanish" },
    { id: "stat-3", value: "100%", label: "Inklyuziv moslashuv" },
  ],
  testimonials: [
    {
      id: "testi-1",
      quote: "Smart Inclusive yordamida o'g'lim ilk bor lug'atdagi so'zlarni mustaqil o'rganishni boshladi. Ovoz berish va rasmlar juda do'stona ishlangan.",
      author: "Zuhra Karimova",
      role: "Alijonning onasi",
    },
    {
      id: "testi-2",
      quote: "Biz ko'ngilli sifatida maktabga borib dars o'tishimiz uchun bu saytdagi metodik materiallar juda foydali bo'ldi. Hamma narsa sodda va ilmiy asoslangan.",
      author: "Temur Aliyev",
      role: "Volontyor, Toshkent",
    },
  ],
  travels: [
    {
      id: "travel-1",
      title: "Samarqand viloyati inklyuziv maktablari",
      description: "Biz Samarqand shahridagi 3-sonli ixtisoslashtirilgan maktabga tashrif buyurib, bolalarga sensorli o'quv jihozlarini ulashdik va ko'ngillilar bilan uchrashdik.",
      date: "2026-05-18",
      imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "travel-2",
      title: "Farg'ona vodiysi bo'ylab inklyuziv sayohat",
      description: "Vodiy viloyatlaridagi uyda ta'lim oladigan bolalarni yo'qladik. Ota-onalar bilan individual dars rejalarini tuzish bo'yicha seminar o'tkazdik.",
      date: "2026-06-22",
      imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop",
    },
  ],
  videos: [
    {
      id: "vid-1",
      title: "Samarqand tashrifi kundaligi",
      duration: "05:20",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "vid-2",
      title: "Farg'onadagi darslarimiz",
      duration: "08:15",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop",
    },
  ],
};
