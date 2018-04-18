import {load, loaded} from './manager.js'
import Marker from './components/marker'
import Polyline from './components/polyline'
import Polygon from './components/polygon'
import Circle from './components/circle'
import Rectangle from './components/rectangle'
import StreetViewPanoramaMarker from './components/streetViewMarker'

// Vue component imports
import InfoWindow from './components/infoWindow.vue'
import Map from './components/map.vue'
import StreetViewPanorama from './components/streetViewPanorama.vue'
import PlaceInput from './components/placeInput.vue'
import Autocomplete from './components/autocomplete.vue'

import MapElementMixin from './components/mapElementMixin'
import StreetViewElementMixin from './components/streetViewElementMixin'
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

// export everything
export {load, loaded, Marker, Cluster, Polyline, Polygon, Circle, Rectangle,
  InfoWindow, Map, PlaceInput, MapElementMixin, Autocomplete,
  MountableMixin, StreetViewPanoramaMarker, StreetViewElementMixin}

export function install (Vue, options) {
  options = {
    installComponents: true,
    autobindAllEvents: false,
    ...options
  }

  const defaultResizeBus = new Vue()
  Vue.$gmapDefaultResizeBus = defaultResizeBus
  Vue.mixin({
    created () {
      this.$gmapDefaultResizeBus = defaultResizeBus
      this.$gmapOptions = options
    }
  })

  if (options.load) {
    load(options.load, options.loadCn)
  }

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
    Vue.component('GmapStreetViewPanoramaMarker', StreetViewPanoramaMarker)
  }
}
