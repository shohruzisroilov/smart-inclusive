<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, BookOpen } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
const comic = ref<ContentItemDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) comic.value = await fetchContentItemById(id)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/comics" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="comic" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <div v-if="comic.coverImageUrl" class="h-80 rounded-2xl overflow-hidden bg-[var(--surface-subtle)] flex items-center justify-center p-6">
        <img :src="comic.coverImageUrl" :alt="comic.titleUz" class="max-h-full max-w-full object-contain" />
      </div>
      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ comic.titleUz }}</h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed">{{ comic.description }}</p>
      </div>
      <div class="pt-4 flex items-center gap-4">
        <router-link :to="`/comics/${comic.id}/read`" class="px-8 py-3.5 rounded-xl bg-[var(--brand)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all shadow-md flex items-center gap-2">
          <BookOpen class="w-5 h-5" />
          <span>O'qish</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
