<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Play, Calendar, Quote, X } from '@lucide/vue'
import { ABOUT_US, type RegionVideo } from '@/lib/content/about-us'

const { t, locale } = useI18n()
const activeVideo = ref<RegionVideo | null>(null)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="py-12 space-y-16">
    <!-- 1. Hero -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[var(--brand-subtle)] to-transparent border border-[var(--border-default)]"
      >
        <div class="max-w-2xl space-y-4">
          <span
            class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[var(--brand)] text-[var(--fg-on-brand)] text-xs font-bold uppercase tracking-wider"
          >
            {{ t('aboutUsPage.badge') }}
          </span>
          <h1
            class="text-3xl sm:text-4xl font-extrabold text-[var(--fg)] font-display tracking-tight leading-tight"
          >
            {{ ABOUT_US.hero.title }}
          </h1>
          <p class="text-lg text-[var(--fg-muted)] font-semibold">{{ ABOUT_US.hero.subtitle }}</p>
          <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
            {{ ABOUT_US.hero.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- 2. Matn/rasm bloklari -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div
        v-for="block in ABOUT_US.blocks"
        :key="block.id"
        class="flex flex-col lg:flex-row items-center gap-12"
        :class="block.align === 'left' ? 'lg:flex-row-reverse' : ''"
      >
        <div class="flex-1 space-y-4">
          <h2
            class="text-2xl sm:text-3xl font-extrabold text-[var(--fg)] font-display tracking-tight leading-tight"
          >
            {{ block.title }}
          </h2>
          <p class="text-base text-[var(--fg-muted)] leading-relaxed font-light">
            {{ block.description }}
          </p>
        </div>
        <div
          class="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface-subtle)]"
        >
          <img :src="block.imageUrl" :alt="block.title" class="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    <!-- 3. Natijalar -->
    <section class="bg-[var(--surface-subtle)] py-12 border-y border-[var(--border-default)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div v-for="stat in ABOUT_US.results" :key="stat.id" class="space-y-2">
            <span
              class="block text-4xl font-black text-[var(--brand)] font-display tracking-tight"
            >
              {{ stat.value }}
            </span>
            <span
              class="block text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-wider"
            >
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Fikrlar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="space-y-1">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
          {{ t('aboutUsPage.testimonialsTitle') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">{{ t('aboutUsPage.testimonialsSubtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <figure
          v-for="item in ABOUT_US.testimonials"
          :key="item.id"
          class="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-default)] space-y-4"
        >
          <Quote class="w-8 h-8 text-[var(--brand)]" aria-hidden="true" />
          <blockquote class="text-base text-[var(--fg)] leading-relaxed font-light">
            {{ item.quote }}
          </blockquote>
          <figcaption class="pt-2 border-t border-[var(--border-default)]">
            <span class="block font-bold text-[var(--fg)]">{{ item.author }}</span>
            <span class="block text-xs text-[var(--fg-muted)]">{{ item.role }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- 5. Sayohatlar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="space-y-1">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
          {{ t('aboutUsPage.travelsTitle') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">{{ t('aboutUsPage.travelsSubtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="trip in ABOUT_US.travels"
          :key="trip.id"
          class="rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border-default)]"
        >
          <img :src="trip.imageUrl" :alt="trip.title" class="w-full h-48 object-cover" />
          <div class="p-6 space-y-3">
            <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)]">
              <Calendar class="w-3.5 h-3.5" aria-hidden="true" />
              <time :datetime="trip.date">{{ formatDate(trip.date) }}</time>
            </div>
            <h3 class="text-xl font-bold text-[var(--fg)] font-display">{{ trip.title }}</h3>
            <p class="text-sm text-[var(--fg-muted)] leading-relaxed font-light">
              {{ trip.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- 6. Videolar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="space-y-1">
        <h2 class="text-2xl font-extrabold text-[var(--fg)] font-display">
          {{ t('aboutUsPage.videosTitle') }}
        </h2>
        <p class="text-sm text-[var(--fg-muted)]">{{ t('aboutUsPage.videosSubtitle') }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          v-for="video in ABOUT_US.videos"
          :key="video.id"
          type="button"
          class="group text-left rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all"
          @click="activeVideo = video"
        >
          <div class="relative h-44">
            <img :src="video.thumbnailUrl" :alt="video.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/35 flex items-center justify-center">
              <span
                class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <Play class="w-6 h-6 text-[var(--brand)]" aria-hidden="true" />
              </span>
            </div>
            <span
              class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-bold"
            >
              {{ video.duration }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-[var(--fg)] group-hover:text-[var(--brand)] transition-colors">
              {{ video.title }}
            </h3>
          </div>
        </button>
      </div>
    </section>

    <!-- Video modal -->
    <Teleport to="body">
      <div
        v-if="activeVideo"
        role="dialog"
        aria-modal="true"
        :aria-label="activeVideo.title"
        class="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        @click.self="activeVideo = null"
        @keydown.esc="activeVideo = null"
      >
        <div class="w-full max-w-3xl space-y-3">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-bold text-white font-display">{{ activeVideo.title }}</h3>
            <button
              type="button"
              class="tap-target flex items-center justify-center rounded-lg text-white hover:bg-white/15 transition-colors"
              @click="activeVideo = null"
            >
              <X class="w-6 h-6" aria-hidden="true" />
              <span class="sr-only">{{ t('common.close') }}</span>
            </button>
          </div>
          <video
            :src="activeVideo.videoUrl"
            controls
            autoplay
            class="w-full rounded-2xl bg-black aspect-video"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
