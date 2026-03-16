<template>
  <div>
    A basic example of using a single info-window for 3 markers.

    <gmv-map
      :center="center"
      :zoom="15"
      style="width: 100%; height: 500px"
      map-id="DEMO_MAP_ID"
    >
      <gmv-info-window
        :content="infoOptions.content"
        :marker="infoOptions.marker"
        :opened="infoWinOpen"
        :pixel-offset="infoOptions.pixelOffset"
        :position="infoWindowPos"
        @closeclick="infoWinOpen = false"
      />

      <gmv-marker
        v-for="(m, i) in markers"
        :key="i"
        :ref="`marker${i}`"
        :clickable="true"
        :position="m.position"
        @click="toggleInfoWindow(m, i, $refs[`marker${i}`][0].markerInstance)"
      />
    </gmv-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: {
        lat: 47.376332,
        lng: 8.547511,
      },
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,

      infoOptions: {
        content: '',
        marker: undefined,
        //optional: offset info-window so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: 0,
        },
      },
      markers: [
        {
          position: {
            lat: 47.376332,
            lng: 8.547511,
          },
          infoText: '<strong>Marker 1</strong>',
        },
        {
          position: {
            lat: 47.374592,
            lng: 8.548867,
          },
          infoText: '<strong>Marker 2</strong>',
        },
        {
          position: {
            lat: 47.379592,
            lng: 8.549867,
          },
          infoText: '<strong>Marker 3</strong>',
        },
      ],
    };
  },
  methods: {
    toggleInfoWindow(marker, idx, markerInstance) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;
      this.infoOptions.marker = markerInstance;

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      // if different marker set info-window to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
  },
};
</script>
