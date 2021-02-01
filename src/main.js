import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

import './assets/style/index.sass';

Vue.config.productionTip = false;

Vue.use(axios);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
