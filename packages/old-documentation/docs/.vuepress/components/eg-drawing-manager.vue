<template>
  <div id="container">
    <h3>Drawing Manager Example</h3>
    <div style="width: 100%; display: flex; flex-direction: column;">
      <span style="width: auto;" />
      <ul>
        <li>
          <strong>Mode:</strong> {{ mapMode }}
        </li>
        <li>
          <strong>Position:</strong> {{ toolbarPosition }}
        </li>
      </ul>
      <span style="width: auto;" />
      <div>
        <button @click="setPos">Position</button>
        <button @click="setMapMode">{{mapMode === 'ready' ? 'change to Edit' : 'change to Ready'}}</button>
      </div>
    </div>
    <br />
    <gmap-map
      ref="mapRef"
      :center="mapCenter"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 500px"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: mapDraggable,
        draggableCursor: mapCursor
      }"
    >
      <template #visible>
        <gmap-drawing-manager
          v-if="mapMode === 'edit'"
          :position="toolbarPosition"
          :rectangle-options="rectangleOptions"
          :circle-options="circleOptions"
          :polyline-options="polylineOptions"
          :shapes="shapes"
          @update:shapes="shapes = $event"
        />
      </template>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: "eg-drawing-manager",
  data() {
    return {
      mapCenter: { lat: 4.5, lng: 99 },
      mapMode: null,
      toolbarPosition: 'TOP_CENTER',
      mapDraggable: true,
      mapCursor: null,
      shapes: [],
      rectangleOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: false,
        editable: false,
        clickable: true
      },
      circleOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: false,
        editable: false,
        clickable: true
      },
      polylineOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: false,
        editable: false,
        clickable: true
      }
    }
  },
  watch: {
    mapMode(newMode, oldMode) {
      if (newMode === 'ready') {
        if (oldMode === 'edit') {
          this.mapDraggable = true;
          this.mapCursor = null;
          return;
        }
      }

      if (newMode === 'edit') {
        this.mapDraggable = false;
        this.mapCursor = 'default';
      }
    }
  },
  mounted() {
    this.mapMode = 'ready';
  },
  methods: {
    setPos() {
      const posTypes = [
        'TOP_CENTER',
        'TOP_LEFT',
        'TOP_RIGHT',
        'LEFT_TOP',
        'RIGHT_TOP',
        'LEFT_CENTER',
        'RIGHT_CENTER',
        'LEFT_BOTTOM',
        'RIGHT_BOTTOM',
        'BOTTOM_CENTER',
        'BOTTOM_LEFT',
        'BOTTOM_RIGHT'
      ];

      this.toolbarPosition =
        posTypes[Math.floor(Math.random() * posTypes.length)];
    },
    setMapMode() {
      if (this.mapMode === 'edit') {
        this.mapMode = 'ready';
      } else {
        this.mapMode = 'edit'
      }
    }
  }
};
</script>

<style scoped>
#container {
  width: 700px;
  margin-bottom: 1rem;
}
</style>
