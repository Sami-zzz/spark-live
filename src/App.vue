<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { router } from './router';

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login');
  }
});
</script>

<style lang="scss" scoped></style>
