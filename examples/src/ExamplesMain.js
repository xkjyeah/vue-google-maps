import ExamplesApp from './ExamplesApp.vue'
import ExamplePageDefault from './ExamplePageDefault.vue'
import ExamplePage from './ExamplePage.vue'
import Examples from '../examples-index'
import Vue from 'vue'
import * as VueGoogleMaps from '../../dist/main.js'
import VueRouter from 'vue-router'

Vue.config.optionMergeStrategies.description = (a, b) => a || b

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDf43lPdwlF98RCBsJOFNKOkoEjkwxb5Sc',
    libraries: 'places'
  }
})
Vue.use(VueRouter)

const router = new VueRouter({
  routes: Examples.map(e => ({
    path: `/${e.name}`,
    component: ExamplePage,
    name: e.name,
    props: {
      name: e.name,
      description: e.description,
      source: e.source,
      component: e.module
    }
  }))
    .concat([
      { path: '/', component: ExamplePageDefault }
    ])
})

document.addEventListener('DOMContentLoaded', () => {
  new (Vue.extend(ExamplesApp))({ router })
    .$mount('#app')
})
