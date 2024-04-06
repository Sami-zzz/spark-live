import axios from 'axios';

export const sendGiftApi = ({
  user_id,
  live_id,
  gift_id,
  gift_name,
  price,
}) => {
  return axios.post('/api/order/new_order', {
    user_id,
    live_id,
    gift_id,
    gift_name,
    price,
  });
};

export const mysendGiftApi = ({ user_id }) => {
  return axios.post('/api/order/get_send_order', {
    user_id,
  });
};

export const myliveGiftApi = ({ live_id }) => {
  return axios.post('/api/order/get_my_order', {
    live_id,
  });
};
