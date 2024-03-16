<template>
  <div class="live-nav">
    <div class="live-nav-left">
      <div class="logo">
        <img
          src="@/assets/img/logo.png"
          alt=""
        />
      </div>
      <div class="nav">
        <ul>
          <li>首页</li>
        </ul>
      </div>
    </div>
    <div class="live-nav-right">
      <div class="startlive">
        <a-button
          type="primary"
          @click="startMyLive"
          >我 要 开 播</a-button
        >
      </div>

      <ul class="user">
        <li @click="handleLoginClick">登录</li>
        <a-modal
          v-model:open="loginModalOpen"
          title="登录"
          @ok="login"
        >
        </a-modal>
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
            @finishFailed="handleRegisterFinishFailed"
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
              <a-input-password v-model:value="registerForm.confirmPassword" />
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
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/user';
import type { Rule } from 'ant-design-vue/es/form';
import { reactive, ref } from 'vue';
const registerModalOpen = ref<boolean>(false);
const loginModalOpen = ref<boolean>(false);

const registerFormRef = ref();
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

const userStore = useUserStore();

const handleLoginClick = () => {
  loginModalOpen.value = true;
};
const login = () => {
  alert('登录');
};

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
const handleRegisterFinishFailed = (errors) => {};

const resetRegisterForm = () => {
  registerFormRef.value.resetFields();
};

const startMyLive = () => {
  alert('我要开播');
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
      li {
        cursor: pointer;
      }
    }
  }
  .live-nav-right {
    display: flex;
    .startlive {
      margin-right: 50px;
      button {
        width: 130px;
        height: 50px;
        font-size: 20px;
      }
    }
    .user {
      display: flex;
      margin-right: 50px;
      width: 140px;
      justify-content: space-evenly;

      li {
        cursor: pointer;
      }
    }
  }

  .ant-modal-title {
    font-size: 20px;
    color: red;
  }
}
</style>
