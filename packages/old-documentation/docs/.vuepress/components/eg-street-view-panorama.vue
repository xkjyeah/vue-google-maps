<template>
  <div>
    <h3>
      Panorama at Pembroke College, Cambridge, facing North, looking slightly upwards (10 degrees)
    </h3>
    <p>Point-of-view updates when you pan around</p>
    <ul>
      <li><strong>Heading:</strong> <i>{{pov && pov.heading}}</i> <button @click="pov.heading = Math.random() * 360">Change</button></li>
      <li><strong>Pitch:</strong> <i>{{pov && pov.pitch}}</i> <button @click="pov.pitch = Math.random() * 180 - 90">Change</button></li>
      <li> <strong>Change booth:</strong> <button @click="pov.pitch = Math.random() * 180 - 90, pov.heading = Math.random() * 360">Change Both</button></li>
      <li><strong>Pano ID:</strong> <i>{{pano}}</i></li>
    </ul>
    <br><br>
    <div class="flex-container">
      <div>
        <gmap-map :center="mapCenter" :zoom="12"
          ref="map"
          @center_changed="updateCenter"
          @idle="sync"
          class="map-container">
        </gmap-map>
      </div>
      <div>
        <gmap-street-view-panorama
          ref="pano"
          :position="mapCenter"
          :pov="pov"
          :zoom="1"
          class="map-container"
          @position_changed="updateCenter"
          @pano_changed="updatePano"
          @pov_changed="updatePov">
        </gmap-street-view-panorama>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'eg-street-view-panorama',
  data() {
    return {
      reportedMapCenter: {
        lat: 52.201272,
        lng: 0.118720
      },
      mapCenter: null,
      pov: {
        heading: 0,
        pitch: 0,
      },
      pano: 0,
    }
  },
  methods: {
    updatePov(pov) {
      this.pov = pov;
    },
    updatePano(pano) {
      this.pano = pano;
    },
    updateCenter(latLng) {
      this.reportedMapCenter = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      }
    },
    sync () {
      this.mapCenter = this.reportedMapCenter
    }
  },
  created() {
    this.sync()
  },
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
