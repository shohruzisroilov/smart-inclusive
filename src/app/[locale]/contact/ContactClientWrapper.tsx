"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SendIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ContactClientWrapper() {
  const t = useTranslations("forms.contact");
  const tf = useTranslations("forms");
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
      errors.name = t("errName");
    }
    if (!formData.phone.trim()) {
      errors.phone = t("errPhone");
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      errors.phone = tf("errPhoneFormat");
    }
    if (!formData.message.trim()) {
      errors.message = t("errMessage");
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
        <Card className="border border-border/80 p-8 shadow-sm rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2Icon className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-fg font-display">{t("successTitle")}</h1>
            <p className="text-sm text-fg-muted leading-relaxed">
              {t("successDesc")}
            </p>
          </div>
          <div className="pt-2">
            <Button onClick={() => setSuccess(false)} className="w-full">
              {t("newRequest")}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border border-border/80 shadow-sm rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand/10 to-transparent p-6 border-b border-border/60">
            <Badge variant="brand" className="mb-2">{t("badge")}</Badge>
            <h1 className="text-2xl font-extrabold text-fg font-display">{t("title")}</h1>
            <p className="text-sm text-fg-muted mt-1">
              {t("subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-4">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg p-4 flex items-start gap-3 text-sm">
                  <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{tf("submitErrorTitle")}</span>
                    <span className="block mt-0.5">{submitError}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-fg mb-1">{t("nameLabel")} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("namePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                  disabled={loading}
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">{t("phoneLabel")} *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("phonePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface focus:outline-none focus:border-brand text-sm"
                  disabled={loading}
                />
                {formErrors.phone && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-fg mb-1">{t("messageLabel")} *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t("messagePlaceholder")}
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
                {loading ? t("submitting") : (
                  <>
                    {t("submit")}
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
