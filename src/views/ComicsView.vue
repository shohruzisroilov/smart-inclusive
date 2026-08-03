<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BookOpen, ArrowRight } from '@lucide/vue'
import { fetchContentItems } from '@/lib/api/services'
import type { ContentItemDto } from '@/lib/api/types'
import { CONTENT_TYPE_KOMIKS } from '@/lib/api/constants'

const { t } = useI18n()
const comics = ref<ContentItemDto[]>([])
const loading = ref(true)

onMounted(async () => {
  const all = await fetchContentItems()
  comics.value = all.filter((item) => item.typeId === CONTENT_TYPE_KOMIKS)
  loading.value = false
})
</script>

<template>
  <div class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    <div class="bg-gradient-to-r from-[#135f70] to-[#1b93a6] p-8 sm:p-12 rounded-3xl text-white shadow-xl space-y-3">
      <h1 class="text-3xl sm:text-4xl font-extrabold font-display">Komikslar</h1>
      <p class="text-white/80 max-w-xl text-sm leading-relaxed font-light">
        Bolalar uchun qiziqarli rasmli komikslar va hikoyalar.
      </p>
    </div>

    <div v-if="loading" class="text-center py-20 text-[var(--fg-muted)]">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="comics.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="c in comics"
        :key="c.id"
        :to="`/comics/${c.id}`"
        class="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] hover:shadow-xl transition-all space-y-4"
      >
        <div class="h-48 rounded-2xl bg-[var(--surface-subtle)] overflow-hidden flex items-center justify-center p-4">
          <img v-if="c.coverImageUrl" :src="c.coverImageUrl" :alt="c.titleUz" class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
          <BookOpen v-else class="w-12 h-12 text-[var(--fg-subtle)]" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-[var(--fg)] font-display group-hover:text-[var(--brand)] transition-colors">{{ c.titleUz }}</h3>
          <p class="text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{{ c.description }}</p>
        </div>
        <div class="pt-2 flex items-center justify-between text-xs font-bold text-[var(--brand)]">
          <span>O'qish</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </router-link>
    </div>

    <div v-else class="text-center py-16 text-[var(--fg-muted)] bg-[var(--surface-subtle)] rounded-3xl border border-[var(--border-default)]">
      {{ t('content.list.emptyTitle') }}
    </div>
  </div>
</template>
