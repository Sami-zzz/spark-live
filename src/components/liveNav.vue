<template>
  <div class="live-nav">
    <div class="live-nav-left">
      <div
        class="logo"
        @click="goHome"
      >
        <img
          src="@/assets/img/logo.png"
          alt=""
        />
      </div>
      <div class="nav">
        <ul>
          <li @click="goHome">首页</li>
          <li @click="goRoom">全部直播</li>
          <li
            v-if="userStore.isLogin"
            @click="goCenter"
          >
            个人中心
          </li>
        </ul>
      </div>
    </div>
    <div class="live-nav-right">
      <div
        class="live-button"
        v-if="!userStore.isLive"
      >
        <a-button
          type="primary"
          @click="startMyLive"
          >我 要 开 播</a-button
        >
      </div>
      <ul class="user">
        <div
          class="user-login"
          v-if="!userStore.isLogin"
        >
          <!-- 登录模块 -->
          <li @click="handleLoginClick">登录</li>
          <a-modal
            v-model:open="loginModalOpen"
            title="登录"
          >
            <a-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              name="login"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
              @finish="handleLoginFinish"
            >
              <a-form-item
                has-feedback
                label="用户名"
                name="username"
              >
                <a-input v-model:value="loginForm.username" />
              </a-form-item>

              <a-form-item
                has-feedback
                label="密码"
                name="password"
              >
                <a-input-password v-model:value="loginForm.password" />
              </a-form-item>

              <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
                <a-button
                  @click="resetLoginForm"
                  style="margin-right: 10px"
                  >重置</a-button
                >
                <a-button
                  type="primary"
                  html-type="submit"
                  >登录</a-button
                >
              </a-form-item>
            </a-form>
            <template #footer></template>
          </a-modal>
          <!-- 注册模块 -->
          <li @click="handleRegisterClick">注册</li>
          <a-modal
            v-model:open="registerModalOpen"
            title="注册"
          >
            <a-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="rules"
              name="register"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
              @finish="handleRegisterFinish"
            >
              <a-form-item
                has-feedback
                label="用户名"
                name="username"
              >
                <a-input v-model:value="registerForm.username" />
              </a-form-item>

              <a-form-item
                has-feedback
                label="密码"
                name="password"
              >
                <a-input-password v-model:value="registerForm.password" />
              </a-form-item>

              <a-form-item
                label="确认密码"
                name="confirmPassword"
              >
                <a-input-password
                  v-model:value="registerForm.confirmPassword"
                />
              </a-form-item>

              <a-form-item :wrapper-col="{ span: 16, offset: 4 }">
                <a-button
                  @click="resetRegisterForm"
                  style="margin-right: 10px"
                  >重置</a-button
                >
                <a-button
                  type="primary"
                  html-type="submit"
                  >注册</a-button
                >
              </a-form-item>
            </a-form>
            <template #footer></template>
          </a-modal>
        </div>
        <div
          class="user-info"
          v-if="userStore.isLogin"
        >
          欢迎回来 {{ username }}
          <a-button
            type="primary"
            style="margin-left: 20px"
            @click="loginout"
            >退出登录</a-button
          >
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import useUserStore from '@/store/user';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, reactive, ref } from 'vue';

const userStore = useUserStore();
const username = computed(() => {
  return userStore.username;
});

// 登录模块
//
//
const loginModalOpen = ref<boolean>(false);
const loginFormRef = ref();
const loginForm = reactive({
  username: '',
  password: '',
});

// 登录表单校验
const checkLoginUsername = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入用户名');
  }
  return Promise.resolve();
};

const checkLoginPassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入密码');
  }
  return Promise.resolve();
};

const loginRules: Record<string, Rule[]> = {
  username: [
    { required: true, validator: checkLoginUsername, trigger: 'change' },
  ],
  password: [
    { required: true, validator: checkLoginPassword, trigger: 'change' },
  ],
};

const handleLoginClick = () => {
  loginModalOpen.value = true;
};

const handleLoginFinish = (values) => {
  const { username, password } = values;
  userStore.loginAction(username, password);
  loginModalOpen.value = false;
  loginFormRef.value.resetFields();
};

// 重置
const resetLoginForm = () => {
  loginFormRef.value.resetFields();
};

// 退出登录
const loginout = () => {
  userStore.loginoutAction();
};

//
// 注册模块
//
const registerModalOpen = ref<boolean>(false);
const registerFormRef = ref();
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});
const handleRegisterClick = () => {
  registerModalOpen.value = true;
};

// 注册表单校验
const checkUsername = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入用户名');
  }
  if (value.length > 18 || value.length < 3) {
    return Promise.reject('用户名长度3-18');
  }
  return Promise.resolve();
};

const checkPassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入密码');
  }
  if (value.length > 30 || value.length < 6) {
    return Promise.reject('密码长度6-30');
  }
  return Promise.resolve();
};

const checkConfirmPassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入确认密码');
  } else if (value !== registerForm.password) {
    return Promise.reject('两次密码不匹配');
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  username: [{ required: true, validator: checkUsername, trigger: 'change' }],
  password: [{ required: true, validator: checkPassword, trigger: 'change' }],
  confirmPassword: [
    { required: true, validator: checkConfirmPassword, trigger: 'change' },
  ],
};

// 执行注册
const handleRegisterFinish = (values) => {
  const { username, password } = values;
  userStore.registerAction(username, password);
  registerModalOpen.value = false;
  registerFormRef.value.resetFields();
};

const resetRegisterForm = () => {
  registerFormRef.value.resetFields();
};

const startMyLive = () => {
  if (!userStore.isLogin) {
    window.$message.error('请先登录');
  } else if (router.currentRoute.value.fullPath == '/push') {
    // router.push('/push');
    console.log('调用开播');
    emit('openInThisRoute');
  } else {
    router.push('/push');
  }
};

const emit = defineEmits(['openInThisRoute']);

const goHome = () => {
  router.push('/');
};

const goRoom = () => {
  router.push('/room');
};

const goCenter = () => {
  router.push('/center');
};
</script>

<style scoped lang="scss">
.live-nav {
  height: 84px;

  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 20px;
  line-height: 84px;
  .live-nav-left {
    display: flex;
    .logo img {
      width: 230px;
      cursor: pointer;
    }
    .nav {
      ul {
        display: flex;
        li {
          padding: 0 40px;
          cursor: pointer;
          &:hover {
            border-bottom: 3px solid #f80a43;
            color: #f80a43;
          }
        }
      }
    }
  }
  .live-nav-right {
    display: flex;
    .live-button {
      margin-right: 50px;
      button {
        width: 130px;
        height: 50px;
        font-size: 20px;
      }
    }
    .user {
      width: 300px;
      .user-login {
        display: flex;
        margin-right: 50px;
        width: 140px;
        justify-content: space-evenly;

        li {
          cursor: pointer;
        }
      }
    }
  }

  .ant-modal-title {
    font-size: 20px;
    color: red;
  }
}
</style>
