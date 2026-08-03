import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { i18n, type Locale } from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/:locale(uz|ru|en)?',
    component: () => import('@/components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'about-project',
        name: 'about-project',
        component: () => import('@/views/AboutProjectView.vue'),
      },
      {
        path: 'about-us',
        name: 'about-us',
        component: () => import('@/views/AboutUsView.vue'),
      },
      {
        path: 'accessibility',
        name: 'accessibility',
        component: () => import('@/views/AccessibilityView.vue'),
      },
      {
        path: 'become-volunteer',
        name: 'become-volunteer',
        component: () => import('@/views/BecomeVolunteerView.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/ContactView.vue'),
      },
      // Kids
      {
        path: 'etiquette',
        name: 'etiquette',
        component: () => import('@/views/EtiquetteView.vue'),
      },
      {
        path: 'etiquette/tests',
        name: 'etiquette-tests',
        component: () => import('@/views/EtiquetteTestsView.vue'),
      },
      {
        path: 'etiquette/:id',
        name: 'etiquette-detail',
        component: () => import('@/views/EtiquetteDetailView.vue'),
      },
      {
        path: 'i-can-do-it',
        name: 'i-can-do-it',
        component: () => import('@/views/ICanView.vue'),
      },
      {
        path: 'i-can-do-it/:id',
        name: 'i-can-do-it-detail',
        component: () => import('@/views/ICanDetailView.vue'),
      },
      {
        path: 'lessons',
        name: 'lessons',
        component: () => import('@/views/LessonsView.vue'),
      },
      {
        path: 'lessons/:id',
        name: 'lessons-detail',
        component: () => import('@/views/LessonDetailView.vue'),
      },
      {
        path: 'books',
        name: 'books',
        component: () => import('@/views/BooksView.vue'),
      },
      {
        path: 'books/:id',
        name: 'books-detail',
        component: () => import('@/views/BookDetailView.vue'),
      },
      {
        path: 'books/:id/read',
        name: 'books-read',
        component: () => import('@/views/BookReaderView.vue'),
      },
      {
        path: 'comics',
        name: 'comics',
        component: () => import('@/views/ComicsView.vue'),
      },
      {
        path: 'comics/:id',
        name: 'comics-detail',
        component: () => import('@/views/ComicDetailView.vue'),
      },
      {
        path: 'comics/:id/read',
        name: 'comics-read',
        component: () => import('@/views/ComicReaderView.vue'),
      },
      {
        path: 'vocabulary',
        name: 'vocabulary',
        component: () => import('@/views/VocabularyView.vue'),
      },
      {
        path: 'vocabulary/:topicId',
        name: 'vocabulary-topic',
        component: () => import('@/views/VocabularyTopicView.vue'),
      },
      {
        path: 'vocabulary/:topicId/test',
        name: 'vocabulary-test',
        component: () => import('@/views/VocabularyTestView.vue'),
      },
      {
        path: 'tests',
        name: 'tests',
        component: () => import('@/views/TestsView.vue'),
      },
      {
        path: 'tests/:id',
        name: 'tests-detail',
        component: () => import('@/views/TestDetailView.vue'),
      },
      // Parents
      {
        path: 'for-parents',
        name: 'for-parents',
        component: () => import('@/views/ForParentsView.vue'),
      },
      {
        path: 'for-parents/articles',
        name: 'for-parents-articles',
        component: () => import('@/views/ParentsArticlesView.vue'),
      },
      {
        path: 'for-parents/articles/:id',
        name: 'for-parents-articles-detail',
        component: () => import('@/views/ParentContentDetailView.vue'),
        meta: { backTo: '/for-parents/articles' },
      },
      {
        path: 'for-parents/videos',
        name: 'for-parents-videos',
        component: () => import('@/views/ParentsVideosView.vue'),
      },
      {
        path: 'for-parents/videos/:id',
        name: 'for-parents-videos-detail',
        component: () => import('@/views/ParentContentDetailView.vue'),
        meta: { backTo: '/for-parents/videos' },
      },
      {
        path: 'for-parents/legal',
        name: 'for-parents-legal',
        component: () => import('@/views/ParentsLegalView.vue'),
      },
      {
        path: 'for-parents/legal/:id',
        name: 'for-parents-legal-detail',
        component: () => import('@/views/ParentContentDetailView.vue'),
        meta: { backTo: '/for-parents/legal' },
      },
      {
        path: 'for-parents/home-education',
        name: 'for-parents-home-education',
        component: () => import('@/views/ParentsHomeEdView.vue'),
      },
      {
        path: 'for-parents/home-education/:id',
        name: 'for-parents-home-education-detail',
        component: () => import('@/views/ParentContentDetailView.vue'),
        meta: { backTo: '/for-parents/home-education' },
      },
      {
        path: 'for-parents/onboarding',
        name: 'for-parents-onboarding',
        component: () => import('@/views/ParentsOnboardingView.vue'),
      },
      {
        path: 'for-parents/presentation',
        name: 'for-parents-presentation',
        component: () => import('@/views/ParentsPresentationView.vue'),
      },
      {
        path: 'for-parents/tests',
        name: 'for-parents-tests',
        component: () => import('@/views/ParentsTestsView.vue'),
      },
      {
        path: 'for-parents/tests/:id',
        name: 'for-parents-tests-detail',
        component: () => import('@/views/ParentTestDetailView.vue'),
      },
      // Volunteers
      {
        path: 'volunteers',
        name: 'volunteers',
        component: () => import('@/views/VolunteersView.vue'),
      },
      {
        path: 'volunteers/:caseId',
        name: 'volunteer-detail',
        component: () => import('@/views/VolunteerDetailView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const paramLocale = to.params.locale as string | undefined
  if (paramLocale && ['uz', 'ru', 'en'].includes(paramLocale)) {
    i18n.global.locale.value = paramLocale as Locale
  }
  next()
})

export default router
