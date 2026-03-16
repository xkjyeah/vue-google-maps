<template>
  <div>
    <p>
      Map type id is:
      <strong class="map-type-id">{{mapTypeId}}</strong>
    </p>

    <gmap-map
      :center="center"
      :zoom="15"
      style="width: 100%; height: 500px"
      @maptypeid_changed="updateMapType"
      :map-type-id="mapTypeId"
    ></gmap-map>
  </div>
</template>

<script>
export default {
  name: 'eg-map-type-id',
  data () {
    return {
      center: {
        lat: 47.376332,
        lng: 8.547511
      },
      mapTypeId: "terrain",
    }
  },
  methods: {
    updateMapType(type) {
      this.mapTypeId = type
    }
  },
}
</script>

<style lang="stylus" scoped>
  .map-type-id
    font-size: 22px
</style>
