<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Video } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import { localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'
import { CONTENT_CATEGORY_OTA_ONALAR_VIDEO } from '@/lib/api/constants'
import SkeletonCardGrid from '@/components/ui/SkeletonCardGrid.vue'
import PageHero from '@/components/ui/PageHero.vue'

const { t, locale } = useI18n()
const items = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  items.value = all.filter((i) => i.categoryId === CONTENT_CATEGORY_OTA_ONALAR_VIDEO)
  loading.value = false
})
</script>

<template>
  <div class="pt-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <PageHero
      accent="parents"
      :title="t('sections.parentsVideosTitle')"
    />

    <SkeletonCardGrid v-if="loading" />

    <div v-else-if="items.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="item in items"
        :key="item.id"
        :to="`/for-parents/videos/${item.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--accent-platform)] transition-all space-y-4"
      >
        <div
          class="rounded-2xl overflow-hidden bg-[var(--surface-subtle)] aspect-video flex items-center justify-center"
        >
          <img
            v-if="item.coverImageUrl"
            :src="item.coverImageUrl"
            :alt="localizedTitle(item, locale)"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <Video v-else class="w-10 h-10 text-[var(--accent-platform)]" aria-hidden="true" />
        </div>
        <h3
          class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--accent-platform)] transition-colors"
        >
          {{ localizedTitle(item, locale) }}
        </h3>
        <p class="text-xs text-[var(--fg-muted)] line-clamp-2">{{ item.description }}</p>
      </router-link>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
