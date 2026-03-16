<template>
  <div id="container">
    <h3>Drawing Manager Example</h3>
    <div style="width: 100%; display: flex; flex-direction: column;">
      <span style="width: auto;" />
      <ul>
        <li><strong>Mode:</strong> {{ mapMode }}</li>
      </ul>
      <span style="width: auto;" />
      <div>
        <button @click="mapMode = 'edit'">Edit</button>
      </div>
    </div>
    <br />
    <gmap-map
      ref="mapRef"
      :center="mapCenter"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 500px; display:flex; justify-content: center; align-items: flex-start;"
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
          :rectangle-options="rectangleOptions"
          :circle-options="circleOptions"
          :polyline-options="polylineOptions"
          :polygon-options="polygonOptions"
          :shapes="shapes"
          @update:shapes="shapes = $event"
        >
          <template v-slot="on">
            <eg-custom-drawing-toolbar
              @drawingmode_changed="on.setDrawingMode($event)"
              @delete_selection="on.deleteSelection()"
              @save="mapMode = 'ready'"
            />
          </template>
        </gmap-drawing-manager>
      </template>
    </gmap-map>
  </div>
</template>

<script>

export default {
  name: 'eg-drawing-manager-with-slot',
  data() {
    return {
      mapCenter: { lat: 4.5, lng: 99 },
      mapMode: null,
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
      },
      polygonOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: false,
        editable: false,
        clickable: true
      },
    };
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
  }
};
</script>

<style scoped>
#container {
  width: 700px;
  margin-bottom: 1rem;
}
</style>
