import '@/assets/global.scss';

import Message from '@/components/Message/index.vue';
// @ts-ignore
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue';

import router from '@/router';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
//使用message组件
const message = createApp(Message);
const messageEle = document.createElement('div');
const appEl = document.getElementById('app');
appEl?.appendChild(messageEle);
message.mount(messageEle);
//antd
app.use(Antd);
app.mount('#app');
