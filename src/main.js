import lazy from './utils/lazyValue'
import {loadGmapApi} from './manager'

import Marker from './components/marker'
import Polyline from './components/polyline'
import Polygon from './components/polygon'
import Circle from './components/circle'
import Rectangle from './components/rectangle'

// Vue component imports
import InfoWindow from './components/infoWindow.vue'
import Map from './components/map.vue'
import StreetViewPanorama from './components/streetViewPanorama.vue'
import PlaceInput from './components/placeInput.vue'
import Autocomplete from './components/autocomplete.vue'

import MapElementMixin from './components/mapElementMixin'
import MapElementFactory from './components/mapElementFactory'
import MountableMixin from './utils/mountableMixin'

// HACK: Cluster should be loaded conditionally
// However in the web version, it's not possible to write
// `import 'vue2-google-maps/src/components/cluster'`, so we need to
// import it anyway (but we don't have to register it)
// Therefore we use babel-plugin-transform-inline-environment-variables to
// set BUILD_DEV to truthy / falsy
const Cluster = (process.env.BUILD_DEV === '1')
  ? undefined
  : (s => s.default || s)(require('./components/cluster'))

let GmapApi = null

// export everything
export {loadGmapApi, Marker, Polyline, Polygon, Circle, Cluster, Rectangle,
  InfoWindow, Map, PlaceInput, MapElementMixin, MapElementFactory, Autocomplete,
  MountableMixin, StreetViewPanorama}

export function install (Vue, options) {
  // Set defaults
  options = {
    installComponents: true,
    autobindAllEvents: false,
    ...options
  }

  // Update the global `GmapApi`. This will allow
  // components to use the `google` global reactively
  // via:
  //   import {gmapApi} from 'vue2-google-maps'
  //   export default {  computed: { google: gmapApi }  }
  GmapApi = new Vue({data: {gmapApi: null}})

  const defaultResizeBus = new Vue()

  // Use a lazy to only load the API when
  // a VGM component is loaded
  let gmapApiPromiseLazy = makeGmapApiPromiseLazy(options)

  Vue.mixin({
    created () {
      this.$gmapDefaultResizeBus = defaultResizeBus
      this.$gmapOptions = options
      this.$gmapApiPromiseLazy = gmapApiPromiseLazy
    }
  })
  Vue.$gmapDefaultResizeBus = defaultResizeBus
  Vue.$gmapApiPromiseLazy = gmapApiPromiseLazy

  if (options.installComponents) {
    Vue.component('GmapMap', Map)
    Vue.component('GmapMarker', Marker)
    Vue.component('GmapInfoWindow', InfoWindow)
    Vue.component('GmapPolyline', Polyline)
    Vue.component('GmapPolygon', Polygon)
    Vue.component('GmapCircle', Circle)
    Vue.component('GmapRectangle', Rectangle)
    Vue.component('GmapAutocomplete', Autocomplete)
    Vue.component('GmapPlaceInput', PlaceInput)
    Vue.component('GmapStreetViewPanorama', StreetViewPanorama)
  }
}

function makeGmapApiPromiseLazy (options) {
  // Things to do once the API is loaded
  function onApiLoaded () {
    GmapApi.gmapApi = {}
    return window.google
  }

  if (options.load) { // If library should load the API
    return lazy(() => { // Load the
      // This will only be evaluated once
      if (typeof window === 'undefined') { // server side -- never resolve this promise
        return new Promise(() => {}).then(onApiLoaded)
      } else {
        return new Promise((resolve, reject) => {
          try {
            window['vueGoogleMapsInit'] = resolve
            loadGmapApi(options.load, options.loadCn)
          } catch (err) {
            reject(err)
          }
        })
          .then(onApiLoaded)
      }
    })
  } else { // If library should not handle API, provide
    // end-users with the global `vueGoogleMapsInit: () => undefined`
    // when the Google Maps API has been loaded
    const promise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        // Do nothing if run from server-side
        return
      }
      window['vueGoogleMapsInit'] = resolve
    }).then(onApiLoaded)

    return lazy(() => promise)
  }
}

export function gmapApi () {
  return GmapApi.gmapApi && window.google
}
