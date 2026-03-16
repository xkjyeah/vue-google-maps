<template>
  <div>
    <h1>Resize Bus</h1>

    <p>
      There should be no error toggling the visibility of the maps
      <button @click=updateStyle>
        Toggle Visibility
      </button>
    </p>

    <div v-if="showElements">
      <gmap-map
        :style="currentStyle"
        :center="{lat: 1.38, lng: 103.8}"
        :zoom=12>
      </gmap-map>

      <gmap-map
        :style="currentStyle"
        :center="{lat: 1.38, lng: 103.8}"
        :zoom=12>
      </gmap-map>

      <gmap-map
        :style="currentStyle"
        :center="{lat: 1.38, lng: 103.8}"
        :zoom=12
        :resize-bus="customBus">
      </gmap-map>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'eg-map-destroy',
  data() {
    return {
      currentStyle: {
        display: 'inline-block',
        width: '200px',
        height: '200px',
      },
      showElements: true,
      customBus: new Vue(),
    }
  },
  methods: {
    updateStyle() {
      this.showElements = !this.showElements;
      Vue.$gmapDefaultResizeBus.$emit('resize');
    },
    updateBus() {
      this.customBus.$emit('resize');
    }
  }
}
</script>

<style lang="css" scoped>
</style>
