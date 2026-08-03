<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from '@lucide/vue'
import { fetchComicPages, fetchContentItemById } from '@/lib/api/services'
import type { ComicPageDto, ContentItemDto } from '@/lib/api/types'
import SkeletonArticle from '@/components/ui/SkeletonArticle.vue'

const route = useRoute()
const { t } = useI18n()

const comic = ref<ContentItemDto | null>(null)
const pages = ref<ComicPageDto[]>([])
const currentPage = ref(0)
const loading = ref(true)

function playAudio(url?: string | null) {
  if (!url) return
  new Audio(url).play()
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (Number.isInteger(id)) {
    comic.value = await fetchContentItemById(id)
    pages.value = await fetchComicPages(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div class="flex items-center justify-between">
      <router-link
        :to="`/comics/${route.params.id}`"
        class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
      >
        <ArrowLeft class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('reader.backToLibrary') }}</span>
      </router-link>

      <div v-if="pages.length > 0" class="text-xs font-bold text-[var(--fg-muted)]">
        {{ t('reader.pageCounter', { current: currentPage + 1, total: pages.length }) }}
      </div>
    </div>

    <SkeletonArticle v-if="loading" :lines="3" />

    <div
      v-else-if="pages.length > 0"
      class="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-2xl space-y-6"
    >
      <div
        class="h-96 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4"
      >
        <img
          v-if="pages[currentPage].imageUrl"
          :src="pages[currentPage].imageUrl!"
          :alt="`${comic?.titleUz ?? ''} — ${pages[currentPage].pageNumber}`"
          class="max-h-full max-w-full object-contain"
        />
        <div v-else class="text-center text-[var(--fg-subtle)] text-sm">
          {{ t('reader.noImage') }}
        </div>
      </div>

      <div v-if="pages[currentPage].script" class="space-y-4">
        <p class="text-lg text-[var(--fg)] leading-relaxed whitespace-pre-line">
          {{ pages[currentPage].script }}
        </p>

        <button
          v-if="pages[currentPage].audioUrlUz"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] font-bold text-sm hover:bg-[var(--brand)] hover:text-white transition-all cursor-pointer"
          @click="playAudio(pages[currentPage].audioUrlUz)"
        >
          <Volume2 class="w-4 h-4" aria-hidden="true" />
          <span>{{ t('reader.listen') }}</span>
        </button>
      </div>

      <div class="pt-4 flex items-center justify-between border-t border-[var(--border-default)]">
        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === 0"
          @click="currentPage--"
        >
          <ChevronLeft class="w-4 h-4 inline mr-1" aria-hidden="true" />
          {{ t('reader.prev') }}
        </button>

        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm text-[var(--fg)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="currentPage === pages.length - 1"
          @click="currentPage++"
        >
          {{ t('reader.next') }}
          <ChevronRight class="w-4 h-4 inline ml-1" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div
      v-else
      class="text-center py-20 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]"
    >
      {{ t('reader.emptyPages') }}
    </div>
  </div>
</template>
