<template>
  <input
    type="text"
    :placeholder="placeholder"
    ref="input"
    v-model="innerValue"/>
</template>

<script>
export default (function (x) { return x.default || x })(require('./autocompleteImpl.js'))
</script>
