<template>
  <div class="home">
    <liveNav></liveNav>
    <div class="home-banner">
      <div class="home-main">
        <div class="home-main-left">
          <li
            class="first-video"
            @click="goPull(roomList[0])"
          >
            <video
              class="pull-video"
              ref="pullVideoRef"
              controls
              autoplay
              muted
            ></video>
            <a-button
              type="primary"
              ghost
              class="btn"
              >进入直播</a-button
            >
          </li>
        </div>
        <ul class="home-main-right">
          <li
            v-for="(room, index) in otherList"
            :key="index"
            @click="goPull(room)"
          >
            <a-button
              type="primary"
              ghost
              class="btn"
              >进入直播</a-button
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRoomList } from '@/api/srs';
import liveNav from '@/components/liveNav.vue';
import router from '@/router';
import flvJs from 'flv.js';
import { onMounted, ref } from 'vue';

const pullVideoRef = ref<HTMLVideoElement>();
let roomList = [] as any;
let otherList = ref([]);
const getRoomList = async () => {
  const res = await fetchRoomList();
  roomList = res.data.data.list;
  return roomList;
};

function playFlv() {
  const flvPlayer = flvJs.createPlayer({
    type: 'flv',
    url: `${roomList[0].pull_url}.flv`,
  });
  flvPlayer.attachMediaElement(pullVideoRef.value!);
  flvPlayer.load();
}
onMounted(async () => {
  roomList = await getRoomList();
  otherList.value = JSON.parse(JSON.stringify(roomList));
  otherList.value.shift();
  console.log(otherList.value);
  playFlv();
});

const goPull = (room) => {
  console.log(room.user_id);
  router.push({ path: '/pull', query: { user_id: room.user_id } });
};
</script>

<style scoped lang="scss">
.home-banner {
  height: 740px;
  background: url('@/assets/img/banner.jpg');
  padding-top: 40px;
  .home-main {
    height: 650px;
    width: 1300px;
    margin: 0 auto;

    display: flex;
    justify-content: space-between;
    .home-main-left {
      width: 1030px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      .first-video {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        position: relative;
        cursor: pointer;
        .pull-video {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        .btn {
          display: none;
          position: absolute;
          top: 45%;
          left: 45%;
          width: 150px;
          height: 50px;
        }

        &:hover .btn {
          display: block;
        }
      }
    }

    .home-main-right {
      width: 250px;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 10px;
      border-radius: 8px;
      li {
        width: 220px;
        height: 114px;
        background: url('../../assets/img/item.png');
        border-radius: 4px;
        position: relative;

        .btn {
          display: none;
          position: absolute;
          top: 40%;
          left: 32%;
          width: 80px;
          height: 30px;
        }

        &:hover .btn {
          display: block;
        }
      }
    }
  }
}
</style>
