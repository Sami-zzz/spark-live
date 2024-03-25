<template>
  <liveNav></liveNav>
  <div class="pull">
    <div class="pull__main">
      <div class="main__header">
        <div class="header__info">
          <div class="info__title">{{ title }}</div>
          <div class="info__name">{{ username }}的直播间</div>
        </div>
        <div class="header__time">{{ format(open_time) }}</div>
      </div>
      <video
        class="pull-video"
        ref="pullVideoRef"
        controls
        autoplay
      ></video>
    </div>
    <div class="gift__container"></div>
  </div>
</template>

<script setup lang="ts">
import { fetchRoom } from '@/api/srs';
import { findUserApi } from '@/api/user';
import flvJs from 'flv.js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import liveNav from '../../components/liveNav.vue';
const pullVideoRef = ref<HTMLVideoElement>();
const route = useRoute();
const pullUrl = ref();
const title = ref();
const open_time = ref();
const username = ref();
const pullVideo = async () => {
  let user_id = route.query.user_id as string;
  if (!user_id) {
    return;
  }
  let res = await fetchRoom(user_id);
  if (res.data.code === 200) {
    pullUrl.value = res.data.data.pull_url;
    title.value = res.data.data.title;
    open_time.value = res.data.data.open_time;
    playFlv();
  } else {
    window.$message.error('错误');
  }
};
const getUserInfo = async () => {
  let user_id = route.query.user_id as string;
  if (!user_id) {
    return;
  }
  let res = await findUserApi({ id: Number(user_id) });
  console.log(res);
  username.value = res.data.data.username;
};
function playFlv() {
  const flvPlayer = flvJs.createPlayer({
    type: 'flv',
    url: `${pullUrl.value}.flv`,
  });
  flvPlayer.attachMediaElement(pullVideoRef.value!);
  flvPlayer.load();
}

const format = (timestamp) => {
  return new Date(parseInt(timestamp) * 1000)
    .toLocaleString()
    .replace(/:\d{1,2}$/, ' ');
};

onMounted(() => {
  getUserInfo();
  pullVideo();
});
</script>

<style lang="scss" scoped>
.pull {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 740px;
  background: url('../../assets/img/live.jpg');
  width: 100%;

  .pull__main {
    background-color: #ccc;
    height: 650px;
    width: 1040px;
    border-radius: 10px;
    margin-right: 20px;

    .pull-video {
      border-radius: 0 0 10px 10px;
      width: 100%;
      height: 90%;
    }

    .main__header {
      height: 10%;
      background-color: #385178;
      z-index: 1000;
      border-radius: 10px 10px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      .header__info {
        margin-top: 5px;
        font-size: 20px;
        color: #fff;
        margin-left: 20px;
        .info__name {
          font-size: 14px;
          padding: 5px 0;
        }
      }
      .header__time {
        color: #fff;
        font-size: 16px;
      }
    }
  }

  .gift__container {
    height: 650px;
    width: 250px;
    border-radius: 10px;
    background-color: pink;
  }
}
</style>
