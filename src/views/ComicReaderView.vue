<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronLeft, ChevronRight } from '@lucide/vue'
import { fetchComicPages, fetchContentItemById } from '@/lib/api/services'
import type { ComicPageDto, ContentItemDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
const comic = ref<ContentItemDto | null>(null)
const pages = ref<ComicPageDto[]>([])
const currentPage = ref(0)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) {
    comic.value = await fetchContentItemById(id)
    pages.value = await fetchComicPages(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div class="flex items-center justify-between">
      <router-link :to="`/comics/${route.params.id}`" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
        <ArrowLeft class="w-4 h-4" />
        <span>Orqaga</span>
      </router-link>
      <div v-if="pages.length > 0" class="text-xs font-bold text-[var(--fg-muted)]">
        {{ currentPage + 1 }} / {{ pages.length }}
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="pages.length > 0" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-2xl space-y-6">
      <div class="h-96 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
        <img v-if="pages[currentPage].imageUrl" :src="pages[currentPage].imageUrl" :alt="`Page ${pages[currentPage].pageNumber}`" class="max-h-full max-w-full object-contain" />
      </div>
      <div class="pt-4 flex items-center justify-between border-t border-[var(--border-default)]">
        <button type="button" class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors disabled:opacity-30" :disabled="currentPage === 0" @click="currentPage--">
          <ChevronLeft class="w-4 h-4 inline mr-1" /> Orqaga
        </button>
        <button type="button" class="px-6 py-3 rounded-xl border border-[var(--border-default)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors disabled:opacity-30" :disabled="currentPage === pages.length - 1" @click="currentPage++">
          Keyingi <ChevronRight class="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>
  </div>
</template>
