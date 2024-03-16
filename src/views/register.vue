<template>
  <div>
    <h1>注册页</h1>
    <div>
      <n-input
        v-model:value="from.username"
        type="text"
        placeholder="用户名"
      />
      <n-input
        v-model:value="from.password"
        type="text"
        placeholder="密码"
      />
      <n-button @click="login">注册</n-button>
      <n-button @click="router.push('/login')">去登录</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { registerApi } from '@/api/user';
import router from '@/router';
import { reactive } from 'vue';

const from = reactive({
  username: 'admin',
  password: '123456',
});

async function login() {
  let res = await registerApi(from);
  if (res.data.code === 200) {
    window.$message.success('注册成功');
  } else {
    window.$message.error('注册失败');
  }
}
</script>

<style lang="scss" scoped></style>
