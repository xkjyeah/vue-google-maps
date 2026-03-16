<template>
  <span v-if="$scopedSlots['input']">
    <slot name="input" v-bind:attrs="$attrs" v-bind:listeners="$listeners" :ref="input"></slot>
  </span>
  <input v-else-if="!$scopedSlots['input']" ref="input" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default ((x) => x.default || x)(require('../components-implementation/autocomplete'))
</script>
