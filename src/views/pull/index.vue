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
    <div class="gift__container">
      <div class="gift__header">为喜爱的主播送出礼物</div>
      <ul>
        <li
          class="gift-item"
          @click="showModal(1, '小花花', 1)"
        >
          <img
            src="../../assets/img/gift/1.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">小花花</div>
            <div class="gift-price">1金币</div>
          </div>
        </li>
        <li
          class="gift-item"
          @click="showModal(2, '牛哇牛哇', 10)"
        >
          <img
            src="../../assets/img/gift/2.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">牛哇牛哇</div>
            <div class="gift-price">10金币</div>
          </div>
        </li>
        <li
          class="gift-item"
          @click="showModal(3, '666', 66)"
        >
          <img
            src="../../assets/img/gift/3.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">666</div>
            <div class="gift-price">66金币</div>
          </div>
        </li>
        <li
          class="gift-item"
          @click="showModal(4, '高能预警', 100)"
        >
          <img
            src="../../assets/img/gift/4.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">高能预警</div>
            <div class="gift-price">100金币</div>
          </div>
        </li>
        <li
          class="gift-item"
          @click="showModal(5, '超级跑车', 300)"
        >
          <img
            src="../../assets/img/gift/5.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">超级跑车</div>
            <div class="gift-price">300金币</div>
          </div>
        </li>
        <li
          class="gift-item"
          @click="showModal(6, '次元之城', 1000)"
        >
          <img
            src="../../assets/img/gift/6.png"
            alt=""
          />
          <div class="gift-info">
            <div class="gift-title">次元之城</div>
            <div class="gift-price">1000金币</div>
          </div>
        </li>
      </ul>
      <a-modal
        v-model:open="giftOpen"
        title="确定送礼"
        @ok="handleGift"
        class="gift-modal"
      >
        <p class="gift-modal__content">
          您确定要送出<span>{{ currentGiftName }}</span
          >吗, 价值<span>{{ currentPrice }}金币</span>
        </p>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendGiftApi } from '@/api/order';
import { fetchRoom } from '@/api/srs';
import { findUserApi } from '@/api/user';
import useUserStore from '@/store/user';
import flvJs from 'flv.js';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import liveNav from '../../components/liveNav.vue';
const userStore = useUserStore();
const pullVideoRef = ref<HTMLVideoElement>();
const route = useRoute();
const pullUrl = ref();
const title = ref();
const open_time = ref();
const username = ref();
const giftOpen = ref(false);
const currentGiftId = ref();
const currentGiftName = ref();
const currentPrice = ref();
const liveId = ref();
// 拉流
const pullVideo = async () => {
  let user_id = route.query.user_id as string;
  liveId.value = user_id;
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
// 主播信息
const getUserInfo = async () => {
  let user_id = route.query.user_id as string;
  if (!user_id) {
    return;
  }
  let res = await findUserApi({ id: Number(user_id) });
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
  const opentime = moment(parseInt(timestamp)).format('YYYY-MM-DD HH:mm:ss');
  return opentime;
};
// 点击送礼
const showModal = (giftId, giftName, price) => {
  currentGiftName.value = giftName;
  currentGiftId.value = giftId;
  currentPrice.value = price;
  giftOpen.value = true;
};

const handleGift = () => {
  sendGift();
  giftOpen.value = false;
};

const sendGift = async () => {
  const res = await sendGiftApi({
    user_id: userStore.id,
    live_id: liveId.value,
    gift_id: currentGiftId.value,
    gift_name: currentGiftName.value,
    price: currentPrice.value,
  });
  if (res.data.code == 200) {
    window.$message.success('成功送出');
  } else {
    window.$message.error('送礼失败');
  }
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
      background-color: #121750;
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
    background-color: #121750;
    overflow: hidden;

    .gift__header {
      height: 50px;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      background-color: #121750;
      line-height: 50px;
      text-align: center;
    }

    .gift-item {
      margin: 0 auto;
      margin-top: 10px;
      height: 88px;
      width: 90%;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      cursor: pointer;

      align-items: center;
      border: 2px solid #121750;
      img {
        width: 70px;
        height: 70px;
        margin-left: 20px;
        border-radius: 5px;
      }

      .gift-info {
        margin-left: 25px;
        .gift-title {
          font-size: 18px;
          color: #fff;
          padding-bottom: 5px;
        }
        .gift-price {
          font-size: 16px;
          color: #999;
        }
      }

      &:hover {
        border: #d44e7d 2px solid;
        .gift-title {
          color: #d44e7d;
        }
      }
    }
  }
}
.gift-modal {
  .gift-modal__content {
    font-size: 16px;
    span {
      color: #d44e7d;
    }
  }
}
</style>
