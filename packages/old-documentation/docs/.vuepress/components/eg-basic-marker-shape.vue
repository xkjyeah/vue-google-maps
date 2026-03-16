<template>
  <div>
    <p>Only the dark dots in the middle of the marker are clickable</p>

    <gmap-map :center="center" :zoom="7" style="width: 100%; height: 500px">
      <gmap-marker
        v-for="(value, index) of markers"
        :key="index"
        :position="value.position"
        :clickable="true"
        :draggable="true"
        @click="center = value.position"
        :shape="shape"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "eg-basic-marker-shape",
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
      shape: {
        coords: [10, 10, 10, 15, 15, 15, 15, 10],
        type: "poly",
      },
    };
  },
};
</script>
