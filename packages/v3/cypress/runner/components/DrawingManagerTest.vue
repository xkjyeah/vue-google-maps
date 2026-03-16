<template>
  <div>
    <h1>Drawing Manager Example</h1>
    <div style="width: 100%; display: flex; justify-content: center">
      <button @click="setPos">Change toolbar position</button>
      <button @click="changeMapMode">
        {{ mapMode === 'edit' ? 'Finish edition' : 'Start edition' }}
      </button>
    </div>
    <br />
    <div style="width: 100%; display: flex; justify-content: center">
      <span style="width: auto" />
      <strong>mapMode:</strong>
      <pre>{{ mapMode }}</pre>
      <span style="width: auto" />
    </div>
    <br />
    <div style="width: 100%; display: flex; justify-content: center">
      <span style="width: auto" />
      <strong>toolbarPosition:</strong>
      <pre>{{ toolbarPosition }}</pre>
      <span style="width: auto" />
    </div>
    <br />
    <gmv-map
      ref="mapRef"
      :center="mapCenter"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
        draggable: mapDraggable,
        draggableCursor: mapCursor,
      }"
      :zoom="7"
      map-type-id="roadmap"
      style="width: 100%; height: 800px"
    >
      <template #visible>
        <gmv-drawing-manager
          v-if="mapMode === 'edit'"
          :circle-options="circleOptions"
          :marker-options="markerOptions"
          :polygon-options="polygonOptions"
          :polyline-options="polylineOptions"
          :position="toolbarPosition"
          :rectangle-options="rectangleOptions"
          :shapes="shapes"
        />
      </template>
    </gmv-map>
  </div>
</template>

<script>
export default {
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
        draggable: true,
        editable: true,
        clickable: true,
      },
      circleOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: true,
        editable: true,
        clickable: true,
      },
      polylineOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: true,
        editable: true,
        clickable: true,
      },
      polygonOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: true,
        editable: true,
        clickable: true,
      },
      markerOptions: {
        fillColor: '#777',
        fillOpacity: 0.4,
        strokeWeight: 2,
        strokeColor: '#999',
        draggable: true,
        editable: true,
        clickable: true,
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
    },
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
        'BOTTOM_RIGHT',
      ];

      this.toolbarPosition =
        posTypes[Math.floor(Math.random() * posTypes.length)];
    },
    changeMapMode() {
      this.mapMode = this.mapMode === 'edit' ? 'ready' : 'edit';
    },
    setBooleanOptions(value) {
      return {
        ...value,
        editable: this.mapMode === 'edit',
        clickable: this.mapMode === 'edit',
        draggable: this.mapMode === 'edit',
      };
    },
  },
};
</script>
