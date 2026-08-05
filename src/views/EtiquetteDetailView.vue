<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Award, Check } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import { getTestForContentItem } from '@/lib/api/tests'
import { useProgressStore } from '@/stores/useProgressStore'
import type { ContentItemDto, TestDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'
import VideoPlayer from '@/components/ui/VideoPlayer.vue'
import PagedPdfReader from '@/components/ui/PagedPdfReader.vue'

/**
 * Etiket bo'limidagi bitta material.
 *
 * Bu bo'limga adminkadan HAR QANDAY tur qo'shilishi mumkin (komiks, video,
 * maqola) — kategoriya turdan mustaqil. Shuning uchun sahifa yozuvda nima
 * bo'lsa shuni chizadi: video bo'lsa pleyer, PDF bo'lsa o'quvchi, matn bo'lsa
 * maqola. Avval faqat sarlavha va tavsif ko'rinardi, ya'ni komiksni o'qib
 * bo'lmasdi.
 */

const route = useRoute()
const { t, locale } = useI18n()
const progress = useProgressStore()

const item = ref<ContentItemDto | null>(null)
const linkedTest = ref<TestDto | null>(null)
const loading = ref(true)

const contentItemId = computed(() => Number(route.params.id))
const title = computed(() => (item.value ? localizedTitle(item.value, locale.value) : ''))
const isRead = computed(() => progress.isViewed(contentItemId.value))

/** PDF o'quvchisi oxirgi sahifaga yetganini shu bayroq orqali bildiradi. */
const atEnd = ref(false)

/**
 * «O'qildi» tugmasi FAQAT matnli maqola uchun kerak.
 *
 * Video o'z tugmasini `VideoPlayer` ichida beradi, PDF'da esa oxirgi sahifaga
 * yetilishining o'zi belgi bo'ladi (TZ 10.4) — u yerda qo'shimcha tugma
 * foydalanuvchini ikki marta bir xil ishni qilishga majburlardi.
 */
const showReadButton = computed(() =>
  Boolean(item.value?.fullText && !item.value?.pdfFileUrl && !item.value?.youtubeUrl),
)

/** Test tugmasi ochiladigan shart materialning turiga qarab hisoblanadi. */
const testUnlocked = computed(() => {
  if (item.value?.pdfFileUrl) return atEnd.value
  if (item.value?.fullText) return isRead.value
  return true
})

onMounted(async () => {
  const id = contentItemId.value
  if (Number.isInteger(id)) {
    ;[item.value, linkedTest.value] = await Promise.all([
      fetchContentItemById(id),
      getTestForContentItem(id),
    ])
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <SkeletonArticle v-if="loading" :lines="4" />

    <div
      v-else-if="item"
      class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-6"
    >
      <VideoPlayer v-if="item.youtubeUrl" :item="item" :linked-test="linkedTest" />

      <div
        v-else-if="item.coverImageUrl && !item.pdfFileUrl"
        class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6"
      >
        <img :src="item.coverImageUrl" :alt="title" class="max-h-full max-w-full object-contain" />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ title }}</h1>
        <p v-if="item.description" class="text-base text-[var(--fg-muted)] leading-relaxed">
          {{ item.description }}
        </p>
      </div>

      <div
        v-if="item.fullText"
        class="text-base text-[var(--fg)] leading-relaxed font-light whitespace-pre-line"
      >
        {{ item.fullText }}
      </div>

      <PagedPdfReader
        v-if="item.pdfFileUrl"
        :url="item.pdfFileUrl"
        :title="title"
        :content-item-id="contentItemId"
        @update:at-end="atEnd = $event"
      />

      <div v-if="showReadButton" class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          :disabled="isRead"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors"
          :class="isRead ? 'bg-[var(--status-success-subtle)] text-[var(--status-success)] cursor-default' : 'bg-[var(--brand-subtle)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] cursor-pointer'"
          @click="progress.markViewed(contentItemId)"
        >
          <Check class="w-4 h-4" aria-hidden="true" />
          <span>{{ isRead ? t('reader.markedRead') : t('reader.markRead') }}</span>
        </button>
      </div>

      <!-- Video bo'lsa test tugmasi `VideoPlayer` ichida, bu yerda takrorlanmaydi -->
      <div
        v-if="linkedTest && !item.youtubeUrl"
        class="pt-4 border-t border-[var(--border-default)] text-center space-y-2"
      >
        <p class="text-sm text-[var(--fg-muted)]">
          {{ testUnlocked ? t('reader.testPrompt') : t('reader.readToEnd') }}
        </p>
        <router-link
          v-if="testUnlocked"
          :to="`/tests/${linkedTest.id}`"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold hover:opacity-90 transition-all"
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
