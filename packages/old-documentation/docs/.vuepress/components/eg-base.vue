<template>
  <div>
    <div v-if="!isReady">
      <set-valid-api-key @is-valid="isValidKey" :libraries="libraries"></set-valid-api-key>
    </div>
    <div v-else>
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'eg-base',
  props: {
    libraries: {
      type: String,
      default: 'places'
    },
  },
  data() {
    return {
      isReady: false
    }
  },
  computed: {},
  methods: {
    isValidKey(event) {
      this.isReady = event
    }
  }
}
</script>
