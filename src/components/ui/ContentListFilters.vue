<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { X } from '@lucide/vue'

/**
 * Ro'yxatlar uchun filtr va saralash paneli (TZ 5.1).
 *
 * Filtrlar BIRLASHADI — «Test bor» + «Topshirilmagan» ikkalasiga ham mos
 * yozuvlarni qoldiradi.
 *
 * KONTENT TILI FILTRI YO'Q, garchi TZ 2.2 uni talab qilsa ham: backenddagi
 * `ContentItemDto` da `language_id` maydoni umuman yo'q (u faqat `Test`,
 * `VocabularyTopic` va `Slide` da bor). Ya'ni kontent birligining tilini
 * bilishning imkoni yo'q — bekendga maydon qo'shilgach shu yerga bitta
 * `select` qo'shiladi.
 */
export type TestFilter = 'any' | 'with' | 'without'
export type ProgressFilter = 'any' | 'done' | 'todo'
export type SortOrder = 'newest' | 'oldest'

const props = defineProps<{
  test: TestFilter
  progress: ProgressFilter
  sort: SortOrder
  /** Filtrlangan va umumiy yozuvlar soni — «N tadan M ta» ko'rsatish uchun. */
  shown: number
  total: number
}>()

const emit = defineEmits<{
  'update:test': [TestFilter]
  'update:progress': [ProgressFilter]
  'update:sort': [SortOrder]
  clear: []
}>()

const { t } = useI18n()

const TEST_OPTIONS: { value: TestFilter; key: string }[] = [
  { value: 'any', key: 'content.filters.any' },
  { value: 'with', key: 'content.filters.withTest' },
  { value: 'without', key: 'content.filters.withoutTest' },
]

const PROGRESS_OPTIONS: { value: ProgressFilter; key: string }[] = [
  { value: 'any', key: 'content.filters.any' },
  { value: 'done', key: 'content.filters.completed' },
  { value: 'todo', key: 'content.filters.uncompleted' },
]

const SORT_OPTIONS: { value: SortOrder; key: string }[] = [
  { value: 'newest', key: 'content.filters.newest' },
  { value: 'oldest', key: 'content.filters.oldest' },
]

const isDirty = () => props.test !== 'any' || props.progress !== 'any' || props.sort !== 'newest'
</script>

<template>
  <section
    class="p-4 sm:p-5 rounded-3xl bg-[var(--surface-subtle)] border border-[var(--border-default)] flex flex-wrap items-end gap-4"
    :aria-label="t('content.filters.panelLabel')"
  >
    <label class="flex flex-col gap-1.5 min-w-40">
      <span class="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">
        {{ t('content.filters.testStatus') }}
      </span>
      <select
        :value="test"
        class="px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-sm font-semibold text-[var(--fg)] cursor-pointer"
        @change="emit('update:test', ($event.target as HTMLSelectElement).value as TestFilter)"
      >
        <option v-for="o in TEST_OPTIONS" :key="o.value" :value="o.value">{{ t(o.key) }}</option>
      </select>
    </label>

    <label class="flex flex-col gap-1.5 min-w-40">
      <span class="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">
        {{ t('content.filters.progress') }}
      </span>
      <select
        :value="progress"
        class="px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-sm font-semibold text-[var(--fg)] cursor-pointer"
        @change="
          emit('update:progress', ($event.target as HTMLSelectElement).value as ProgressFilter)
        "
      >
        <option v-for="o in PROGRESS_OPTIONS" :key="o.value" :value="o.value">
          {{ t(o.key) }}
        </option>
      </select>
    </label>

    <label class="flex flex-col gap-1.5 min-w-40">
      <span class="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">
        {{ t('content.filters.sort') }}
      </span>
      <select
        :value="sort"
        class="px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-sm font-semibold text-[var(--fg)] cursor-pointer"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value as SortOrder)"
      >
        <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value">{{ t(o.key) }}</option>
      </select>
    </label>

    <button
      v-if="isDirty()"
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[var(--brand)] hover:bg-[var(--surface-muted)] transition-colors cursor-pointer"
      @click="emit('clear')"
    >
      <X class="w-4 h-4" aria-hidden="true" />
      <span>{{ t('content.filters.clear') }}</span>
    </button>

    <span class="ml-auto text-xs font-semibold text-[var(--fg-muted)] tabular-nums">
      {{ shown }} / {{ total }}
    </span>
  </section>
</template>
