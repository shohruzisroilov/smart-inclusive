"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Select, Checkbox, Radio } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { useProgressStore } from "@/stores/progress-store";
import { PagedReader, type ReaderPage } from "@/components/ui/PagedReader";
import { TestWizard } from "@/components/wizards/TestWizard";
import { type TestModel } from "@/types/test";

const MOCK_TEST: TestModel = {
  id: "test-odob-1",
  title: "Muloqot Odoblari Testi",
  questions: [
    {
      id: "q-1",
      type: "text",
      questionText: "Kishi bilan ko'rishganda nima deb salom berish kerak?",
      options: [
        "Xayrli tun!",
        "Assalomu alaykum",
        "Eshikni yop",
        "Rahmat",
      ],
      correctOptionIndex: 1,
    },
    {
      id: "q-2",
      type: "image",
      questionText: "Eshikni taqillatishda nechchi marta taqillatgan ma'qul?",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop",
      options: [
        "1 marta va juda qattiq",
        "10 marta to'xtamay",
        "Asta 3 marta",
        "Ruxsatsiz kirib ketaverish kerak",
      ],
      correctOptionIndex: 2,
    },
    {
      id: "q-3",
      type: "text",
      questionText: "Boshqalar gapirayotganda tinglash odobi qanday bo'lishi kerak?",
      options: [
        "Ular gapini bo'lib, o'zimiznikini aytamiz",
        "Quloq solmay o'ynab o'tiramiz",
        "So'zini bo'lmay, diqqat bilan tinglaymiz",
        "Xonadan chiqib ketamiz",
      ],
      correctOptionIndex: 2,
    },
  ],
};

