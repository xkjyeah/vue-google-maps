/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div>
    <div ref="flyaway"> <!-- so named because it will fly away to another component -->
      <slot>
      </slot>
    </div>
  </div>
</template>

<script src="./infoWindowImpl.js">
// We still export this component as a Vue component,
// but we move the JS implementation out so that
// we don't have to make assumptions about the user's build environment
// (e.g. ES6 support)
</script>
