<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Video } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'
import { CONTENT_CATEGORY_OTA_ONALAR_VIDEO } from '@/lib/api/constants'

const { t } = useI18n()
const items = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  items.value = all.filter((i) => i.categoryId === CONTENT_CATEGORY_OTA_ONALAR_VIDEO)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/for-parents" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <div class="bg-gradient-to-r from-amber-600 to-orange-600 p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3">
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">{{ t('sections.parentsVideosTitle') }}</h1>
      <p class="text-white/90 max-w-xl text-sm leading-relaxed font-light">{{ t('sections.parentsVideosSubtitle') }}</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-sm space-y-4">
        <!-- YouTube embed via youtubeUrl field -->
        <div v-if="item.youtubeUrl" class="rounded-2xl overflow-hidden bg-black aspect-video">
          <iframe :src="item.youtubeUrl" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
        </div>
        <h3 class="text-xl font-bold text-[var(--fg)] font-display">{{ item.titleUz }}</h3>
        <p class="text-xs text-[var(--fg-muted)] line-clamp-2">{{ item.description }}</p>
      </div>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
