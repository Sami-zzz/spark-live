<template>
  <div class="push">
    <liveNav @open-in-this-route="openLiveForm"></liveNav>
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
    <a-button
      type="primary"
      v-if="userStore.isLive"
      @click="stopLive"
      class="stop-btn"
      >关闭直播</a-button
    >
    <a-modal
      v-model:open="liveModalOpen"
      title="输入直播间标题"
    >
      <a-form
        ref="loginFormRef"
        :model="liveForm"
        name="live"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="handleLiveFinish"
      >
        <a-form-item
          has-feedback
          name="title"
          :rules="[{ required: true, message: '请输入直播间标题！' }]"
        >
          <a-input v-model:value="liveForm.title" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 16, offset: 14 }">
          <a-button
            type="primary"
            html-type="submit"
            >开播</a-button
          >
        </a-form-item>
      </a-form>
      <template #footer></template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { fetchRtcV1Publish } from '@/api/srs';
import liveNav from '@/components/liveNav.vue';
import { WebRTCClass } from '@/network/webrtc';
import router from '@/router';
import useUserStore from '@/store/user';
import { onMounted, reactive, ref } from 'vue';
const userStore = useUserStore();
const rtc = ref<WebRTCClass>();
const videoRef = ref<HTMLVideoElement>();

// 直播标题表单
const liveModalOpen = ref(false);
const liveForm = reactive({
  title: '',
});

const openLiveForm = () => {
  liveModalOpen.value = true;
};
const handleLiveFinish = () => {
  liveModalOpen.value = false;
  startRTC();
};
// webrtc推流方法
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
    userStore.isLive = true;
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
        '&title=' +
        liveForm.title +
        '&uid=' +
        userStore.id,
    });
    console.log(res.data);
    if (res.data.code !== 0) {
      console.error('srs没有返回spd');
      window.$message.error('开播失败');
      router.push('./');
      return;
    }
    await rtc.value?.setRemoteDescription(res.data.sdp);
  });
  videoRef.value!.srcObject = event;
}

// 执行webrtc推流
function startRTC() {
  const webrtc = new WebRTCClass({ videoEl: videoRef.value! });
  rtc.value = webrtc;
  getScreen();
}

const stopLive = () => {
  userStore.isLive = false;
  rtc.value?.peerConnection?.close();
  let tracks = videoRef.value!.srcObject!.getTracks();
  tracks.forEach((track) => track.stop());
  videoRef.value!.srcObject = null;
  window.$message.success('直播结束');
  router.push('/');
};

onMounted(() => {
  openLiveForm();
});
</script>

<style lang="scss" scoped>
.push-main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 740px;
  background-color: pink;
  width: 100%;
  .push-video {
    background-color: #ccc;
    height: 650px;
    width: 1200px;
    .live-video {
      width: 100%;
      height: 100%;
    }
  }
}

.stop-btn {
  position: fixed;
  top: 30px;
  right: 400px;
}
</style>
