import {load, loaded} from './manager.js';
import Marker from './components/marker';
import Cluster from './components/cluster';
import Polyline from './components/polyline';
import Polygon from './components/polygon';
import Circle from './components/circle';
import Rectangle from './components/rectangle';

// Vue component imports
import InfoWindow from './components/infoWindow.vue';
import Map from './components/map.vue';
import StreetViewPanorama from './components/streetViewPanorama.vue';
import PlaceInput from './components/placeInput.vue';
import Autocomplete from './components/autocomplete.vue';

import MapElementMixin from './components/mapElementMixin';
import MountableMixin from './utils/mountableMixin';
import {DeferredReady} from './utils/deferredReady';

// export everything
export {load, loaded, Marker, Cluster, Polyline, Polygon, Circle, Rectangle,
  InfoWindow, Map, PlaceInput, MapElementMixin, Autocomplete,
  MountableMixin};

export function install(Vue, options) {
  options = Object.assign({}, {
    installComponents: true,
  }, options);

  Vue.use(DeferredReady);

  const defaultResizeBus = new Vue();
  Vue.$gmapDefaultResizeBus = defaultResizeBus;
  Vue.mixin({
    created() {
      this.$gmapDefaultResizeBus = defaultResizeBus;
    }
  });

  if (options.load) {
    load(options.load, options.version, options.libraries, options.loadCn);
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
    Vue.component('GmapAutocomplete', Autocomplete);
    Vue.component('GmapPlaceInput', PlaceInput);
    Vue.component('GmapStreetViewPanorama', StreetViewPanorama);
  }
}
