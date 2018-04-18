import Vue from 'vue/dist/vue.js';
import App from './app.vue';
import * as VueGoogleMaps from '../../src/main.js';

Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
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
