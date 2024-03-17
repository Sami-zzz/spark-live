import axios from 'axios';
// 用户注册
export const registerApi = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return axios.post('/api/user/register', {
    username,
    password,
  });
};

// 用户登录
export const loginApi = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return axios.post('/api/user/login', {
    username,
    password,
  });
};

// 获取用户信息
export const getUserInfoApi = ({ token }: { token: string }) => {
  return axios.post('/api/user/get_user_info', {
    token,
  });
};

export const findUserApi = ({ id }: { id: number }) => {
  return axios.get('/api/user/find/' + id);
};
