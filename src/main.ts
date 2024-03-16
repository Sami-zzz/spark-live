import Message from '@/components/Message/index.vue';
import { createApp } from 'vue';

import { router } from '@/router';
import App from './App.vue';

const app = createApp(App);
app.use(router);
//使用message组件
const message = createApp(Message);
const messageEle = document.createElement('div');
const appEl = document.getElementById('app');
appEl?.appendChild(messageEle);

message.mount(messageEle);
app.mount('#app');
