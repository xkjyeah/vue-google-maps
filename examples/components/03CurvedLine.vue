<template>
  <div>
    Click twice on the map!

    <GmapMap style="width: 600px; height: 400px;" :zoom="1" :center="{lat: 0, lng: 0}"
        ref="map" @click="clicked">
      <GmapMarker v-if="start" :position="start.latLng" label="S" />
      <GmapMarker v-if="end" :position="end.latLng" label="E" />
      <GmapPolyline v-if="curvedPath" :path="curvedPath" />
    </GmapMap>
  </div>
</template>

<script>
import {range} from 'lodash'

export default {
  data () {
    return {
      start: null,
      end: null,
    }
  },
  description: `
  In which a curved polyline is drawn on the map
  `,
  computed: {
    curvedPath () {
      /*
        FIXME: This formula will work for short distances away from
          the poles. It will not work once the curvature of the earth is
          too great
      */
      if (this.start && this.end) {
        return range(100)
          .map(i => {
            const tick = i / 99

            /* Bezier curve -- set up the control points */
            const dlat = this.end.latLng.lat() - this.start.latLng.lat()
            const dlng = this.end.latLng.lng() - this.start.latLng.lng()

            const cp1 = {
              lat: this.start.latLng.lat() + 0.33 * dlat + 0.33 * dlng,
              lng: this.start.latLng.lng() - 0.33 * dlat + 0.33 * dlng,
            }

            const cp2 = {
              lat: this.end.latLng.lat() - 0.33 * dlat + 0.33 * dlng,
              lng: this.end.latLng.lng() - 0.33 * dlat - 0.33 * dlng,
            }

            /* Bezier curve formula */
            return {
              lat:
                (tick * tick * tick) * this.start.latLng.lat() +
                3 * ((1 - tick) * tick * tick) * cp1.lat +
                3 * ((1 - tick) * (1 - tick) * tick) * cp2.lat +
                ((1 - tick) * (1 - tick) * (1 - tick)) * this.end.latLng.lat(),
              lng:
                (tick * tick * tick) * this.start.latLng.lng() +
                3 * ((1 - tick) * tick * tick) * cp1.lng +
                3 * ((1 - tick) * (1 - tick) * tick) * cp2.lng +
                ((1 - tick) * (1 - tick) * (1 - tick)) * this.end.latLng.lng(),
            }
          })
      }
    }
  },
  methods: {
    clicked (e) {
      if (!this.start && !this.end) {
        this.start = {
          latLng: e.latLng
        }
      } else if (this.start && !this.end) {
        this.end = {
          latLng: e.latLng
        }
      } else {
        this.start = {
          latLng: e.latLng
        }
        this.end = null
      }
    }
  }
}
</script>
