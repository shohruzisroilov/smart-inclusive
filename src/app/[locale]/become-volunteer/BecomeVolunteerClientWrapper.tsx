"use client";

import React, { useState } from "react";
import { UserPlusIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function BecomeVolunteerClientWrapper() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    age: "",
    reason: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Ism va familiyangizni kiriting";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Telefon raqamingizni kiriting";
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Noto'g'ri telefon raqami ko'rinishi (masalan, +998901234567)";
    }
    if (!formData.city.trim()) {
      errors.city = "Shahar yoki tumaningizni kiriting";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Noto'g'ri email manzili";
    }
    if (formData.age.trim() && (isNaN(Number(formData.age)) || Number(formData.age) <= 0 || Number(formData.age) > 120)) {
      errors.age = "Noto'g'ri yosh kiritildi";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setSubmitError(null);

    // Simulate API submission with timeout
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSuccess(true);
    setFormData({ name: "", phone: "", email: "", city: "", age: "", reason: "" });
    setLoading(false);
  };

  return (
    <Container className="py-12 max-w-xl text-left select-none">
      {success ? (
        <Card className="border border-border/80 p-8 shadow-md rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2Icon className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-fg font-display">Arizangiz muvaffaqiyatli yuborildi!</h1>
            <p className="text-sm text-fg-muted leading-relaxed">
              Ko&apos;ngillilar safiga qo&apos;shilishga qiziqish bildirganingiz uchun tashakkur. Jamoamiz arizani ko&apos;rib chiqib, tez fursatda siz bilan bog&apos;lanadi.
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={() => setSuccess(false)} className="w-full">
              Yangi ariza topshirish
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-accent/10 to-transparent p-6 border-b border-border/60">
            <Badge variant="accent" className="mb-2">VOLONTYORLIK</Badge>
            <h1 className="text-2xl font-extrabold text-fg font-display">Ko&apos;ngilli Bo&apos;lish</h1>
            <p className="text-sm text-fg-muted mt-1">
              Alohida ehtiyojli bolalar hayotiga birgalikda quvonch va bilim olib kiraylik!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg p-4 flex items-start gap-3 text-sm">
                  <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Yuborishda xatolik yuz berdi</span>
                    <span className="block mt-0.5">{submitError}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-fg mb-1">Ism va familiyangiz *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masalan, Madina Axmedova"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                  disabled={loading}
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-fg mb-1">Telefon raqamingiz *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Masalan, +998901234567"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                    disabled={loading}
                  />
                  {formErrors.phone && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-fg mb-1">Shahar / Tuman *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Masalan, Toshkent, Chilonzor"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                    disabled={loading}
                  />
                  {formErrors.city && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.city}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-fg mb-1">Email manzilingiz</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masalan, madina@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                    disabled={loading}
                  />
                  {formErrors.email && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-fg mb-1">Yoshingiz</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Masalan, 20"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                    disabled={loading}
                  />
                  {formErrors.age && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.age}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">Nega ko&apos;ngilli bo&apos;lishni istaysiz?</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Loyihada ishtirok etishdan maqsadingizni qisqacha yozing..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm resize-none"
                  disabled={loading}
                />
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button type="submit" disabled={loading} className="w-full py-3 font-bold flex items-center justify-center gap-2">
                {loading ? "Jo'natilmoqda..." : (
                  <>
                    Ariza topshirish
                    <UserPlusIcon className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </Container>
  );
}
