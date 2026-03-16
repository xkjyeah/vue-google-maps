<template>
  <div>
    <h3>For live examples set a valid gmap api key</h3>
    <label for="gmap_key">
      gmap api key <input type="text" name="gmap_key" id="gmap_key" v-model="options.key" @keypress.enter="setValidKey">
    </label>
    <br><br>
    <label for="libraries">
      libraries <input type="text" name="libraries" id="libraries" v-model="options.libraries" @keypress.enter="setValidKey">
      <br>
      <small>Eg: places,routes,drawing,visualization depending on your requirements</small>
    </label>
    <br><br>
    <button @click="setValidKey">set gmap key</button>
    <br><br>
    <p>{{ stateProcess }}</p>
  </div>
</template>

<script>
export default {
  name: 'set-valid-api-key',
  props: {
    libraries: String,
  },
  data () {
    return {
      options: {
        key: '',
        libraries: 'places',
        installComponents: true,
      },
      stateProcess: ''
    }
  },
  methods: {
    setValidKey() {
      this.stateProcess = 'Procesing, please wait...'
      const options = { ...this.options }
      options.libraries = options.libraries.replace(/\s/, '')
      options.callback = 'GoogleMapsCallback'
      let baseUrl = 'https://maps.googleapis.com/'

      const query = Object.keys(options)
        .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(options[key]))
        .join('&')

      const url = `${baseUrl}maps/api/js?${query}`

      const scripts = document.getElementsByTagName('script');
      const script = Object.values(scripts).filter((script) => script.src.includes('https://maps.googleapis.com/maps/api/js'))

      if (script.length) {
        script[0].src = url;
      } else {
        const googleMapScript = document.createElement('script')
        googleMapScript.setAttribute('src', url)
        googleMapScript.setAttribute('async', '')
        googleMapScript.setAttribute('defer', '')
        document.head.appendChild(googleMapScript)
      }

      this.stateProcess = 'Gmap is ready :)'
      this.$emit('is-valid', true)
    }
  },
  mounted() {
    if (this.libraries) {
      this.options.libraries = this.libraries;
    }
  }
}
</script>
