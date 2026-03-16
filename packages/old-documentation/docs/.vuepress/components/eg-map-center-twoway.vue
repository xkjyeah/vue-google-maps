<template>
  <div>
    <h2>Test 1</h2>
    <ol>
      <li>You can pan around this map, and the center is updated.</li>
      <li>When you edit the lat/lng the map center is updated</li>
    </ol>

    <div>
      <small><strong>Lat:</strong></small>
      <input type="number"
        v-model.number.lazy="reportedMapCenter.lat"
        @change="sync"
        step="0.00001" />
      &nbsp;
      <small><strong>Lng:</strong></small>
      <input type="number"
        v-model.number.lazy="reportedMapCenter.lng"
        @change="sync"
        step="0.00001" />
    </div>
    <br>

    <div class="flex-container">
      <div>
        <gmap-map
          :center="mapCenter"
          :zoom="12"
          ref="map"
          @center_changed="updateCenter"
          @idle="sync"
          class="map-container">
        </gmap-map>
      </div>
      <div>
        <gmap-street-view-panorama
          :position="mapCenter"
          ref="pano"
          @position_changed="updateCenter"
          :pov="pov"
          class="map-container">
        </gmap-street-view-panorama>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'eg-map-center-twoway',
  data() {
    return {
      reportedMapCenter: {
        lat: 52.201272,
        lng: 0.118720
      },
      mapCenter: null,
      pov: {
        pitch: 0,
        heading: 0,
      },
    }
  },
  async created() {
    this.sync()
    await this.$gmapApiPromiseLazy();
  },
  methods: {
    updateCenter(latLng) {
      this.reportedMapCenter = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      }
    },
    sync () {
      this.mapCenter = this.reportedMapCenter
    }
  }
}
</script>

<style lang="css" scoped>
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
