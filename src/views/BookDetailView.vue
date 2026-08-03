<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, BookOpen, Play } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()

const book = ref<ContentItemDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) {
    book.value = await fetchContentItemById(id)
  }
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/books" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t('reader.backToLibrary') }}</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="book" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <div v-if="book.coverImageUrl" class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6">
        <img :src="book.coverImageUrl" :alt="book.titleUz" class="max-h-full max-w-full object-contain" />
      </div>

      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ book.titleUz }}</h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed">{{ book.description }}</p>
      </div>

      <div class="pt-4 flex items-center gap-4">
        <router-link
          :to="`/books/${book.id}/read`"
          class="px-8 py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all shadow-md flex items-center gap-2"
        >
          <BookOpen class="w-5 h-5" />
          <span>{{ t('content.card.read') }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
