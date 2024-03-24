<template>
  <liveNav></liveNav>
  <div class="pull">
    <div class="pull__main">
      <video
        class="pull-video"
        ref="pullVideoRef"
        autoplay
      ></video>

      <div class="gift"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRoom } from '@/api/srs';
import flvJs from 'flv.js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import liveNav from '../../components/liveNav.vue';
const pullVideoRef = ref<HTMLVideoElement>();
const route = useRoute();
const pullUrl = ref();

onMounted(async () => {
  let user_id = route.query.user_id as string;
  if (!user_id) {
    return;
  }
  let res = await fetchRoom(user_id);
  if (res.data.code === 200) {
    pullUrl.value = res.data.data.pull_url;
    playFlv();
  } else {
    window.$message.error('错误');
  }
});

function playFlv() {
  const flvPlayer = flvJs.createPlayer({
    type: 'flv',
    url: `${pullUrl.value}.flv`,
  });
  flvPlayer.attachMediaElement(pullVideoRef.value!);
  flvPlayer.load();
}
</script>

<style lang="scss" scoped>
.pull {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 740px;
  background-color: pink;
  width: 100%;

  .pull__main {
    background-color: #ccc;
    height: 650px;
    width: 1200px;
    .pull-video {
      width: 400px;
      height: 300px;
    }
  }
}
</style>