const MOCK_BOOK_PAGES: ReaderPage[] = [
  {
    title: "Muloqot odobiga kirish",
    content: "Assalomu alaykum, aziz bolajonlar! Bugun biz boshqalar bilan to'g'ri muloqot qilish, salomlashish va eshik taqillatish odoblarini o'rganamiz.\n\nBirinchi sahifada biz salomlashishning ahamiyati haqida gaplashamiz. Har doim kishi bilan uchrashganda tabassum bilan salom bering.",
    illustration: () => (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto text-brand" fill="currentColor">
        <circle cx="50" cy="40" r="20" fill="currentColor" opacity="0.8" />
        <path d="M20 90 Q50 60 80 90" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Eshik taqillatish qoidasi",
    content: "Mehmonga borganda yoki birovning xonasiga kirayotganda eshikni asta uch marta taqillating.\n\nEshik orqasida turganda uy egasining ruxsatini kuting. Eshik ochilmaguncha ichkariga ruxsatsiz mo'ralamang.",
    illustration: () => (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto text-accent" fill="currentColor">
        <rect x="30" y="10" width="40" height="80" rx="4" fill="currentColor" opacity="0.8" />
        <circle cx="60" cy="50" r="5" fill="var(--surface)" />
      </svg>
    ),
  },
  {
    title: "Tinglash madaniyati",
    content: "Boshqalar gapirayotganda ularning so'zini bo'lmang. Diqqat bilan tinglang va gapini tugatgandan so'ng javob bering.\n\nTabassum qilish va gaplashayotgan insonning ko'zlariga qarab turish suhbatdoshga nisbatan hurmatni bildiradi.",
    illustration: () => (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto text-status-success" fill="currentColor">
        <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.8" />
        <path d="M40 50 Q50 60 60 50" fill="none" stroke="var(--surface)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Xulosa va Sinov",
    content: "Mana, biz muloqot odobi darsligimizni tugatdik! Ushbu bilimlar hayotingizda do'st orttirishga va kattalar hurmatini qozonishga yordam beradi.\n\nEndi esa bilimlaringizni tekshirish uchun maxsus testni topshirishingiz mumkin. Quyidagi test tugmasini bosing!",
    illustration: () => (
      <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto text-status-info" fill="currentColor">
        <path d="M50 10 L80 35 L50 60 L20 35 Z" fill="currentColor" />
        <rect x="45" y="55" width="10" height="30" fill="currentColor" opacity="0.8" />
      </svg>
    ),
  },
];

const MOCK_AUDIO_URLS = {
  uz: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  en: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  // ru is left empty to test disabled state
};

const MOCK_CONTENT_ITEMS: BaseContentItem[] = [
  {
    id: "item-etiket-1",
    type: "etiquette",
    title: "Muloqot odobi",
    description: "Insonlar bilan doʼstona va hurmat bilan suhbatlashish qoidalari.",
    date: "2026-07-15",
    contentLanguage: "uz",
    hasTest: true,
    coverUrl: "from-brand/10 to-brand/35 text-brand",
  },
  {
    id: "item-lesson-2",
    type: "lessons",
    title: "Ranglar dunyosi",
    description: "Bolajonlar uchun asosiy ranglarni va shakllarni oʼrganish darsi.",
    date: "2026-07-18",
    contentLanguage: "ru",
    hasTest: false,
    duration: "10:15",
    coverUrl: "from-accent/10 to-accent/35 text-accent",
  },
  {
    id: "item-book-3",
    type: "books",
    title: "Zumrad va Qimmat",
    description: "Oʼzbek xalq ertaklari turkumidan chiroyli rasmli ertak kitobi.",
    date: "2026-07-20",
    contentLanguage: "uz",
    hasTest: true,
    pageCount: 24,
    coverUrl: "from-status-info/10 to-status-info/35 text-status-info",
  },
  {
    id: "item-video-4",
    type: "videos",
    title: "Uy sharoitida gimnastika",
    description: "Imkoniyati cheklangan bolalar uchun jismoniy mashqlar toʼplami.",
    date: "2026-07-10",
    contentLanguage: "en",
    hasTest: false,
    duration: "15:45",
    coverUrl: "from-status-success/10 to-status-success/35 text-status-success",
  },
  {
    id: "item-test-5",
    type: "tests",
    title: "Etiket boʼyicha sinov",
    description: "Muloqot qoidalari yuzasidan bolalar uchun qiziqarli test savollari.",
    date: "2026-07-21",
    contentLanguage: "uz",
    hasTest: true,
    difficulty: "easy",
    coverUrl: "from-status-warning/10 to-status-warning/35 text-status-warning",
  }
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [radioVal, setRadioVal] = useState("option1");
  const [textInputVal, setTextInputVal] = useState("");
  const [textInputError, setTextInputError] = useState("");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState(false);
  const [demoEmpty, setDemoEmpty] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const toggleComplete = useProgressStore((s) => s.toggleComplete);
  const resetAllProgress = useProgressStore((s) => s.resetProgress);

  const handleCardAction = (item: BaseContentItem) => {
    toggleComplete(item.id);
  };

  const triggerOverlayLoader = () => {
    setShowOverlayLoader(true);
    setTimeout(() => setShowOverlayLoader(false), 2000);
  };

  const handleTestInputSubmit = () => {
    if (!textInputVal) {
      setTextInputError("Iltimos, ushbu maydonni toʼldiring!");
    } else {
      setTextInputError("");
      alert(`Kiritilgan qiymat: ${textInputVal}`);
    }
  };

  return (
    <Container className="py-12 max-phone:py-6 space-y-16">
      {/* Page Title */}
      <section className="border-b border-border pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg laptop:text-5xl font-display">
          Smart Inclusive Dizayn Tizimi
        </h1>
        <p className="mt-3 text-lg text-fg-muted max-w-2xl leading-relaxed">
          Bolalar va ota-onalar taʼlim platformasi uchun maxsus tayyorlangan, a11y (accessibility) talablariga toʼliq javob beruvchi modulli interfeys elementlari toʼplami.
        </p>
      </section>

      {/* 1. Color Tokens */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          1. Ranglar (Color Tokens)
        </h2>
        <p className="text-sm text-fg-muted max-w-2xl">
          Tizimdagi barcha ranglar CSS oʼzgaruvchilari orqali boshqariladi va rang koʼrligi rejimiga mos ravishda dinamik ravishda moslashadi.
        </p>
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-surface flex flex-col justify-between h-28 shadow-sm">
            <span className="font-semibold text-fg text-sm">Surface (Sirt)</span>
            <code className="text-xs text-fg-muted font-mono">var(--surface)</code>
          </div>
          <div className="p-4 rounded-xl border border-border bg-brand text-fg-on-brand flex flex-col justify-between h-28 shadow-sm">
            <span className="font-semibold text-sm">Brand (Teal)</span>
            <code className="text-xs opacity-80 font-mono">var(--brand)</code>
          </div>
          <div className="p-4 rounded-xl border border-border bg-accent text-fg-on-brand flex flex-col justify-between h-28 shadow-sm">
            <span className="font-semibold text-sm">Accent (Amber)</span>
            <code className="text-xs opacity-80 font-mono">var(--accent)</code>
          </div>
          <div className="p-4 rounded-xl border border-border bg-status-success text-fg-inverse flex flex-col justify-between h-28 shadow-sm">
            <span className="font-semibold text-sm">Success (A11y Safe)</span>
            <code className="text-xs opacity-80 font-mono">var(--status-success)</code>
          </div>
        </div>
      </section>

      {/* 2 & 3. Typography & Spacing */}
      <section className="grid laptop:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            2. Tipografiya (Typography)
          </h2>
          <div className="space-y-3 p-6 rounded-xl border border-border bg-surface shadow-sm">
            <div>
              <span className="text-xs text-fg-subtle uppercase block mb-1">Display Title (Outfit)</span>
              <h3 className="text-3xl font-bold text-fg font-display">Salom, bolajonlar!</h3>
            </div>
            <hr className="border-border/50" />
            <div>
              <span className="text-xs text-fg-subtle uppercase block mb-1">Body Text (Inter)</span>
              <p className="text-base text-fg-muted leading-relaxed">
                Smart Inclusive platformasi orqali siz turli darslar, qiziqarli kitoblar va sinov testlarini topishingiz mumkin.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            3 & 4. Spacing & Border Radius
          </h2>
          <div className="space-y-4 p-6 rounded-xl border border-border bg-surface shadow-sm">
            <div className="space-y-2">
              <span className="text-xs text-fg-subtle uppercase block">Bosish maydonlari (Min Tap Targets):</span>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-surface-muted border border-border rounded-md text-xs font-semibold flex items-center min-h-[44px]">
                  Kattalar: min-44px
                </span>
                <span className="px-4 py-2 bg-surface-muted border border-border rounded-xl text-sm font-semibold flex items-center min-h-[52px]">
                  Bolalar: min-52px
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-fg-subtle uppercase block">Radius turlari (Radii):</span>
              <div className="flex gap-2 text-center text-xs text-fg font-semibold">
                <div className="w-12 h-12 rounded-sm border border-border bg-surface-subtle flex items-center justify-center">SM</div>
                <div className="w-12 h-12 rounded-md border border-border bg-surface-subtle flex items-center justify-center">MD</div>
                <div className="w-12 h-12 rounded-lg border border-border bg-surface-subtle flex items-center justify-center">LG</div>
                <div className="w-12 h-12 rounded-xl border border-border bg-surface-subtle flex items-center justify-center">XL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Buttons & Badges */}
      <section className="grid laptop:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            5. Tugmalar (Buttons)
          </h2>
          <div className="flex flex-wrap gap-3 p-6 rounded-xl border border-border bg-surface shadow-sm">
            <Button variant="primary" size="md">Asosiy</Button>
            <Button variant="secondary" size="md">Ikkinchi darajali</Button>
            <Button variant="accent" size="md">Bolalar boʼlimi</Button>
            <Button variant="ghost" size="sm">Faqat matn</Button>
            <Button variant="primary" size="kids">Katta Tugma (60px)</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            6. Nishonlar (Badges)
          </h2>
          <div className="flex flex-wrap gap-2.5 p-6 rounded-xl border border-border bg-surface shadow-sm items-center">
            <Badge variant="brand">Teal</Badge>
            <Badge variant="accent">Bolalar</Badge>
            <Badge variant="success">Bajarildi</Badge>
            <Badge variant="danger">Xato</Badge>
            <Badge variant="warning">Kutilmoqda</Badge>
            <Badge variant="info">Darslik</Badge>
            <Badge variant="neutral">Statik</Badge>
          </div>
        </div>
      </section>

      {/* 7. Card System */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          7. Kartochkalar (Cards)
        </h2>
        <div className="grid tablet:grid-cols-3 gap-6">
          {/* Card 1: Default */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-fg font-display">Standart Kartochka</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Bu dars yoki kitob tafsilotlarini koʼrsatish uchun ishlatiladigan standart vizual blok.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="info">Maʼlumot</Badge>
            </CardFooter>
          </Card>

          {/* Card 2: Interactive */}
          <Card
            variant="interactive"
            onClick={() => alert("Karta bosildi!")}
          >
            <CardHeader>
              <h3 className="text-lg font-bold text-fg font-display">Bosiladigan Karta</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Ushbu karta sichqoncha bilan koʼrsatilganda koʼtariladi va klaviaturada fokuslanadi.
              </p>
            </CardContent>
            <CardFooter>
              <span className="text-xs font-semibold text-brand">Batafsil →</span>
            </CardFooter>
          </Card>

          {/* Card 3: Subtle */}
          <Card variant="subtle">
            <CardHeader>
              <h3 className="text-lg font-bold text-fg font-display">Sodda Karta</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Orqa foni rangli boʼlgan, chegarasi yoʼq sodda kartochka varianti.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="accent">Iliq rang</Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 8 & 9. Input & Interactive fields */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          8. Forma elementlari (Inputs)
        </h2>
        <div className="grid laptop:grid-cols-2 gap-8 p-6 rounded-2xl border border-border bg-surface shadow-sm">
          {/* Default Forms */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-fg border-b border-border/50 pb-2">Kattalar uchun formalar</h3>
            <Input
              label="Foydalanuvchi ismi"
              placeholder="Ismingizni kiriting..."
              value={textInputVal}
              error={textInputError}
              onChange={(e) => setTextInputVal(e.target.value)}
              required
            />
            <div className="flex gap-4">
              <Button size="sm" onClick={handleTestInputSubmit}>Yuborish</Button>
              {textInputError && <Button size="sm" variant="secondary" onClick={() => setTextInputError("")}>Tozalash</Button>}
            </div>
            
            <Select
              label="Taʼlim tili"
              options={[
                { value: "uz", label: "Oʼzbekcha" },
                { value: "ru", label: "Русский" },
                { value: "en", label: "English" },
              ]}
            />
          </div>

          {/* Interactive controls and kids forms */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-fg border-b border-border/50 pb-2">Bolalar uchun va a11y maydonlar</h3>
            
            {/* Kids large input */}
            <Input
              label="Bolalar uchun katta input"
              variant="kids"
              placeholder="Matn kiriting..."
            />

            <div className="space-y-2">
              <span className="block text-sm font-semibold text-fg-muted">Tanlovlar</span>
              <Checkbox checked={checkboxVal} onChange={(e) => setCheckboxVal(e.target.checked)}>
                Shartlarga roziman (Checkbox)
              </Checkbox>

              <div className="flex flex-col gap-1 mt-2">
                <Radio
                  name="demo-radio"
                  value="option1"
                  checked={radioVal === "option1"}
                  onChange={() => setRadioVal("option1")}
                >
                  Birinchi tanlov (Radio)
                </Radio>
                <Radio
                  name="demo-radio"
                  value="option2"
                  checked={radioVal === "option2"}
                  onChange={() => setRadioVal("option2")}
                >
                  Ikkinchi tanlov (Radio)
                </Radio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 & 11. Modal & Tooltip */}
      <section className="grid laptop:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            9. Modal Oyna (Modal Dialog)
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface shadow-sm space-y-4">
            <p className="text-sm text-fg-muted">
              Klaviaturada &quot;Tab&quot; bosilganda fokus oyna ichida qoladi, &quot;Escape&quot; bosilganda oyna yopiladi va fokus ochgan tugmaga qaytariladi.
            </p>
            <Button onClick={() => setModalOpen(true)}>Modalni ochish</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="A11y Xavfsiz Modal"
            >
              <div className="space-y-4 text-left">
                <p>
                  Ushbu dialog darchasi React Portals orqali render qilingan. Unda sahifaning boshqa joyiga fokus chiqib ketmaydi.
                </p>
                <Input label="Modal ichidagi input" placeholder="Ism..." />
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Yopish</Button>
                  <Button size="sm" onClick={() => alert("Saqlandi!")}>Saqlash</Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            10. Izohlar (Tooltip)
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface shadow-sm space-y-6">
            <p className="text-sm text-fg-muted">
              Tooltip faqat sichqonchada emas, klaviatura yordamida &quot;Tab&quot; orqali fokuslaganda ham ochiladi.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Tooltip content="Ushbu tugma platforma sozlamalarini asliga qaytaradi." position="top">
                <Button variant="secondary" size="sm">Tepada Tooltip</Button>
              </Tooltip>
              <Tooltip content="Darslar boʼlimiga oʼtish." position="bottom">
                <Button variant="secondary" size="sm">Pastda Tooltip</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* 12 & 15. Skeleton & Loader */}
      <section className="grid laptop:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            11. Yuklanish animatsiyasi (Skeleton)
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface shadow-sm space-y-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-12 h-12" circle />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-3/4 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-24" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
            12. Pleyer/Spinners (Loading States)
          </h2>
          <div className="p-6 rounded-xl border border-border bg-surface shadow-sm space-y-4 flex flex-col justify-between">
            <p className="text-sm text-fg-muted">
              Aria live announcements orqali yuklanayotgani koʼzi ojizlar uchun ham aytiladi.
            </p>
            <div className="flex items-center gap-6">
              <LoadingState size="sm" text="" className="p-0" />
              <LoadingState size="md" text="Yuklanmoqda..." className="p-0" />
            </div>
            <Button variant="secondary" size="sm" onClick={triggerOverlayLoader}>
              Ekranni toʼsuvchi loader (2s)
            </Button>
            {showOverlayLoader && <LoadingState overlay text="Maʼlumot yuklanmoqda..." />}
          </div>
        </div>
      </section>

      {/* 13. Empty State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          13. Boʼsh holat (Empty State)
        </h2>
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <EmptyState
            title="Sizda hech qanday dars topilmadi"
            description="Loyihadagi darslar hali boshlanmagan yoki siz tanlagan tilda darsliklar tayyor emas. Darslarni oʼtish uchun quyidagi tugmani bosing."
            action={<Button>Darslarni boshlash</Button>}
          />
        </div>
      </section>

      {/* 14. Error State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          14. Xatolik holati (Error State)
        </h2>
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <ErrorState
            title="Ulanishda muammo yuz berdi"
            description="Internet aloqangizni tekshiring yoki sahifani qayta yuklab koʼring. Agar xato davom etsa, administrator bilan bogʼlaning."
            errorCode="ERR_CONNECTION_TIMED_OUT"
            action={<Button onClick={() => alert("Qayta urinish...")}>Qayta urinish</Button>}
          />
        </div>
      </section>

      {/* 15. Universal Content Listing System Demo */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          15. Universal Kontent Roʻyxati (Content Listing System)
        </h2>
        
        {/* Mock triggers */}
        <div className="p-4 rounded-xl border border-border bg-surface flex flex-wrap gap-6 items-center shadow-xs">
          <span className="text-sm font-semibold text-fg-muted">Simulyatsiya sozlamalari:</span>
          <div className="flex flex-wrap gap-4">
            <Checkbox checked={demoLoading} onChange={(e) => setDemoLoading(e.target.checked)}>
              Loading (Yuklanish)
            </Checkbox>
            <Checkbox checked={demoError} onChange={(e) => setDemoError(e.target.checked)}>
              Error (Xatolik)
            </Checkbox>
            <Checkbox checked={demoEmpty} onChange={(e) => setDemoEmpty(e.target.checked)}>
              Empty (Boʻsh baza)
            </Checkbox>
          </div>
          <Button variant="secondary" size="sm" onClick={resetAllProgress} className="ml-auto text-xs">
            Barcha progressni tozalash
          </Button>
        </div>

        {/* Dynamic Listing wrapper */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <ContentList
            items={demoEmpty ? [] : MOCK_CONTENT_ITEMS}
            loading={demoLoading}
            error={demoError ? "Simulyatsiya qilingan tarmoq xatoligi yuz berdi." : null}
            onRetry={() => setDemoError(false)}
            onActionClick={handleCardAction}
            actionText="Bajarish"
          />
        </div>
      </section>

      {/* 16. Universal PagedReader Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          16. Universal Paged Reader (Kitob oʻquvchi moduli)
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <PagedReader
            id="book-odob-1"
            title="Muloqot odoblari toʻplami"
            pages={MOCK_BOOK_PAGES}
            audioUrls={MOCK_AUDIO_URLS}
            testId="muloqot-test"
            onBack={() => alert("Kutubxonaga oʼtilmoqda...")}
          />
        </div>
      </section>

      {/* 17. Universal Test Wizard Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-fg border-l-4 border-brand pl-3 font-display">
          17. Universal Test Wizard (Test topshirish moduli)
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          {quizStarted ? (
            <TestWizard
              test={MOCK_TEST}
              onClose={() => setQuizStarted(false)}
              onComplete={(score, passed) => console.log(`Quiz finished: Score ${score}%, Passed: ${passed}`)}
            />
          ) : (
            <div className="text-center py-10 space-y-4">
              <h3 className="text-lg font-bold text-fg font-display">Muloqot Odoblari Testi</h3>
              <p className="text-sm text-fg-muted max-w-sm mx-auto">
                Ushbu interaktiv test orqali muloqot va salomlashish odoblari haqidagi bilimlarni tekshirishingiz mumkin.
              </p>
              <Button onClick={() => setQuizStarted(true)}>Testni boshlash</Button>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
