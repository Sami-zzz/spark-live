<template>
  <div class="center">
    <liveNav></liveNav>
    <div class="center__container">
      <div class="center__main">
        <a-tabs
          v-model:activeKey="activeKey"
          size="large"
        >
          <a-tab-pane
            key="1"
            tab="修改密码"
          >
            <a-form
              :model="formState"
              ref="formRef"
              name="basic"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 16 }"
              autocomplete="off"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
              class="passwordForm"
            >
              <a-form-item
                label="用户名"
                name="username"
                :rules="[{ required: true, message: '请输入用户名' }]"
              >
                <a-input v-model:value="formState.username" />
              </a-form-item>

              <a-form-item
                label="旧密码"
                name="password"
                :rules="[{ required: true, message: '请输入旧密码' }]"
              >
                <a-input-password v-model:value="formState.password" />
              </a-form-item>
              <a-form-item
                label="新密码"
                name="newPassword"
                :rules="[{ required: true, message: '请输入新密码!' }]"
              >
                <a-input-password v-model:value="formState.newPassword" />
              </a-form-item>

              <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
                <a-button
                  type="primary"
                  html-type="submit"
                  >修改密码</a-button
                >
                <a-button
                  style="margin-left: 10px"
                  @click="resetForm"
                  >重置</a-button
                >
              </a-form-item>
            </a-form></a-tab-pane
          >
          <a-tab-pane
            key="2"
            tab="我的送礼"
            force-render
          >
            <a-list
              item-layout="horizontal"
              :data-source="sendGiftData"
              class="sendgift__container"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <span class="gift-span">{{ item.liveName }}</span>
                  <span class="gift-span">{{ item.giftName }}</span>
                  <span class="gift-span">{{ item.price }}</span>
                  <span class="gift-span">{{ item.sendTime }}</span>
                </a-list-item>
              </template>
            </a-list></a-tab-pane
          >
          <a-tab-pane
            key="3"
            tab="我的礼物"
          >
            <a-list
              item-layout="horizontal"
              :data-source="myGiftData"
              class="mygift__container"
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <span class="gift-span">{{ item.userName }}</span>
                  <span class="gift-span">{{ item.giftName }}</span>
                  <span class="gift-span">{{ item.price }}</span>
                  <span class="gift-span">{{ item.sendTime }}</span>
                </a-list-item>
              </template>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { myliveGiftApi, mysendGiftApi } from '@/api/order';
import { findUserApi, updatePasswordApi } from '@/api/user';
import liveNav from '@/components/liveNav.vue';
import router from '@/router';
import useUserStore from '@/store/user';
import type { FormInstance } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
const activeKey = ref('1');
const userStore = useUserStore();
/** 修改密码 */
const formRef = ref<FormInstance>();
interface FormState {
  username: string;
  password: string;
  newPassword: string;
}
const formState = reactive<FormState>({
  username: '',
  password: '',
  newPassword: '',
});

const updatePassword = async () => {
  const res = await updatePasswordApi({
    id: userStore.id,
    userName: formState.username,
    password: formState.password,
    newPassword: formState.newPassword,
  });
  console.log(res);
  if (res.data.code == 200) {
    window.$message.success('更新成功');
    router.push('/');
    userStore.loginoutAction();
  } else if (res.data.code == 400) {
    window.$message.error('用户不存在');
    return;
  } else {
    window.$message.error('密码错误');
    return;
  }
};

const onFinish = () => {
  updatePassword();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const resetForm = () => {
  formRef.value!.resetFields();
};

/** 我的送礼 */

const sendGiftData = ref();

const getMySendGift = async () => {
  const user_id = userStore.id;
  const res = await mysendGiftApi({ user_id });
  if (res.data.code == 200) {
    const giftList = await Promise.all(
      res.data.data.list.map(async (item) => {
        const userInfo = await findUserApi({ id: Number(item.live_id) });
        item.liveName = userInfo.data.data.username;
        return {
          liveName: item.liveName,
          giftName: item.gift_name,
          price: item.price,
          sendTime: item.send_time,
        };
      })
    );
    sendGiftData.value = giftList;
  } else {
    return;
  }
};

/** 我的礼物 */
const myGiftData = ref();

const getMyLiveGift = async () => {
  const live_id = userStore.id;
  const res = await myliveGiftApi({ live_id });
  if (res.data.code == 200) {
    const giftList = await Promise.all(
      res.data.data.list.map(async (item) => {
        const userInfo = await findUserApi({ id: Number(item.user_id) });
        item.userName = userInfo.data.data.username;
        return {
          userName: item.userName,
          giftName: item.gift_name,
          price: item.price,
          sendTime: item.send_time,
        };
      })
    );
    myGiftData.value = giftList;
  } else {
    return;
  }
};

onMounted(() => {
  getMySendGift();
  getMyLiveGift();
});
</script>

<style lang="scss" scoped>
.center__container {
  width: 100%;
  height: 740px;
  background: url('../../assets/img/live.jpg');
  display: flex;
  align-items: center;
  justify-content: center;

  .center__main {
    width: 1200px;
    height: 660px;
    border-radius: 10px;
    background-color: #fff;
    padding: 5px 20px;

    ::v-deep .ant-tabs-tab {
      display: flex;
      justify-content: center;
      width: 100px;
      font-size: 20px;
      font-weight: 400;
    }

    .passwordForm {
      width: 600px;
      margin-top: 80px;
      margin-left: 50px;

      ::v-deep .ant-form-item {
        height: 70px;
        .ant-form-item-label {
          label {
            font-size: 18px;
          }
          padding-right: 20px;
          padding-top: 10px;
        }

        .ant-input {
          height: 45px;
          font-size: 20px;
        }
        .ant-input-password {
          .ant-input {
            height: 40px;
          }
        }
      }
    }

    .sendgift__container {
      padding: 10px 30px;

      .gift-span {
        font-size: 20px;
      }
    }

    .mygift__container {
      padding: 10px 30px;
      .gift-span {
        font-size: 20px;
      }
    }
  }
}
</style>
