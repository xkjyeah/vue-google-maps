---
id: map-reference
sidebar_position: 2
sidebar_label: Map Reference
---

# Getting a map reference

## Reactive props

The `:center` prop on `GmvMap` and the `:position` prop on `GmvMarker` are **fully reactive**. Binding them to a reactive variable is all you need — updating the variable will automatically pan the map and move the marker with no imperative code required.

```html title="Composition API — reactive center & marker position" showLineNumbers
<template>
  <GmvMap :center="center" :zoom="14">
    <GmvMarker :position="center" />
  </GmvMap>
  <button @click="moveTo">Move to new location</button>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const center = ref({ lat: 1.32, lng: 103.8 });

  function moveTo() {
    center.value = { lat: 1.38, lng: 103.8 };
    // The map and marker update automatically — no panTo() or markerPromise needed
  }
</script>
```

:::note
Only use `panTo()` / `markerPromise` for **programmatic animations** (e.g. smooth pan without updating the bound state). For data-driven position changes, always use reactive props.
:::

## Accessing the map instance imperatively

If you need to gain access to the `Map` instance (e.g. to call `panToBounds`, `panTo`)

```html title="Options API" showLineNumbers {2,22,26}
<template>
  <GmvMap ref="mapRef" class="map" :center="center" :zoom="7"></GmvMap>
</template>
<script lang="ts">
  // import { type IMapLayerVueComponentExpose } from '@gmap-vue/v3/interfaces';

  export default {
    data() {
      return {
        center: {
          lat: 1.32,
          lng: 103.8,
        },
      };
    },
    mounted() {
      // At this point, the child GmapMap has been mounted, but
      // its map has not been initialized.
      // Therefore we need to write mapRef.$mapPromise.then(() => ...)

      // (this.$refs.mapRef as (typeof MapLayer & IMapLayerVueComponentExpose)).mapPromise // - useful to type the exposed method
      this.$refs.mapRef.mapPromise?.then((map) => {
        if (map) {
          setTimeout(() => {
            map.panTo({ lat: 1.0, lng: 100.0 });
            console.log(this.$refs.mapRef);
          }, 2000);
        }
      });
    },
  };
</script>
<style scoped>
  .map {
    height: 50vh;
    width: 50vw;
  }
</style>
```

```html title="Composition API" showLineNumbers {2,10,11,17-24}
<template>
  <GmvMap ref="mapRef" class="map" :center="center" :zoom="7"></GmvMap>
</template>

<script setup lang="ts">
  import { useMapPromise } from "@gmap-vue/v3/composables";
  import { onMounted, ref } from "vue";
  import { MapLayer } from "@gmap-vue/v3/components";

  const mapRef = ref<typeof MapLayer | null>(null);
  const mapPromise = useMapPromise();
  const center = {
    lat: 1.32,
    lng: 103.8,
  };
  onMounted(() => {
    mapPromise?.then((map) => {
      if (map) {
        setTimeout(() => {
          map.panTo({ lat: 1.0, lng: 100.0 });
          console.log(mapRef.value);
        }, 2000);
      }
    });
  });
</script>

<style scoped>
  .map {
    height: 50vh;
    width: 50vw;
  }
</style>
```

## Typing a component ref

:::info
To safety type a ref of one of the plugin components is to add the following to your `main.ts` file

```ts title="main.ts" showLineNumbers {11}
import { ComponentInstance } from "vue";
import { MapLayer } from "@gmap-vue/v3/components";
import { type IMapLayerVueComponentExpose } from "@gmap-vue/v3/interfaces";

/**
 * Vue augmentations
 */
declare module "vue" {
  interface ComponentCustomProperties {
    $refs: {
      mapRef: ComponentInstance<typeof MapLayer & IMapLayerVueComponentExpose>;
    };
  }
}
```

:::

## The `inject` issue

:::warning

In this example you can not use the `inject` method to get the mapPromise as we show below

```ts title="Composition API" showLineNumbers
import { inject } from "vue";
import { $mapPromise } from "@gmap-vue/v3/keys";

const mapPromise = inject($mapPromise);
```

Why not? because you can use `inject` in a child component, that means in any component that you put between `<GmvMap ref="mapRef" class="map" :center="center" :zoom="7"> ... </GmvMap>`.

In the examples above our component is the parent of the `GmvMap` component and the `provide` function was not executed yet, and we can not `inject` something that is not `provided` yet. Simple but tricky in a simple overview.

:::
