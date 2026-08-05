<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, CheckCircle2, Award } from '@lucide/vue'
import { formatApiDate, localizedTitle } from '@/lib/api/content'
import type { ContentItemDto } from '@/lib/api/types'

/**
 * Kontent ro'yxatlaridagi yagona kartochka.
 *
 * Avval bu maket BESHTA view'da (kitoblar, komikslar, etiket, darslar, men
 * qila olaman) qo'lda ko'chirib yozilgandi va ular asta-sekin bir-biridan
 * uzoqlashib ketgandi: birida sana bor, boshqasida yo'q; birida «bajarildi»
 * belgisi bor, boshqasida yo'q. Endi bitta manba.
 *
 * Yuqori qirradagi rangli tasma — bo'lim belgisi (`tokens.css`, 5-bo'lim).
 * U bezak emas: bosh sahifada aralash kartochkalar yonma-yon turganda,
 * yozuvni o'qimasdan qaysi bo'lim ekanini bilish mumkin.
 */
const props = defineProps<{
  item: ContentItemDto
  to: string
  /** `tokens.css` dagi `--tab-*` nomining oxirgi qismi: `books`, `lessons`, … */
  section: string
  /** Kartochkadagi harakat yozuvi: «O'qish», «Ko'rish», … */
  actionLabel: string
  /** Materialga test biriktirilganmi (TZ 5.1 belgisi). */
  hasTest?: boolean
  /** Foydalanuvchi bu materialni tugatganmi. */
  done?: boolean
}>()

const { t, locale } = useI18n()

const title = computed(() => localizedTitle(props.item, locale.value))
const date = computed(() => formatApiDate(props.item.publishedDate, locale.value))
</script>

<template>
  <router-link
    :to="to"
    class="si-card si-card-interactive si-card-tabbed group"
    :style="{ '--tab-color': `var(--tab-${section})` }"
  >
    <div class="si-media">
      <img v-if="item.coverImageUrl" :src="item.coverImageUrl" :alt="title" loading="lazy" />
      <!-- Muqovasi yo'q material uchun ham joy band bo'ladi, maket sakramaydi -->
      <slot v-else name="placeholder" />
    </div>

    <div class="flex flex-1 flex-col gap-2 p-5">
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="done"
          class="inline-flex items-center gap-1 rounded-full bg-[var(--status-success-subtle)] px-2.5 py-1 text-xs font-bold text-[var(--status-success)]"
        >
          <CheckCircle2 class="h-3.5 w-3.5" aria-hidden="true" />
          {{ t('content.card.done') }}
        </span>
        <span
          v-if="hasTest"
          class="inline-flex items-center gap-1 rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-xs font-bold text-[var(--brand-text)]"
        >
          <Award class="h-3.5 w-3.5" aria-hidden="true" />
          {{ t('content.card.hasTest') }}
        </span>
      </div>

      <h3 class="font-display text-lg font-bold text-[var(--fg)] sm:text-xl">
        {{ title }}
      </h3>

      <p v-if="item.description" class="line-clamp-2 text-sm text-[var(--fg-muted)]">
        {{ item.description }}
      </p>

      <p v-if="date" class="text-xs text-[var(--fg-subtle)]">
        <time :datetime="item.publishedDate!">{{ date }}</time>
      </p>

      <!-- Harakat qatori pastga yopishadi, shunda turli balandlikdagi
           kartochkalarda ham bir chiziqda turadi. -->
      <span
        class="mt-auto flex items-center justify-between pt-3 text-sm font-bold"
        :style="{ color: `var(--tab-${section})` }"
      >
        {{ actionLabel }}
        <ArrowRight
          class="h-4 w-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </div>
  </router-link>
</template>
