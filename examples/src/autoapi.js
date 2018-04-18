import Vue from "vue";
import AutoAPI from './AutoAPI.vue'

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: '#app',
    render (h) {
      return h(AutoAPI)
    }
  })
})
