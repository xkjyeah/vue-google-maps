<template>
  <input type="text" :placeholder="placeholder" ref="input"
    :value="value" v-on="$listeners"/>
</template>

<script>
export default (x => x.default || x)(require('./autocompleteImpl.js'))
</script>
