<template>
  <div>
    <button @click="generate">Generate and Bound to Lat Lngs</button>

    <GmapMap style="width: 600px; height: 400px;" :zoom="1" :center="{lat: 0, lng: 0}"
        ref="map">
      <GmapMarker v-for="(marker, index) in markers"
        :key="index"
        :position="marker.latLng"
        />
    </GmapMap>
  </div>
</template>

<script>

export default {
  data () {
    return {
      markers: [],
      place: null,
    }
  },
  description: `
  In which a random set of points are generated, and
  the bounds of the map are changed to fit the points
  `,
  watch: {
    markers(markers) {
      if (markers.length > 2) {
        const bounds = new google.maps.LatLngBounds()
        for (let m of markers) {
          bounds.extend(m.latLng)
        }
        this.$refs.map.$mapObject.fitBounds(bounds)
      }
    }
  },
  methods: {
    generate() {
      const spread = Math.random() + 0.001

      this.center = {
        lat: 1.38 + (Math.random() - 0.5) * spread,
        lng: 103.8 + (Math.random() - 0.5) * spread,
      }

      this.markers = _.range(30)
        .map(m => ({
          latLng: {
            lat: this.center.lat + (Math.random() - 0.5) * spread,
            lng: this.center.lng + (Math.random() - 0.5) * spread,
          }
        }))
    }
  }
}
</script>
