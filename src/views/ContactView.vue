<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Send,
} from '@lucide/vue'
import { createContactRequest } from '@/lib/api/services'

const { t } = useI18n()

const formData = ref({
  fullName: '',
  phone: '',
  message: '',
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const submitError = ref<string | null>(null)
const success = ref(false)

function validate() {
  const errs: Record<string, string> = {}
  if (!formData.value.fullName.trim()) errs.fullName = t('forms.contact.errName')
  if (!formData.value.phone.trim()) {
    errs.phone = t('forms.contact.errPhone')
  } else if (!/^\+?[0-9]{9,15}$/.test(formData.value.phone.replace(/[\s-]/g, ''))) {
    errs.phone = t('forms.errPhoneFormat')
  }
  if (!formData.value.message.trim()) errs.message = t('forms.contact.errMessage')
  return errs
}

async function handleSubmit() {
  const errs = validate()
  if (Object.keys(errs).length > 0) {
    errors.value = errs
    return
  }

  loading.value = true
  submitError.value = null

  try {
    await createContactRequest({
      fullName: formData.value.fullName,
      phone: formData.value.phone,
      message: formData.value.message,
    })
    success.value = true
  } catch (err) {
    console.error(err)
    submitError.value = t('forms.submitErrorServer')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="py-12 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#135f70]/10 to-transparent p-6 rounded-2xl border border-[var(--border-default)] mb-8 space-y-2">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] uppercase tracking-wider">
          <MessageSquare class="w-4 h-4" />
          {{ t('forms.contact.badge') }}
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] font-display">
          {{ t('forms.contact.title') }}
        </h1>
        <p class="text-sm text-[var(--fg-muted)]">
          {{ t('forms.contact.subtitle') }}
        </p>
      </div>

      <!-- Success State -->
      <div v-if="success" class="p-8 text-center space-y-6">
        <div class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-[var(--fg)] font-display">
            {{ t('forms.contact.successTitle') }}
          </h2>
          <p class="text-sm text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
            {{ t('forms.contact.successDesc') }}
          </p>
        </div>
        <div class="pt-2">
          <button
            type="button"
            class="w-full py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all cursor-pointer shadow-md"
            @click="success = false; formData = { fullName: '', phone: '', message: '' }"
          >
            {{ t('forms.contact.newRequest') }}
          </button>
        </div>
      </div>

      <!-- Form Body -->
      <form v-else class="space-y-5" @submit.prevent="handleSubmit">
        <div v-if="submitError" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3 text-sm">
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span>{{ submitError }}</span>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
            <User class="w-4 h-4 text-[var(--brand)]" />
            {{ t('forms.contact.nameLabel') }} *
          </label>
          <input
            v-model="formData.fullName"
            type="text"
            :placeholder="t('forms.contact.namePlaceholder')"
            class="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
            :disabled="loading"
          />
          <span v-if="errors.fullName" class="text-xs text-red-500 font-medium block">{{ errors.fullName }}</span>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
            <Phone class="w-4 h-4 text-[var(--brand)]" />
            {{ t('forms.contact.phoneLabel') }} *
          </label>
          <input
            v-model="formData.phone"
            type="text"
            :placeholder="t('forms.contact.phonePlaceholder')"
            class="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
            :disabled="loading"
          />
          <span v-if="errors.phone" class="text-xs text-red-500 font-medium block">{{ errors.phone }}</span>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare class="w-4 h-4 text-[var(--brand)]" />
            {{ t('forms.contact.messageLabel') }} *
          </label>
          <textarea
            v-model="formData.message"
            rows="4"
            :placeholder="t('forms.contact.messagePlaceholder')"
            class="w-full px-4 py-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all resize-none"
            :disabled="loading"
          ></textarea>
          <span v-if="errors.message" class="text-xs text-red-500 font-medium block">{{ errors.message }}</span>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 rounded-xl bg-gradient-to-r from-[#135f70] to-[#1b93a6] text-white font-extrabold text-base shadow-xl hover:shadow-2xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{{ loading ? t('forms.contact.submitting') : t('forms.contact.submit') }}</span>
            <Send class="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
