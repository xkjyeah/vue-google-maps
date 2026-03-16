<template>
  <div>
    <gmv-map
      ref="mapRef"
      :center="center"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 500px"
    >
      <gmv-marker
        v-for="(m, index) in markers"
        :key="index"
        :clickable="true"
        :draggable="true"
        :position="m.location"
        @click="center = m.location"
      />
      <gmv-heatmap-layer
        :data="markers"
        :dissipating="false"
        :max-intensity="120"
      />
    </gmv-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 4.5, lng: 99 },
      markers: [],
    };
  },
  async mounted() {
    await this.$gmapApiPromiseLazy();
    this.markers = [
      {
        location: new google.maps.LatLng({ lat: 3, lng: 101 }),
        weight: 100,
      },
      {
        location: new google.maps.LatLng({ lat: 5, lng: 99 }),
        weight: 50,
      },
      {
        location: new google.maps.LatLng({ lat: 6, lng: 97 }),
        weight: 80,
      },
    ];
  },
};
</script>
