<template>
  <div>
    <gmv-map
      ref="map"
      :center="center"
      :zoom="4"
      style="width: 100%; height: 500px"
      map-id="DEMO_MAP_ID"
    >
      <gmv-circle
        v-if="radius"
        ref="circle"
        :center="circleCenter"
        :draggable="draggable"
        :editable="editable"
        :options="options"
        :radius="radius"
      />
    </gmv-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 40.714, lng: -74.005 },
      editable: true,
      draggable: true,
      population: 8405837,
      circleCenter: { lat: 40.714, lng: -74.005 },
      options: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
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
