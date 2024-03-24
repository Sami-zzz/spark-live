import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/push',
    name: 'push',
    component: () => import('@/views/push/index.vue'),
  },
  {
    path: '/room',
    name: 'room',
    component: () => import('@/views/room/index.vue'),
  },
  {
    path: '/pull',
    name: 'pull',
    component: () => import('@/views/pull/index.vue'),
  },
];

const router = createRouter({
  routes: [
    ...defaultRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/notFound.vue'),
    },
  ],
  history: createWebHistory(),
});

export default router;
