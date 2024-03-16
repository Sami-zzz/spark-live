<template>
  <div>
    看直播

    <video
      id="pullVideo"
      ref="pullVideoRef"
      muted
      autoplay
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { findUserApi } from '@/api/user';
import flvJs from 'flv.js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pullVideoRef = ref<HTMLVideoElement>();
const pullUrl = ref();
onMounted(async () => {
  let uid = route.query.uid as string;
  if (!uid) {
    return;
  }
  let res = await findUserApi({ id: Number(uid) });
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
#pullVideo {
  width: 500px;
}
</style>
