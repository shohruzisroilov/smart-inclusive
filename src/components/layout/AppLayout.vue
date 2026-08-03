<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import SkipLink from './SkipLink.vue'
import TrustNumberBar from './TrustNumberBar.vue'
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
  <div class="min-h-screen flex flex-col bg-[var(--surface)] text-[var(--fg)]">
    <SkipLink />
    <TrustNumberBar />
    <Header />
    <main id="main-content" class="flex-1">
      <router-view />
    </main>
    <Footer />
    <VolunteerModal :regions="regions" />
    <MiniMascot />
  </div>
</template>
