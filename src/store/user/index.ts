import { getUserInfoApi, loginApi, registerApi } from '@/api/user';
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    status: '',
    role_id: '',
    isLogin: false,
  }),
  actions: {
    async registerAction(username, password) {
      const registerRes = await registerApi({ username, password });
      if (registerRes.data.code === 200) {
        window.$message.success('注册成功');
      } else {
        window.$message.error('同名了，请更换用户名');
      }
    },

    async loginAction(username, password) {
      const loginRes = await loginApi({ username, password });
      if (loginRes.data.code === 200) {
        this.token = loginRes.data.token;
        localStorage.setItem('TOKEN', this.token);
        this.fetchUserInfoAction(this.token);
      } else {
        window.$message.error('用户名或密码不正确');
      }
    },

    async fetchUserInfoAction(token) {
      const userInfoRes = await getUserInfoApi({ token });
      if (userInfoRes.data.code === 200) {
        // window.$message.success('登录成功');
        this.isLogin = true;
        this.username = userInfoRes.data.data.username;
        this.status = userInfoRes.data.data.status;
        this.role_id = userInfoRes.data.data.role_id;
      } else {
        window.$message.error('请重新登录');
      }
    },
    loginoutAction() {
      this.isLogin = false;
      this.username = '';
      this.status = '';
      this.role_id = '';
      this.token = '';
      localStorage.removeItem('TOKEN');
      window.$message.success('成功退出');
    },
  },
});

export default useUserStore;
