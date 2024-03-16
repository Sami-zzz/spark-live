import { createRouter, createWebHashHistory } from 'vue-router';
export const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/login.vue') },
    { path: '/register', component: () => import('@/views/register.vue') },
    { path: '/pull', component: () => import('@/views/pull.vue') },
    { path: '/push', component: () => import('@/views/push.vue') },
  ],
});
