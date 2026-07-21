"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  BookOpenIcon,
  HeartIcon,
  UsersIcon,
  AwardIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  UserCheckIcon,
  XIcon
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_VOLUNTEER_HUB } from "@/lib/mocks/volunteers-about";

const iconMap = {
  book: BookOpenIcon,
  heart: HeartIcon,
  users: UsersIcon,
  award: AwardIcon,
};

export function VolunteersClientWrapper() {
  const [data] = useState(MOCK_VOLUNTEER_HUB);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    activityId: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Ismingizni kiriting";
    if (!formData.phone.trim()) {
      errors.phone = "Telefon raqamingizni kiriting";
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Noto'g'ri telefon raqami shakli";
    }
    if (!formData.activityId) errors.activityId = "Sohani tanlang";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    // Simulate API Submission
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: "", phone: "", activityId: "", message: "" });
    }, 1200);
  };

  return (
    <div className="py-12 space-y-16 select-none text-left">
      {/* 1. HERO SECTION */}
      <section className="px-4">
        <Container>
          <div className="bg-gradient-to-r from-brand/10 via-brand-light/5 to-transparent rounded-3xl p-10 max-phone:p-6 text-left relative overflow-hidden select-none border border-brand/10">
            <div className="max-w-2xl">
              <Badge variant="brand" className="mb-4">KO&apos;NGILLILAR PROGRAMMASI</Badge>
              <h1 className="text-4xl font-black text-fg font-display tracking-tight leading-tight max-phone:text-3xl">
                {data.hero.title}
              </h1>
              <p className="mt-4 text-lg text-fg-muted leading-relaxed">
                {data.hero.subtitle}
              </p>
              <div className="mt-8">
                <Button
                  onClick={() => {
                    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 font-bold"
                >
                  Ko&apos;ngilli bo&apos;lish ariza topshirish
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ACTIVITIES SECTION */}
      <section className="px-4">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10 select-none">
            <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight">
              Biz bilan nima shug&apos;ullanasiz?
            </h2>
            <p className="mt-2 text-fg-muted">
              Har bir volontyor o&apos;z salohiyati va qiziqishiga mos bo&apos;lgan yo&apos;nalishda ko&apos;mak berishi mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.activities.map((act) => {
              const Icon = iconMap[act.iconName] || HeartIcon;
              return (
                <Card key={act.id} className="border border-border/80 hover:border-brand/40 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-brand mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-fg font-display">{act.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-fg-muted leading-relaxed">{act.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. RESULTS STATISTICS */}
      <section className="bg-surface-subtle py-12 border-y border-border/50 px-4">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {data.results.map((res) => (
              <div key={res.id} className="space-y-2">
                <span className="block text-4xl max-phone:text-3xl font-black text-brand font-display tracking-tight">
                  {res.value}
                </span>
                <span className="block text-sm font-medium text-fg-muted">{res.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CASE GALLERY SECTION */}
      <section className="px-4">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10 select-none">
            <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight">
              Muvaffaqiyatli Volontyorlik Hikoyalari
            </h2>
            <p className="mt-2 text-fg-muted">
              Hamkorlikda amalga oshirilgan darslar, tadbirlar va oilalar hayotidagi o&apos;zgarishlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.cases.map((cs) => (
              <Card key={cs.id} className="overflow-hidden border border-border flex flex-col md:flex-row h-full">
                {cs.imageUrl && (
                  <div className="w-full md:w-48 shrink-0 relative aspect-video md:aspect-auto bg-surface-subtle">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover" />
                    {cs.mediaType === "video" && (
                      <Badge variant="accent" className="absolute top-2 left-2">
                        VIDEO
                      </Badge>
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-xs text-fg-muted">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{cs.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-fg font-display leading-tight">{cs.title}</h3>
                    <p className="text-xs text-brand font-semibold">{cs.volunteerName} ({cs.volunteerTitle})</p>
                    <p className="text-sm text-fg-muted line-clamp-3 leading-relaxed mt-2">{cs.description}</p>
                  </div>
                  <div className="pt-4 text-left">
                    <Link
                      href={`/volunteers/${cs.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-dark transition-colors"
                    >
                      Batafsil o&apos;qish
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. BECOME VOLUNTEER FORM SECTION */}
      <section id="apply-form" className="px-4">
        <Container className="max-w-xl">
          <Card className="border border-border/80 p-8 max-phone:p-6 shadow-md rounded-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center text-brand mx-auto mb-3">
                <UserCheckIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-fg font-display">Ko&apos;ngilli Bo&apos;lishga Ariza</h2>
              <p className="text-sm text-fg-muted mt-1">
                Bizga qo&apos;shiling va bolajonlarimiz rivojlanishiga o&apos;z hissangizni qo&apos;shing!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold text-fg mb-1">Ismingiz *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masalan, Madina Axmedova"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">Telefon raqamingiz *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Masalan, +998901234567"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                />
                {formErrors.phone && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              <div>
                <label
                  id="activityId-label"
                  className="block text-sm font-bold text-fg mb-1"
                >
                  Yo&apos;nalishingiz *
                </label>
                <Select
                  value={formData.activityId}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, activityId: value }));
                    if (formErrors.activityId) {
                      setFormErrors((prev) => ({ ...prev, activityId: "" }));
                    }
                  }}
                >
                  <SelectTrigger
                    aria-labelledby="activityId-label"
                    aria-invalid={formErrors.activityId ? true : undefined}
                    className="text-sm"
                  >
                    <SelectValue placeholder="Yo&apos;nalishni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.activities.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.activityId && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.activityId}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">Qo&apos;shimcha ma&apos;lumot</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Bizga aytadigan so&apos;zingiz yoki tajribangiz haqida yozing..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm resize-none"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full py-3 font-bold mt-2">
                {submitting ? "Jo'natilmoqda..." : "Ariza topshirish"}
              </Button>
            </form>
          </Card>
        </Container>
      </section>

      {/* SUCCESS MODAL DIALOG */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl relative text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-subtle transition-all"
            >
              <XIcon className="h-4 w-4" />
            </button>

            <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2Icon className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-extrabold text-fg font-display">Arizangiz qabul qilindi!</h3>
            <p className="text-sm text-fg-muted leading-relaxed">
              Jamoamizga qiziqish bildirganingiz uchun tashakkur. Arizangiz ko&apos;rib chiqilib, tez orada koordinatirlarimiz siz bilan bog&apos;lanishadi!
            </p>

            <div className="pt-2">
              <Button onClick={() => setShowSuccess(false)} className="w-full">
                Tushunarli
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
