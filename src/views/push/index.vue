<template>
  <div class="push">
    <liveNav></liveNav>
    <div class="push-main">
      <div class="push-video">
        <video
          class="live-video"
          id="myVideo"
          ref="videoRef"
          muted
          autoplay
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRtcV1Publish } from '@/api/srs';
import liveNav from '@/components/liveNav.vue';
import { WebRTCClass } from '@/network/webrtc';
import useUserStore from '@/store/user';
import { onMounted, ref } from 'vue';
const userStore = useUserStore();
const rtc = ref<WebRTCClass>();
const videoRef = ref<HTMLVideoElement>();

// webrtc推流
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
    // userStore.isLive = true;
    event.getTracks().forEach((track) => {
      rtc.value?.peerConnection?.addTrack(track, event);
    });
    const offer = await rtc.value?.createOffer();
    if (!offer) return;
    await rtc.value?.setLocalDescription(offer);
    const res = await fetchRtcV1Publish({
      sdp: offer.sdp!,
      liveStreamName:
        userStore.push_url +
        '?push_key=' +
        userStore.push_key +
        '&uid=' +
        userStore.id,
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

onMounted(() => {
  startRTC();
});
</script>

<style lang="scss" scoped>
.push-main {
  height: 740px;
  background: url('@/assets/img/bg.png');

  .push-video {
    height: 650px;
    width: 1400px;
    margin: 0 auto;
    .live-video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
