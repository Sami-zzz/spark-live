import axios from 'axios';

// http://localhost:1985/
export const fetchRtcV1Publish = ({
  sdp,
  liveStreamName,
}: {
  sdp: string;
  liveStreamName: string;
}) => {
  return axios.post('/api/srs/rtcV1Publish', {
    streamurl: `${liveStreamName}`,
    sdp,
  });
};

export const fetchRoomList = () => {
  return axios.get('/api/srs/getroomlist');
};

export const fetchRoom = (user_id) => {
  return axios.post('/api/srs/getroom', {
    user_id: user_id,
  });
};
