<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import SkipLink from './SkipLink.vue'
import MiniMascot from './MiniMascot.vue'
import VolunteerModal from '../modals/VolunteerModal.vue'
import { fetchRegions } from '@/lib/api/services'
import type { SelectListItemDto } from '@/lib/api/types'

const regions = ref<SelectListItemDto[]>([])

onMounted(async () => {
  regions.value = await fetchRegions()
})
</script>

<template>
  <!--
    `--page-bg`, `--surface` EMAS. `--surface` — kartochkaning oq rangi;
    uni shu yerga qo'yish sahifaning iliq qog'oz fonini bosib qo'yardi va
    kartochkalar fondan ajralmay qolardi.
  -->
  <div class="flex min-h-[100dvh] flex-col bg-[var(--page-bg)] text-[var(--fg)]">
    <SkipLink />
    <Header />
    <!--
      `min-height` — footer HAR DOIM birinchi ekrandan pastda qolishi uchun.
      `flex-1` ning o'zi footerni sahifa pastiga bosadi, lekin kontent kam
      bo'lgan sahifalarda (masalan «Loyiha haqida») u baribir birinchi ekranga
      chiqib qolardi: sayt tugagandek taassurot berardi. Ekran balandligidan
      header ayiriladi, shuning uchun header + main aynan bir ekran bo'ladi.
    -->
    <main
      id="main-content"
      class="flex-1 min-h-[calc(100dvh-var(--header-height))]"
    >
      <router-view />
    </main>
    <Footer />
    <VolunteerModal :regions="regions" />
    <MiniMascot />
  </div>
</template>
