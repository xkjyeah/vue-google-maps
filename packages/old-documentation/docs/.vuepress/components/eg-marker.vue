<template>
  <div>
    <ul>
      <li v-for="(value, index) of markers" :key="index">{{ index + 1}} - {{ value.position }}</li>
    </ul>
    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <!-- From v3.1.0 you have the update:position event on markers -->
      <gmap-marker
        v-for="(value, index) of markers"
        :key="index"
        :position="value.position"
        :clickable="true"
        :draggable="true"
        @click="center = value.position"
        @update:position="getNewMarkerPosition($event, index)"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "eg-marker",
  data() {
    return {
      center: {
        lat: 10.0,
        lng: 10.0,
      },
      markers: [
        {
          position: {
            lat: 10.0,
            lng: 10.0,
          },
        },
        {
          position: {
            lat: 11.0,
            lng: 11.0,
          },
        },
      ],
    };
  },
  methods: {
    getNewMarkerPosition(event, index) {
      console.info('udpate:position', event);

      if (this.markers[index].position.lat !== event.lat) {
        this.markers[index].position.lat = event.lat;
      }

      if (this.markers[index].position.lng !== event.lng) {
        this.markers[index].position.lng = event.lng;
      }
    },
  },
};
</script>

<style scoped></style>
