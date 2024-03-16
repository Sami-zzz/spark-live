<template>
  <n-message-provider>
    <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#f80a43',
        },
      }"
    >
      <router-view></router-view>
    </a-config-provider>
  </n-message-provider>
</template>

<script lang="ts" setup>
// onMounted(() => {
//   if (!localStorage.getItem('token')) {
//     router.push('/login');
//   }
// });
</script>

<style lang="scss" scoped></style>
