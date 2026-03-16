<template>
  <div class="container-flex">
    <aside>
      <ul>
        <li>
          <button name="map" @click="loadTestComponent('MapTest')">Map</button>
        </li>
        <li>
          <button name="marker" @click="loadTestComponent('MarkerTest')">
            Marker
          </button>
        </li>
        <li>
          <button name="cluster" @click="loadTestComponent('ClusterTest')">
            Cluster
          </button>
        </li>
        <li>
          <button
            name="autocomplete"
            @click="loadTestComponent('AutocompleteTest')"
          >
            Autocomplete
          </button>
        </li>
        <li>
          <button
            name="info-window"
            @click="loadTestComponent('InfoWindowTest')"
          >
            InfoWindow
          </button>
        </li>
        <li>
          <button
            name="info-window2"
            @click="loadTestComponent('InfoWindowTest2')"
          >
            InfoWindow unmounted
          </button>
        </li>
        <li>
          <button name="kml-layer" @click="loadTestComponent('KmlLayerTest')">
            KmlLayer
          </button>
        </li>
        <li>
          <button name="circle" @click="loadTestComponent('CircleTest')">
            Circle
          </button>
        </li>
        <li>
          <button name="polygon" @click="loadTestComponent('PolygonTest')">
            Polygon
          </button>
        </li>
        <li>
          <button name="polyline" @click="loadTestComponent('PolylineTest')">
            Polyline
          </button>
        </li>
        <li>
          <button name="rectangle" @click="loadTestComponent('RectangleTest')">
            Rectangle
          </button>
        </li>
        <li>
          <button
            name="heatmap-layer"
            @click="loadTestComponent('HeatmapLayerTest')"
          >
            HeatmapLayer
          </button>
        </li>
        <li>
          <button
            name="drawing-manager"
            @click="loadTestComponent('DrawingManagerTest')"
          >
            DrawingManager
          </button>
        </li>
        <li>
          <button
            name="street-view-panorama"
            @click="loadTestComponent('StreetViewPanoramaTest')"
          >
            StreetViewPanorama
          </button>
        </li>
      </ul>
    </aside>
    <br />
    <main>
      <component :is="component" v-if="component" />
    </main>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-unsafe-assignment -->
<script>
import MapTest from './MapTest.vue';
import MarkerTest from './MarkerTest.vue';
import AutocompleteTest from './AutocompleteTest.vue';
import ClusterTest from './ClusterTest.vue';
import InfoWindowTest from './InfoWindowTest.vue';
import InfoWindowTest2 from './InfoWindowTest2.vue';
import KmlLayerTest from './KmlLayerTest.vue';
import CircleTest from './CircleTest.vue';
import PolygonTest from './PolygonTest.vue';
import PolylineTest from './PolylineTest.vue';
import RectangleTest from './RectangleTest.vue';
import HeatmapLayerTest from './HeatmapLayerTest.vue';
import DrawingManagerTest from './DrawingManagerTest.vue';
import StreetViewPanoramaTest from './StreetViewPanoramaTest.vue';

export default {
  name: 'App',
  components: {
    MapTest,
    MarkerTest,
    AutocompleteTest,
    ClusterTest,
    InfoWindowTest,
    InfoWindowTest2,
    KmlLayerTest,
    CircleTest,
    PolygonTest,
    PolylineTest,
    RectangleTest,
    HeatmapLayerTest,
    DrawingManagerTest,
    StreetViewPanoramaTest,
  },
  data() {
    return {
      component: null,
    };
  },
  methods: {
    loadTestComponent(component) {
      this.component = component;
    },
  },
};
</script>

<style lang="stylus" scoped>
.container-flex {
  display: flex;
  flex-direction: column;

  aside {
    justify-content: center;

    ul {
      list-style: none;
      align-items: center;

      li {
        float: left;
      }
    }
  }
}
</style>
