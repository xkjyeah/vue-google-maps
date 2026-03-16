<template>
  <div>
    <h3>
      Panorama at Pembroke College, Cambridge, facing North, looking slightly
      upwards (10 degrees)
    </h3>
    <p>Point-of-view updates when you pan around</p>
    <ul>
      <li>
        <strong>Heading:</strong> <i>{{ pov && pov.heading }}</i>
        <button
          @click="
            () => {
              pov.heading = Math.random() * 360;
            }
          "
        >
          Change
        </button>
      </li>
      <li>
        <strong>Pitch:</strong> <i>{{ pov && pov.pitch }}</i>
        <button @click="pov.pitch = Math.random() * 180 - 90">Change</button>
      </li>
      <li>
        <strong>Change booth:</strong>
        <button
          @click="
            (pov.pitch = Math.random() * 180 - 90),
              (pov.heading = Math.random() * 360)
          "
        >
          Change Both
        </button>
      </li>
      <li>
        <strong>Pano ID:</strong> <i>{{ pano }}</i>
      </li>
      <li>
        <strong>Center</strong> <i>{{ mapCenter }}</i>
      </li>
      <li>
        <strong>Position</strong> <i>{{ position }}</i>
      </li>
    </ul>
    <br /><br />
    <div class="flex-container">
      <div>
        <gmv-map
          ref="map"
          :center="mapCenter"
          :zoom="12"
          class="map-container"
          @center_changed="updateCenter"
        />
      </div>
      <div>
        <gmv-street-view-panorama
          ref="pano"
          :position="position"
          :pov="pov"
          :zoom="1"
          class="map-container"
          @pano_changed="updatePano"
          @position_changed="updatePosition"
          @pov_changed="updatePov"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      reportedMapCenter: {
        lat: 52.201272,
        lng: 0.11872,
      },
      mapCenter: null,
      position: null,
      pov: {
        heading: 0,
        pitch: 0,
      },
      pano: 0,
    };
  },
  created() {
    this.sync();
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
      };
    },
    updatePosition(latLng) {
      this.position = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
    },
    sync() {
      this.mapCenter = this.reportedMapCenter;
    },
  },
};
</script>

<style scoped>
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
