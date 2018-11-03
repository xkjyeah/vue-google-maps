import Vue from 'vue/dist/vue.js';
import App from './app.vue';
import * as VueGoogleMaps from '../../src/main.js';

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
    libraries: 'places'
  }
});

// json filter is now not bundled with vue
Vue.filter('json', x => JSON.stringify(x));

new Vue({
  el: '#root',
  components: {
    myApp: App
  }
});
