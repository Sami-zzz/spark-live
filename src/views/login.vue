<template>
  <div>
    <h1>登录页</h1>
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
      <n-button @click="login">登录</n-button>
      <n-button @click="router.push('/register')">去注册</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginApi } from '@/api/user';
import router from '@/router';
import { reactive } from 'vue';

const from = reactive({
  username: 'admin',
  password: '123456',
});

async function login() {
  let res = await loginApi(from);
  if (res.data.code !== 200) {
    window.$message.error('登录失败');
  } else {
    localStorage.setItem('token', res.data.token);
    router.push('/push');
    window.$message.success('登录成功');
  }
  console.log(res.data);
}
</script>

<style lang="scss" scoped></style>
