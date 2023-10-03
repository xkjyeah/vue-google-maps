/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
  <div>
    <div ref="flyaway"> <!-- so named because it will fly away to another component -->
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
import r from "../components-implementation/info-window";
export default ((x) => x.default || x)(r)
</script>
