<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from '@lucide/vue'
import { fetchContentItemById } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'

const route = useRoute()
const { t } = useI18n()
const item = ref<ContentItemDto | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = parseInt(route.params.id as string, 10)
  if (id) item.value = await fetchContentItemById(id)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <router-link to="/lessons" class="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline">
      <ArrowLeft class="w-4 h-4" />
      <span>Orqaga</span>
    </router-link>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">{{ t('common.loading') }}</div>

    <div v-else-if="item" class="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] shadow-xl space-y-6">
      <div v-if="item.youtubeUrl" class="rounded-2xl overflow-hidden bg-black aspect-video">
        <iframe :src="item.youtubeUrl" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="space-y-3">
        <h1 class="text-3xl font-extrabold text-[var(--fg)] font-display">{{ item.titleUz }}</h1>
        <p class="text-base text-[var(--fg-muted)] leading-relaxed">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
