import Vue from 'vue/dist/vue.js'
import App from './app.vue'

// json filter is now not bundled with vue
Vue.filter('json', x => JSON.stringify(x));

new Vue({
  el: '#root',
  components: {
    myApp: App
  }
});
