import { registerApi } from '@/api/user';
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    password: '',
    status: '',
    role_id: '',
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

    login() {},
    logout() {},
  },
});

export default useUserStore;
