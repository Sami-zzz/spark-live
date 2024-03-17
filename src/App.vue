<template>
  <n-message-provider>
    <a-config-provider
      :locale="zhCN"
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
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { onMounted } from 'vue';
import useUserStore from './store/user';
const userStore = useUserStore();
onMounted(() => {
  if (localStorage.getItem('TOKEN')) {
    userStore.token = localStorage.getItem('TOKEN') as string;
    userStore.fetchUserInfoAction(userStore.token);
  }
});
</script>

<style lang="scss" scoped></style>
