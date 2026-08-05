<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  MessageSquare,
  Sparkles,
  Send,
} from '@lucide/vue'
import { createVolunteerApplication, fetchRegions } from '@/lib/api/services'
import type { SelectListItemDto } from '@/lib/api/types'
import SelectField from '@/components/ui/SelectField.vue'

const { t } = useI18n()


const regions = ref<SelectListItemDto[]>([])

/** `SelectListItemDto` -> `SelectField` kutgan shakl. */
const regionOptions = computed(() => regions.value.map((r) => ({ value: r.value, label: r.text })))
const formData = ref({
  fullName: '',
  phone: '',
  regionId: 0 as number,
  email: '',
  age: '',
  message: '',
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const submitError = ref<string | null>(null)
const success = ref(false)

function validate() {
  const errs: Record<string, string> = {}
  if (!formData.value.fullName.trim()) errs.fullName = t('forms.volunteer.errName')
  if (!formData.value.phone.trim()) {
    errs.phone = t('forms.volunteer.errPhone')
  } else if (!/^\+?[0-9]{9,15}$/.test(formData.value.phone.replace(/[\s-]/g, ''))) {
    errs.phone = t('forms.errPhoneFormat')
  }
  if (!formData.value.regionId) errs.regionId = t('forms.volunteer.errRegion')
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
    const ageNum = parseInt(formData.value.age, 10)
    await createVolunteerApplication({
      fullName: formData.value.fullName,
      phone: formData.value.phone,
      regionId: formData.value.regionId,
      email: formData.value.email || null,
      age: Number.isFinite(ageNum) ? ageNum : null,
      message: formData.value.message || null,
    })
    success.value = true
  } catch (err) {
    console.error(err)
    submitError.value = t('forms.submitErrorServer')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  regions.value = await fetchRegions()
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#135f70] via-[#1b93a6] to-[#0a2932] p-8 sm:p-12 text-white">
      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake class="w-4 h-4" />
          <span>{{ t('forms.volunteer.badge') }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
          {{ t('forms.volunteer.title') }}
        </h1>
        <p class="text-base text-white/80 leading-relaxed font-light">
          {{ t('forms.volunteer.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Success State -->
    <div v-if="success" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] text-center space-y-6">
      <div class="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 class="w-10 h-10" />
      </div>
      <div class="space-y-2">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] font-display">
          {{ t('forms.volunteer.successTitle') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)] max-w-md mx-auto leading-relaxed">
          {{ t('forms.volunteer.successDesc') }}
        </p>
      </div>
      <div class="pt-4">
        <button
          type="button"
          class="px-8 py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all cursor-pointer"
          @click="success = false; formData = { fullName: '', phone: '', regionId: 0, email: '', age: '', message: '' }"
        >
          {{ t('forms.volunteer.newApplication') }}
        </button>
      </div>
    </div>

    <!-- Main Form Card -->
    <div v-else class="p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)]">
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div v-if="submitError" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3 text-sm">
          <AlertCircle class="w-5 h-5 shrink-0" />
          <span>{{ submitError }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Full Name -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
              <User class="w-4 h-4 text-[var(--brand)]" />
              {{ t('forms.volunteer.nameLabel') }} *
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              :placeholder="t('forms.volunteer.namePlaceholder')"
              class="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
              :disabled="loading"
            />
            <span v-if="errors.fullName" class="text-xs text-red-500 font-medium block">{{ errors.fullName }}</span>
          </div>

          <!-- Phone -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
              <Phone class="w-4 h-4 text-[var(--brand)]" />
              {{ t('forms.volunteer.phoneLabel') }} *
            </label>
            <input
              v-model="formData.phone"
              type="text"
              :placeholder="t('forms.volunteer.phonePlaceholder')"
              class="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
              :disabled="loading"
            />
            <span v-if="errors.phone" class="text-xs text-red-500 font-medium block">{{ errors.phone }}</span>
          </div>

          <!-- Region -->
          <SelectField
            v-model="formData.regionId"
            :options="regionOptions"
            :label="t('forms.volunteer.regionLabel')"
            :placeholder="t('forms.volunteer.regionPlaceholder')"
            :icon="MapPin"
            :disabled="loading"
            :error="errors.regionId"
            required
          />

          <!-- Age -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-[var(--brand)]" />
              {{ t('forms.volunteer.ageLabel') }}
            </label>
            <input
              v-model="formData.age"
              type="number"
              :placeholder="t('forms.volunteer.agePlaceholder')"
              class="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
              :disabled="loading"
            />
          </div>

          <!-- Email -->
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
              <Mail class="w-4 h-4 text-[var(--brand)]" />
              {{ t('forms.volunteer.emailLabel') }}
            </label>
            <input
              v-model="formData.email"
              type="email"
              :placeholder="t('forms.volunteer.emailPlaceholder')"
              class="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all"
              :disabled="loading"
            />
          </div>

          <!-- Message -->
          <div class="space-y-2 sm:col-span-2">
            <label class="text-xs font-bold text-[var(--fg)] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare class="w-4 h-4 text-[var(--brand)]" />
              {{ t('forms.volunteer.reasonLabel') }}
            </label>
            <textarea
              v-model="formData.message"
              rows="4"
              :placeholder="t('forms.volunteer.reasonPlaceholder')"
              class="w-full px-4 py-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)] focus:bg-[var(--surface)] focus:border-[var(--brand)] outline-none text-sm transition-all resize-none"
              :disabled="loading"
            ></textarea>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#135f70] to-[#1b93a6] text-white font-extrabold text-base hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles class="w-5 h-5 text-amber-300" />
            <span>{{ loading ? t('forms.volunteer.submitting') : t('forms.volunteer.submit') }}</span>
            <Send class="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
