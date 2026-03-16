<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="4"
      style="width: 100%; height: 500px"
      ref="map"
    >
      <gmap-circle
        v-if="radius"
        :editable="editable"
        :draggable="draggable"
        :radius="radius"
        :center="circleCenter"
        :options="options"
        ref="circle"
      >
      </gmap-circle>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "eg-circle",
  data() {
    return {
      center: { lat: 40.714, lng: -74.005 },
      editable: true,
      draggable: true,
      population: 8405837,
      circleCenter: { lat: 40.714, lng: -74.005 },
      options: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
    };
  },
  computed: {
    radius() {
      return Math.sqrt(this.population) * 100;
    },
  },
};
</script>

<style lang="css" scoped></style>
