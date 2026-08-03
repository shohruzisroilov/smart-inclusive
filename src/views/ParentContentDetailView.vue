<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Calendar, User, FileDown } from '@lucide/vue'
import ReadAloud from '@/components/ui/ReadAloud.vue'
import { fetchContentItemById } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

/**
 * «Ota-onalar uchun» bo'limidagi bitta yozuv sahifasi.
 *
 * Maqola, video, huquqiy hujjat va uyda ta'lim — hammasi bitta `ContentItem`
 * yozuvi, faqat kategoriyasi bilan farq qiladi. Shuning uchun bitta sahifa
 * to'rt route'ga xizmat qiladi; qaytish manzili `route.meta.backTo` dan olinadi.
 */

const route = useRoute()
const { t, locale } = useI18n()

const item = ref<ContentItemDto | null>(null)
const loading = ref(true)

const backTo = computed(() => (route.meta.backTo as string) ?? '/for-parents')
const title = computed(() => (item.value ? localizedTitle(item.value, locale.value) : ''))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (Number.isInteger(id)) item.value = await fetchContentItemById(id)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link
      :to="backTo"
      class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
    >
      <ArrowLeft class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('common.back') }}</span>
    </router-link>

    <SkeletonArticle v-if="loading" :lines="6" />

    <article
      v-else-if="item"
      class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6"
    >
      <div v-if="item.youtubeUrl" class="rounded-2xl overflow-hidden bg-black aspect-video">
        <iframe
          :src="item.youtubeUrl"
          :title="title"
          class="w-full h-full"
          frameborder="0"
          allowfullscreen
        />
      </div>

      <img
        v-else-if="item.coverImageUrl"
        :src="item.coverImageUrl"
        :alt="title"
        class="w-full max-h-80 object-cover rounded-2xl"
      />

      <header class="space-y-3">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] font-display leading-tight">
          {{ title }}
        </h1>

        <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--fg-muted)]">
          <span v-if="item.author" class="inline-flex items-center gap-1.5">
            <User class="w-3.5 h-3.5" aria-hidden="true" />
            {{ item.author }}
          </span>
          <span v-if="item.publishedDate" class="inline-flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5" aria-hidden="true" />
            <time :datetime="item.publishedDate">{{ formatDate(item.publishedDate) }}</time>
          </span>
        </div>
      </header>

      <ReadAloud v-if="item.description || item.fullText" target-id="article-body" />

      <div id="article-body" class="space-y-5">
        <p
          v-if="item.description"
          class="text-base text-[var(--fg-muted)] leading-relaxed font-light"
        >
          {{ item.description }}
        </p>

        <div
          v-if="item.fullText"
          class="text-base text-[var(--fg)] leading-relaxed font-light whitespace-pre-line"
        >
          {{ item.fullText }}
        </div>
      </div>

      <!-- Video uchun matnli muqobil (WCAG 1.2.1) -->
      <details v-if="item.transcriptText" class="rounded-2xl bg-[var(--surface-subtle)] p-4">
        <summary class="font-bold text-sm text-[var(--fg)] cursor-pointer">
          {{ t('player.transcript') }}
        </summary>
        <p class="mt-3 text-sm text-[var(--fg-muted)] leading-relaxed whitespace-pre-line">
          {{ item.transcriptText }}
        </p>
      </details>

      <a
        v-if="item.pdfFileUrl"
        :href="item.pdfFileUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand)] text-[var(--fg-on-brand)] font-bold text-sm hover:opacity-90 transition-all"
      >
        <FileDown class="w-4 h-4" aria-hidden="true" />
        <span>PDF</span>
      </a>
    </article>

    <div
      v-else
      class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
