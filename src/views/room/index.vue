<template>
  <div class="room">
    <liveNav></liveNav>
    <div class="room__container">
      <div class="banner"></div>
      <div class="main">
        <div
          class="main__item"
          v-for="room in roomList"
          @click="goPull(room)"
        >
          <div class="main__video"></div>
          <div class="main__info">
            <div class="main__title">{{ room.title }}</div>
            <div class="main__time">{{ format(room.open_time) }}</div>
          </div>
          <a-button
            type="primary"
            class="main__btn"
            >进入直播</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import liveNav from '@/components/liveNav.vue';
import router from '@/router';

import { fetchRoomList } from '@/api/srs';
import { onMounted, ref } from 'vue';

const roomList = ref();
const getRoomList = async () => {
  const res = await fetchRoomList();
  roomList.value = res.data.data.list;
};

const format = (timestamp) => {
  return new Date(parseInt(timestamp) * 1000)
    .toLocaleString()
    .replace(/:\d{1,2}$/, ' ');
};

const goPull = (room) => {
  console.log(room.user_id);
  router.push({ path: '/pull', query: { user_id: room.user_id } });
};
onMounted(() => {
  getRoomList();
});
</script>

<style lang="scss" scoped>
.room__container {
  width: 100%;
  min-height: 785px;
  background-color: #e0e2e5;

  .banner {
    width: 100%;
    height: 110px;
    background: url('@/assets/img/roombanner.png') no-repeat;
    background-position: center;
    background-size: cover;
  }

  .main {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: 1350px;
    margin-top: 40px;
    .main__item {
      position: relative;
      width: 400px;
      height: 260px;
      margin-right: 40px;
      margin-bottom: 40px;
      cursor: pointer;
      .main__video {
        width: 400px;
        height: 230px;
        background: url('@/assets/img/item.png') no-repeat;
        background-position: center center;
        background-size: cover;
        border-radius: 20px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      }

      .main__info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        font-weight: 400;
        margin-top: 10px;
        margin-left: 5px;
        .main__time {
          font-size: 14px;
          margin-right: 10px;
        }
      }

      .main__btn {
        display: none;
        position: absolute;
        top: 40%;
        left: 38%;
      }

      &:hover .main__btn {
        display: block;
      }
    }
  }
}
</style>
