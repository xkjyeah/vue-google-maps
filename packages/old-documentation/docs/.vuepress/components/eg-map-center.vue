<template>
  <div>
    <div id="test1">
      <h2>Test 1</h2>
      <small><strong>Passes if:</strong> You can pan around this map without it being snapped back to the center</small>
      <br><br>
      <gmap-map
        :center="{lat: 1.38, lng: 103.8}"
        :zoom="12"
        class="map-container">
      </gmap-map>
    </div>

    <div id="test2">
      <h2>Test 2</h2>
      <small><strong>Passes if:</strong> Clicking the button changes the center</small>
      <br>
      <button @click="changeCenter">Change Center</button>&nbsp;
      <button @click="changeZoom">Change Zoom</button>
      <br><br>
      <gmap-map :center="t2.changingCenter" :zoom="t2.changingZoom" class="map-container">
      </gmap-map>
    </div>

    <div id="test3">
      <h2>Test 3</h2>
      <small><strong>Passes if:</strong> Resize of (1) is artefact-free.</small>
      <br>
      <small><strong>Passes if:</strong> Resize of (2) preserves the center</small>
      <br>
      <button @click="changeSize">Change Size</button>
      <br><br>

      <div class="flex-test3-container">
        <div>
          <small><strong>1</strong></small>
          <gmap-map :center="t3.changingCenter" :zoom="t3.changingZoom" ref="resizeMap1"
          :style="changingSize" class="map-container">
          </gmap-map>
        </div>
        <div>
          <small><strong>2</strong></small>
          <gmap-map :center="t3.changingCenter" :zoom="t3.changingZoom" ref="resizeMap2"
          :style="changingSize" class="map-container">
          </gmap-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'eg-map-center',
  data() {
    return {
      t2: {
        changingZoom: 12,
        changingCenter: {lat: 1.38, lng: 103.8},
      },
      t3: {
        changingZoom: 12,
        changingCenter: {lat:1.38, lng:103.8},
        changingWidth: 200,
        changingHeight: 200,
        i: 0,
      }
    }
  },
  computed: {
    changingSize() {
      return {
        width: this.t3.changingWidth + 'px',
        height: this.t3.changingHeight + 'px',
      };
    }
  },
  methods: {
    changeCenter() {
      this.t2.changingCenter = {
        lat: 1.38 + Math.random() * 0.3,
        lng: 103.8 + Math.random() * 0.1
      };
      this.t3.changingCenter = {
        lat: 1.38 + Math.random() * 0.3,
        lng: 103.8 + Math.random() * 0.1
      };
    },
    changeZoom() {
      this.t2.changingZoom = Math.floor(5 + Math.random() * 10);
      this.t3.changingZoom = Math.floor(5 + Math.random() * 10);
    },
    changeSize() {
      this.t3.i = (this.i + 1) % 2;
      this.t3.changingWidth = 200 + this.i * 300;
      this.t3.changingHeight = 200 + Math.random() * 150;
      this.$nextTick(() => {
        this.$refs.resizeMap1.resize();
        this.$refs.resizeMap2.resizePreserveCenter();
      });
    }
  }
}
</script>

<style lang="css" scoped>
  .map-container {
    width: 400px;
    height: 400px;
  }
  .flex-test3-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .flex-test3-container > div {
    display: flex;
    flex-direction: row;
  }
  .flex-test3-container > div > small {
    margin-right: .3rem;
    font-size: 16px;
    font-weight: bolder;
  }
</style>
