<template>
  <div>
    <p>You should see a <strong>blue status bar in the left bottom corner</strong>, with a description of the place at the position of the marker when you move your mouse over the markers.</p>

    <gmap-map
      :center="center"
      :zoom="15"
      style="width: 100%; height: 500px"
    >
      <gmap-marker
        v-for="m in markers"
        :position="{lat: m.position[0], lng: m.position[1]}"
        :clickable="true"
        :draggable="true"
        @click="center = m.position"
        @mouseover="statusText = m.text"
        @mouseout="statusText = null"
      ></gmap-marker>

      <div slot="visible">
        <div style="bottom: 0; left: 0; background-color: #0000FF; color: white; position: absolute; z-index: 100">
          {{statusText}}
        </div>
      </div>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'eg-status-bar-information',
  data () {
    return {
      center: {lat: 47.376332, lng: 8.547511},
      statusText: '',
      markers: [
        {
          position: [47.376332, 8.547511],
          text: 'Hauptgebäude der ETH Zürich'
        },
        {
          position: [47.374592, 8.548867],
          text: 'Hauptgebäude der Universität Zürich'
        }
      ],
    };
  },
}
</script>
