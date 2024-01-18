import { createApp } from 'vue';
import App from './App.vue';
import VueCropper from 'vue-cropperjs';
import DisplayImage from './components/DisplayImage.vue';
import { createRouter, createWebHistory } from 'vue-router';

//Systeme de Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'main',
            component: App,
            props: true,
        },
        {
            path: '/image/:id',
            name: "display-image",
            component: DisplayImage,
            props: true,
        },
    ],
});

const app = createApp(App);
app.use(router);
app.use(VueCropper);
app.mount('#app');
