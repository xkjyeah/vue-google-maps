<template>
  <div>
    <h3>Test</h3> "Singapore" should appear in the text box on page load. No errors in console.
    <gmap-place-input default-place="Singapore" @place_changed="updatePlace">
    </gmap-place-input>
    {{place && place.lat}}, {{place && place.lng}},
  </div>
</template>

<script>
export default {
  name: 'eg-place-default',
  data () {
    return {
      place: null
    }
  },
  methods: {
    updatePlace(what) {
      this.place = {
        lat: what.geometry.location.lat(),
        lng: what.geometry.location.lng()
      };
    }
  }
}
</script>
