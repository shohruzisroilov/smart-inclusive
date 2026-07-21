"use client";

import React, { useState } from "react";
import { SendIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ContactClientWrapper() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
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
      errors.name = "Ismingizni kiriting";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Telefon raqamingizni kiriting";
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Noto'g'ri telefon raqami ko'rinishi (masalan, +998901234567)";
    }
    if (!formData.message.trim()) {
      errors.message = "Murojaat matnini kiriting";
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
    setFormData({ name: "", phone: "", message: "" });
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
            <h1 className="text-2xl font-extrabold text-fg font-display">Murojaatingiz yuborildi!</h1>
            <p className="text-sm text-fg-muted leading-relaxed">
              Bizga yozganingiz uchun rahmat. Murojaat jamoamiz tomonidan o&apos;rganib chiqiladi va tez fursatda siz bilan bog&apos;lanamiz.
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={() => setSuccess(false)} className="w-full">
              Yangi murojaat yuborish
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-md rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand/10 to-transparent p-6 border-b border-border/60">
            <Badge variant="brand" className="mb-2">BOG&apos;LANISH</Badge>
            <h1 className="text-2xl font-extrabold text-fg font-display">Murojaat formasi</h1>
            <p className="text-sm text-fg-muted mt-1">
              Savol va takliflaringiz bo&apos;lsa, quyidagi shaklni to&apos;ldiring.
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
                <label className="block text-sm font-bold text-fg mb-1">Ismingiz *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masalan, Shohrux"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                  disabled={loading}
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
                  disabled={loading}
                />
                {formErrors.phone && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">Murojaat matni *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Savolingiz yoki taklifingizni bu yerga batafsil yozing..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm resize-none"
                  disabled={loading}
                />
                {formErrors.message && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.message}</span>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button type="submit" disabled={loading} className="w-full py-3 font-bold flex items-center justify-center gap-2">
                {loading ? "Yuborilmoqda..." : (
                  <>
                    Murojaatni jo&apos;natish
                    <SendIcon className="h-4 w-4" />
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
