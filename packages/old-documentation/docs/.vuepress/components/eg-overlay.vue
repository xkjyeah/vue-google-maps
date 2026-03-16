<template>
  <div>
    <p>Please move the map in order to see the limits of the overlay image</p>
    <gmap-map :center="{lat: 1.38, lng: 103.8}" :zoom="11" style="width: 100%; height: 500px">
      <ground-overlay
        source="/images/overlay.png"
        :bounds="{
            north: 1.502,
            south: 1.185,
            east: 104.0262,
            west: 103.5998,
        }"
        :opacity="0.5"
      ></ground-overlay>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'eg-overlay',
  data () {
    return {
      place: '',
    }
  },
}
</script>

<style lang="css" scoped>
</style>
