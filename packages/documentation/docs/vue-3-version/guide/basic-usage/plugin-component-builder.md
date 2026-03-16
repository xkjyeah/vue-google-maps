---
id: plugin-component-builder
sidebar_position: 8
sidebar_label: Plugin component builder
---
# Plugin component builder

To build your own component you can use the `pluginComponentBuilder` function. You need to provide the following options to it

```ts title="interfaces & types" showLineNumbers
export type SinglePluginComponentConfig = {
  noBind: string[];
  twoWay: string[];
  trackProperties: { [key: string]: string[] };
  events: {
    auto: string[];
    manual: string[]; // TODO: try to improve this to be an object with specific keys that can be used in the code
  };
};

export interface IVueProp {
  type?:
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor
    | ArrayConstructor
    | ObjectConstructor
    | DateConstructor
    | FunctionConstructor
    | SymbolConstructor;
  required?: boolean;
  default?: () => undefined;
  validator?: () => boolean;
}

export interface IGmapVueElementOptions {
  mappedProps: Omit<SinglePluginComponentConfig, 'events'>;
  props: { [key: string]: IVueProp };
  events: string[];
  name: string;
  ctr: () => any;
  ctrArgs: (
    options: { [key: string]: any },
    props: { [key: string]: IVueProp },
  ) => any[];
  beforeCreate: (options: { [key: string]: any }) => any;
  afterCreate: (mapElementInstance: { [key: string]: any }) => any;
}
```

## How to use it

```ts title="DirectionsRenderer.ts" showLineNumbers
import { helpers } from 'gmap-vue'
const { MapElementFactory } = helpers;

export default MapElementFactory({
  name: 'directionsRenderer',
  ctr: () => google.maps.DirectionsRenderer,
  //// The following is optional, but necessary if the constructor takes multiple arguments
  //// e.g. for GroundOverlay
  // ctrArgs: (options, otherProps) => [options],
  events: ['directions_changed'],

  // Mapped Props will automatically set up
  //   this.$watch('propertyName', (v) => instance.setPropertyName(v))
  //
  // If you specify `twoWay`, then it also sets up:
  //   google.maps.event.addListener(instance, 'propertyName_changed', () => {
  //     this.$emit('propertyName_changed', instance.getPropertyName())
  //   })
  //
  // If you specify `noBind`, then neither will be set up. You should manually
  // create your watchers in `afterCreate()`.
  mappedProps: {
    routeIndex: { type: Number },
    options: { type: Object },
    panel: { },
    directions: { type: Object },
    //// If you have a property that comes with a `_changed` event,
    //// you can specify `twoWay` to automatically bind the event, e.g. Map's `zoom`:
    // zoom: {type: Number, twoWay: true}
  },
  // Any other properties you want to bind. Note: Must be in Object notation
  props: {},
  // Actions you want to perform before creating the object instance using the
  // provided constructor (for example, you can modify the `options` object).
  // If you return a promise, execution will suspend until the promise resolves
  beforeCreate (options) {},
  // Actions to perform after creating the object instance.
  afterCreate (directionsRendererInstance) {},
})
```

Thereafter, it's easy to use the newly-minted component!

```html title="Options API" showLineNumbers
<template>
  <GmvMap :zoom="..." :center="...">
    <DirectionsRenderer />
  </GmvMap>
</template>
<script>
import DirectionsRenderer from './DirectionsRenderer.js'

export default {
  components: { DirectionsRenderer },
}
</script>
```

:::info

- Check the [`pluginComponentBuilder` API](/docs/vue-3-version/api/utilities#plugincomponentbuilder)

:::
