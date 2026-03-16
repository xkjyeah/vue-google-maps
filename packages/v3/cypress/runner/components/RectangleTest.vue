<template>
  <div>
    <gmv-map
      ref="map"
      :center="center"
      :zoom="11"
      style="width: 100%; height: 500px"
    >
      <gmv-rectangle
        ref="rectangle"
        :bounds="bounds"
        :draggable="draggable"
        :editable="editable"
        :options="options"
      />
    </gmv-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 33.678, lng: -116.243 },
      editable: true,
      draggable: true,
      bounds: {
        north: 33.685,
        south: 33.671,
        east: -116.234,
        west: -116.251,
      },
      options: {
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      },
    };
  },
};
</script>
