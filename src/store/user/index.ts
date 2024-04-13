import { getUserInfoApi, loginApi, registerApi } from '@/api/user';
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    id: 0,
    username: '',
    status: '',
    role_id: '',
    push_url: '',
    push_key: '',

    isLogin: false,
    isLive: false,
  }),
  actions: {
    async registerAction(username, password, address, email) {
      const registerRes = await registerApi({
        username,
        password,
        address,
        email,
      });
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
        this.isLogin = true;
        this.id = userInfoRes.data.data.id;
        this.username = userInfoRes.data.data.username;
        this.status = userInfoRes.data.data.status;
        this.role_id = userInfoRes.data.data.role_id;
        this.push_url = userInfoRes.data.data.push_url;
        this.push_key = userInfoRes.data.data.push_key;
      } else {
        window.$message.error('请重新登录');
      }
    },
    loginoutAction() {
      this.isLogin = false;
      this.id = 0;
      this.username = '';
      this.status = '';
      this.role_id = '';
      this.token = '';
      this.push_url = '';
      this.push_key = '';
      localStorage.removeItem('TOKEN');
      window.$message.success('成功退出');
    },
  },
});

export default useUserStore;
