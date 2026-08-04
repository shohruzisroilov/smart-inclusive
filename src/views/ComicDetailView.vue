<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Award, Check } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import { getTestForContentItem } from '@/lib/api/tests'
import { useProgressStore } from '@/stores/useProgressStore'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'
import PdfReader from '@/components/ui/PdfReader.vue'

/**
 * Komiks sahifasi.
 *
 * Komiks AYNAN shu yerda o'qiladi — alohida `/comics/:id/read` o'quvchisi yo'q:
 * u `ComicPage/GetList` ga tayanardi, bekend esa unga 401 qaytaradi
 * (`services.ts` dagi izoh). Komikslar `pdfFileUrl` orqali beriladi.
 */

const route = useRoute()
const { t, locale } = useI18n()
const progress = useProgressStore()

const comic = ref<ContentItemDto | null>(null)
const linkedTest = ref<TestDto | null>(null)
const loading = ref(true)

const contentItemId = computed(() => Number(route.params.id))
const title = computed(() => (comic.value ? localizedTitle(comic.value, locale.value) : ''))
const isRead = computed(() => progress.isViewed(contentItemId.value))

onMounted(async () => {
  const id = contentItemId.value
  if (Number.isInteger(id)) {
    ;[comic.value, linkedTest.value] = await Promise.all([
      fetchContentItemById(id),
      getTestForContentItem(id),
    ])
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link
      to="/comics"
      class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <SkeletonArticle v-if="loading" :lines="4" />

    <div
      v-else-if="comic"
      class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6"
    >
      <!-- Muqova faqat o'qish uchun fayl bo'lmasa ko'rsatiladi: PDF bor bo'lsa
           birinchi sahifaning o'zi muqova bo'lib xizmat qiladi. -->
      <div
        v-if="comic.coverImageUrl && !comic.pdfFileUrl"
        class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6"
      >
        <img :src="comic.coverImageUrl" :alt="title" class="max-h-full max-w-full object-contain" />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ title }}</h1>
        <p v-if="comic.description" class="text-base text-[var(--fg-muted)] leading-relaxed">
          {{ comic.description }}
        </p>
        <p v-if="comic.author" class="text-sm text-[var(--fg-muted)]">{{ comic.author }}</p>
      </div>

      <PdfReader v-if="comic.pdfFileUrl" :url="comic.pdfFileUrl" :title="title" />

      <p
        v-else
        class="text-center py-10 text-sm text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-2xl border border-[var(--border-default)]"
      >
        {{ t('reader.emptyPages') }}
      </p>

      <div
        v-if="comic.pdfFileUrl"
        class="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--border-default)]"
      >
        <button
          type="button"
          :disabled="isRead"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors"
          :class="
            isRead
              ? 'bg-emerald-500/10 text-emerald-700 cursor-default'
              : 'bg-[var(--brand-subtle)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] cursor-pointer'
          "
          @click="progress.markViewed(contentItemId)"
        >
          <Check class="w-4 h-4" aria-hidden="true" />
          <span>{{ isRead ? t('reader.markedRead') : t('reader.markRead') }}</span>
        </button>
      </div>

      <!-- TZ 10.4: test bo'lmasa tugma umuman chiqmaydi -->
      <div
        v-if="linkedTest"
        class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
      >
        <p class="text-sm text-[var(--fg-muted)]">
          {{ isRead ? t('reader.testPrompt') : t('reader.readToEnd') }}
        </p>
        <router-link
          v-if="isRead"
          :to="`/tests/${linkedTest.id}`"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold shadow-lg hover:opacity-90 transition-all"
        >
          <Award class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('reader.goToTest') }}</span>
        </router-link>
        <span
          v-else
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--surface-muted)] text-[var(--fg-subtle)] font-bold cursor-not-allowed"
          aria-disabled="true"
        >
          <Award class="w-5 h-5" aria-hidden="true" />
          <span>{{ t('reader.goToTest') }}</span>
        </span>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
