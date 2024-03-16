<template>
  <div class="app-wrap">
    <div>用户id:{{ userInfo?.id }}</div>
    <div>用户名:{{ userInfo?.username }}</div>
    <div>推流key:{{ userInfo?.push_key }}</div>
    <div
      class="url"
      @click="jump"
    >
      直播间链接:http://localhost:8000/pull?uid={{ userInfo?.id }}
    </div>
    <button @click="startRTC">开始直播</button>
    <video
      id="myVideo"
      ref="videoRef"
      muted
      autoplay
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchRtcV1Publish } from '@/api/srs';
import { getUserInfoApi } from '@/api/user';
import { IUser } from '@/interface';
import { WebRTCClass } from '@/network/webrtc';
import { router } from '@/router';

const rtc = ref<WebRTCClass>();
const videoRef = ref<HTMLVideoElement>();
const userInfo = ref<IUser>();
onMounted(async () => {
  let token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  let res = await getUserInfoApi({ token });
  if (res.data.code === 200) {
    userInfo.value = res.data.data;
  } else {
    localStorage.removeItem('token');
    router.push('/login');
  }
});

function jump() {
  let url = router.resolve(`/pull?uid=${userInfo.value?.id!}`);
  window.open(url.href);
}

async function getScreen() {
  const event = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  // 视频轨、音频轨
  // const audio = event.getAudioTracks();
  // const video = event.getVideoTracks();
  console.log('getDisplayMedia成功', event);
  videoRef.value?.addEventListener('loadstart', () => {
    console.warn('视频流-loadstart');
  });
  videoRef.value?.addEventListener('loadedmetadata', async () => {
    console.warn('视频流-loadedmetadata');
    event.getTracks().forEach((track) => {
      rtc.value?.peerConnection?.addTrack(track, event);
    });
    const offer = await rtc.value?.createOffer();
    if (!offer) return;
    await rtc.value?.setLocalDescription(offer);
    const res = await fetchRtcV1Publish({
      sdp: offer.sdp!,
      liveStreamName:
        userInfo.value?.push_url! +
        '?push_key=' +
        userInfo.value?.push_key +
        '&uid=' +
        userInfo.value?.id,
    });
    console.log(res.data);
    if (res.data.code !== 0) {
      console.error('srs没有返回spd');
      return;
    }
    await rtc.value?.setRemoteDescription(res.data.sdp);
  });
  videoRef.value!.srcObject = event;
}

function startRTC() {
  const webrtc = new WebRTCClass({ videoEl: videoRef.value! });
  rtc.value = webrtc;
  getScreen();
}
</script>

<style lang="scss" scoped>
.app-wrap {
  .url {
    color: red;
    cursor: pointer;
  }
  #myVideo {
    width: 700px;
  }
}
</style>
