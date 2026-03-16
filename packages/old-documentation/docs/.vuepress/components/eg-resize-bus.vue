<template>
  <div>
    <h1>Resize Bus</h1>

    <p>
      The first map is displayed correctly after clicking
      the button.

      The second and third are not (not bound to default resize bus).
      <button @click=updateStyle>
        Click me first
      </button>
    </p>
    <p>
      However, the third map responds to the second button
      (custom resize bus)

      <button @click=updateBus>
        Click me second
      </button>
    </p>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12>
    </gmap-map>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12
      :resize-bus="null">
    </gmap-map>

    <gmap-map
      :style="currentStyle"
      :center="{lat: 1.38, lng: 103.8}"
      :zoom=12
      :resize-bus="customBus">
    </gmap-map>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'eg-resize-bus',
  data() {
    return {
      currentStyle: {
        display: 'none'
      },
      customBus: new Vue(),
    }
  },
  methods: {
    updateStyle() {
      this.currentStyle = {
        display: 'inline-block',
        width: '200px',
        height: '200px',
      };
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
