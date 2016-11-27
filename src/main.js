import {load, loaded} from './manager.js';
import Marker from './components/marker';
import Cluster from './components/cluster'
import Polyline from './components/polyline'
import Polygon from './components/polygon'
import Circle from './components/circle'
import Rectangle from './components/rectangle'

// Vue component imports
import InfoWindow from './components/infoWindow.vue'
import Map from './components/map.vue';
import PlaceInput from './components/placeInput.vue'

import MapElementMixin from './components/mapElementMixin'
import {DeferredReady} from './utils/deferredReady'

// export everything
export {load, loaded, Marker, Cluster, Polyline, Polygon, Circle, Rectangle,
  InfoWindow, Map, PlaceInput, MapElementMixin};

export function install(Vue, options) {
  options = _.defaults(options, {
    installComponents: true,
  });

  Vue.use(DeferredReady);

  if (options.load) {
    load(options.load);
  }

  if (options.installComponents) {
    Vue.component('GmapMap', Map);
    Vue.component('GmapMarker', Marker);
    Vue.component('GmapCluster', Cluster);
    Vue.component('GmapInfoWindow', InfoWindow);
    Vue.component('GmapPolyline', Polyline);
    Vue.component('GmapPolygon', Polygon);
    Vue.component('GmapCircle', Circle);
    Vue.component('GmapRectangle', Rectangle);
    Vue.component('GmapPlaceInput', PlaceInput);
  }
}
