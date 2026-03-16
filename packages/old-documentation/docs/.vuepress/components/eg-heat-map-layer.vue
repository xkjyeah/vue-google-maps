<template>
  <div>
    <gmap-map
      ref="mapRef"
      :zoom="7"
      :center="center"
      map-type-id="roadmap"
      style="width: 100%; height: 500px;"
    >
      <gmap-marker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.location"
        :clickable="true"
        :draggable="true"
        @click="center = m.location"
      />
      <gmap-heatmap-layer
        :data="markers"
        :options="{ maxIntensity: 120, dissipating: false }"
      />
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'eg-heat-map-layer',
  data() {
    return {
      center: { lat: 4.5, lng: 99 },
      markers: [],
    }
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    this.markers = [
      {
        location: new google.maps.LatLng({ lat: 3, lng: 101 }),
        weight: 100
      },
      {
        location: new google.maps.LatLng({ lat: 5, lng: 99 }),
        weight: 50
      },
      {
        location: new google.maps.LatLng({ lat: 6, lng: 97 }),
        weight: 80
      }
    ];
  }
};
</script>
