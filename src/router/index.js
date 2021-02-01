import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import DisplaySensor from '../views/DisplaySensor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/sensor',
    name: 'Sensor',
    component: DisplaySensor,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
