import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
// Shriftlar CSS'dan EMAS, shu yerdan import qilinadi.
// `globals.css` ichida `@import` qilinganda ular Tailwind'ning PostCSS
// bosqichidan o'tib ketardi va `url(./files/*.woff2)` yo'llari qayta
// yozilmasdan qolardi — natijada build'ga birorta shrift fayli
// tushmay, sayt tizim shriftlariga qaytardi.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/800.css'
import './styles/globals.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
