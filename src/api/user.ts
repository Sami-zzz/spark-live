import axios from 'axios';
// 用户注册
export const registerApi = ({ username, password, address, email }) => {
  return axios.post('/api/user/register', {
    username,
    password,
    address,
    email,
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

export const updatePasswordApi = ({ id, userName, password, newPassword }) => {
  return axios.post('/api/user/update_password', {
    id,
    userName,
    password,
    newPassword,
  });
};
