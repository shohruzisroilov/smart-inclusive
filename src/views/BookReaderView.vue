<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from '@lucide/vue'
import { fetchBookPages, fetchContentItemById } from '@/lib/api/services'
import type { BookPageDto, ContentItemDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()

const book = ref<ContentItemDto | null>(null)
const pages = ref<BookPageDto[]>([])
const currentPage = ref(0)
const loading = ref(true)

function playAudio(url?: string) {
  if (!url) return
  const audio = new Audio(url)
  audio.play()
}

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) {
    book.value = await fetchContentItemById(id)
    pages.value = await fetchBookPages(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div class="flex items-center justify-between">
      <router-link :to="`/books/${route.params.id}`" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
        <ArrowLeft class="w-4 h-4" />
        <span>{{ t('reader.backToLibrary') }}</span>
      </router-link>

      <div v-if="pages.length > 0" class="text-xs font-bold text-[var(--fg-muted)]">
        {{ currentPage + 1 }} / {{ pages.length }}
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="pages.length > 0" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-2xl space-y-6">
      <div class="h-96 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
        <img
          v-if="pages[currentPage].imageUrl"
          :src="pages[currentPage].imageUrl"
          :alt="`Page ${pages[currentPage].pageNumber}`"
          class="max-h-full max-w-full object-contain"
        />
        <div v-else class="text-center text-[var(--fg-subtle)] text-sm">
          {{ t('reader.noImage') }}
        </div>
      </div>

      <div v-if="pages[currentPage].text" class="space-y-4">
        <p class="text-lg text-[var(--fg)] leading-relaxed font-serif">
          {{ pages[currentPage].text }}
        </p>

        <button
          v-if="pages[currentPage].audioUrlUz"
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] font-bold text-sm hover:bg-[var(--brand)] hover:text-white transition-all cursor-pointer"
          @click="playAudio(pages[currentPage].audioUrlUz ?? undefined)"
        >
          <Volume2 class="w-4 h-4" />
          <span>{{ t('reader.listen') }}</span>
        </button>
      </div>

      <!-- Pagination Footer -->
      <div class="pt-4 flex items-center justify-between border-t border-[var(--border-default)]">
        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30"
          :disabled="currentPage === 0"
          @click="currentPage--"
        >
          <ChevronLeft class="w-4 h-4 inline mr-1" />
          {{ t('reader.prev') }}
        </button>

        <button
          type="button"
          class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer disabled:opacity-30"
          :disabled="currentPage === pages.length - 1"
          @click="currentPage++"
        >
          {{ t('reader.next') }}
          <ChevronRight class="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('reader.emptyPages') }}
    </div>
  </div>
</template>
