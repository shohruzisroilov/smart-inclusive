<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink, FileDown } from '@lucide/vue'

/**
 * PDF ko'rish oynasi.
 *
 * NEGA KERAK: bekend materialning `pdfFileUrl` ini `ContentItem/DownloadFile`
 * orqali to'g'ri beradi (tekshirilgan: 200, `application/pdf`), lekin
 * sahifama-sahifa o'qish har doim ham mumkin emas — `ComicPage/GetList` 401
 * qaytaradi, kitoblarning ko'pida esa `BookPage` yozuvlari umuman yo'q.
 * Shunday hollarda o'qishning YAGONA ishlaydigan yo'li — shu PDF.
 *
 * `#view=FitH` — brauzerning o'z PDF ko'ruvchisiga sahifani eniga moslashni
 * aytadi. Ba'zi mobil brauzerlar `<iframe>` ichida PDF ochmaydi, shuning uchun
 * «yangi oynada ochish» va «yuklab olish» havolalari HAR DOIM ko'rinadi —
 * ular ishlamay qolmaydigan zaxira yo'l.
 */
const props = defineProps<{
  url: string
  title: string
}>()

const { t } = useI18n()

const embedUrl = computed(() => `${props.url}#view=FitH`)
</script>

<template>
  <section class="space-y-3">
    <div
      class="rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface-subtle)]"
    >
      <iframe
        :src="embedUrl"
        :title="t('reader.pdfFrameTitle', { title })"
        class="w-full h-[70vh] min-h-96"
        loading="lazy"
      />
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand-subtle)] text-[var(--brand)] font-bold text-sm hover:bg-[var(--brand)] hover:text-[var(--fg-on-brand)] transition-colors"
      >
        <ExternalLink class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('reader.openPdf') }}</span>
      </a>

      <a
        :href="url"
        download
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border-default)] text-[var(--fg)] font-bold text-sm hover:bg-[var(--surface-subtle)] transition-colors"
      >
        <FileDown class="w-4 h-4" aria-hidden="true" />
        <span>{{ t('reader.downloadPdf') }}</span>
      </a>
    </div>
  </section>
</template>
