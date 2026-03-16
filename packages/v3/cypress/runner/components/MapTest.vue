<template>
  <div>
    <h2>Test E2E: Map layer</h2>
    <ol>
      <li>You can pan around this map, and the center is updated.</li>
      <li>When you edit the lat/lng the map center is updated</li>
    </ol>

    <div>
      <small>
        <strong>Lat:</strong>
      </small>
      <input
        v-model.number.lazy.trim="reportedMapCenter.lat"
        name="lat"
        step="0.00001"
        type="number"
        @change="sync"
        @keyup.enter="setCenter"
      />
      &nbsp;
      <small><strong>Lng:</strong></small>
      <input
        v-model.number.lazy.trim="reportedMapCenter.lng"
        name="lng"
        step="0.00001"
        type="number"
        @change="sync"
        @keyup.enter="setCenter"
      />
    </div>

    <br />

    <div class="flex-container">
      <div>
        <gmv-map
          :center="mapCenter"
          :zoom="12"
          class="map-container"
          @center_changed="updateCenter"
          @idle="sync"
        />
      </div>
      <div>
        <!--        <gmv-street-view-panorama-->
        <!--          ref="pano"-->
        <!--          :position="mapCenter"-->
        <!--          :pov="pov"-->
        <!--          class="map-container"-->
        <!--          @position_changed="updateCenter">-->
        <!--        </gmv-street-view-panorama>-->
      </div>
    </div>
  </div>
</template>

<script>
import { useMapPromise } from '../../../dist/composables.es';

export default {
  name: 'MapTest',
  data() {
    return {
      reportedMapCenter: {
        lat: 1.32,
        lng: 103.8,
      },
      mapCenter: {
        lat: 1.32,
        lng: 103.8,
      },
      pov: {
        pitch: 0,
        heading: 0,
      },
    };
  },
  onMounted() {
    this.sync();
  },
  methods: {
    updateCenter(latLng) {
      this.reportedMapCenter = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
    },
    sync() {
      this.mapCenter.lat = this.reportedMapCenter.lat;
      this.mapCenter.lng = this.reportedMapCenter.lng;
    },
    async setCenter() {
      const map = await useMapPromise();
      this.mapCenter.lat = this.reportedMapCenter.lat;
      this.mapCenter.lng = this.reportedMapCenter.lng;
      map.setCenter(this.mapCenter);
    },
  },
};
</script>

<style lang="stylus" scoped>
.map-container {
  width: 400px;
  height: 400px;
  display: inline-block;
}

.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
