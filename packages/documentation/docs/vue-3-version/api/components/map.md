---
id: map
sidebar_position: 2
sidebar_label: Map
---

# Map

:::info Official sources

- [Reference](https://developers.google.com/maps/documentation/javascript/reference/map#Map)
- [Guide](https://developers.google.com/maps/documentation/javascript/overview#google.maps.Map)

:::

This component is a wrapper of the Google Map class.

:::note From the authors

> The JavaScript class that represents a map is the Map class. Objects of this class define a single map on a page. (You may create more than one instance of this class — each object will define a separate map on the page.) We create a new instance of this class using the JavaScript new operator. When you create a new map instance, you specify a `<div>` HTML element in the page as a container for the map. HTML nodes are children of the JavaScript document object, and we obtain a reference to this element via the document.getElementById() method. This code defines a variable (named map) and assigns that variable to a new Map object. The function Map() is known as a constructor and its definition is shown below: [reference](https://developers.google.com/maps/documentation/javascript/overview#google.maps.Map)
> :::

## Props

:::info
The _highlighted_ lines are the official props, we strongly recommend to read the [**official documentation**](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions).

**Here we only describe the custom props added by this plugin**
:::

```ts title="Map Layer props interface" showLineNumbers {41-75}
/**
 * MapOptions interface
 *
 * MapOptions object used to define the properties that can be set on a Map.
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.backgroundColor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.center
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.clickableIcons
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.controlSize
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDoubleClickZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggableCursor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggingCursor
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.fullscreenControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.fullscreenControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.heading
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.isFractionalZoomEnabled
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.keyboardShortcuts
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.mapTypeId
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.maxZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.minZoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.noClear
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.restriction
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.rotateControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.rotateControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scaleControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scaleControlOptions
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetView
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetViewControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.styles
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tilt
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoom
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoomControl
 * @see https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.zoomControlOptions
 */
export interface IMapLayerVueComponentProps {
  backgroundColor?: string;
  center: google.maps.LatLng | google.maps.LatLngLiteral;
  clickableIcons?: boolean;
  controlSize?: number;
  disableDefaultUI?: boolean;
  disableDoubleClickZoom?: boolean;
  draggableCursor?: string;
  draggingCursor?: string;
  fullscreenControl?: boolean;
  fullscreenControlOptions?: google.maps.FullscreenControlOptions;
  gestureHandling?: "cooperative" | "greedy" | "none" | "auto";
  heading?: number;
  isFractionalZoomEnabled?: boolean;
  keyboardShortcuts?: boolean;
  mapId?: string;
  mapTypeControl?: boolean;
  mapTypeControlOptions?: google.maps.MapTypeControlOptions;
  mapTypeId?: google.maps.MapTypeId;
  maxZoom?: number;
  minZoom?: number;
  noClear?: boolean;
  restriction?: google.maps.MapRestriction;
  rotateControl?: boolean;
  rotateControlOptions?: google.maps.RotateControlOptions;
  scaleControl?: boolean;
  scaleControlOptions?: google.maps.ScaleControlOptions;
  scrollwheel?: boolean;
  streetView?: google.maps.StreetViewPanorama;
  streetViewControl?: boolean;
  streetViewControlOptions?: google.maps.StreetViewControlOptions;
  styles?: google.maps.MapTypeStyle[];
  tilt?: number;
  zoom?: number;
  zoomControl?: boolean;
  zoomControlOptions?: google.maps.ZoomControlOptions;
  mapKey?: string;
  resizeBus?: Emitter<Record<EventType, unknown>>;
  options?: { [key: string]: any };
}
```

- **mapKey**:
  - _type_: `string`
  - _description_: A unique key to identify different instances of the `GmvMap` component. This always be prefixed with `__gmc__` as a recycle key to save the Google Map class instance into the global `window` object. For example if you set this prop with `'MyMap'` this results on `'__gmc__MyMap'` for the recycle key, that is returned by the exposed `getRecycleKey` method. and you should use this key to get the correct map promise using the `useMapPromise('MyMap')` composable. **This is the old `recycle` prop from `v2.0.1` and below**.

:::warning
For legacy compatibility we decide to maintain the old way to set the map key, eg: `options: { recycle: 'myMapKey' }` but, **we strongly recommend to use the new `mapKey` prop** because the old way should be removed in the next major release.
:::

- **resizeBus**:
  - _type_: `Emitter<Record<EventType, unknown>>;`
  - _description_: This is the resize bus, the default value is the `default resize bus` is an `emit` object. `EventType` is typed as `string | symbol` and the event is `unknown` because we can not know which events will you fire.
- **options**:
  - _type_: `Record<string, unknown>`
  - _description_: We use this prop as a fallback option. If the official API changes and add new props to the class you can use the options prop to use and populate these new props until we update our API to use it explicitly.

## Methods

:::note
We only document the exposed methods of the component
:::

- **panBy**:
  - _return type_: `void`
  - _params_:
    - `x: number`: Number of pixels to move the map in the x direction.
    - `y: number`: Number of pixels to move the map in the y direction.
  - _description_: Changes the center of the map by the given distance in pixels. If the distance is less than both the width and height of the map, the transition will be smoothly animated. Note that the map coordinate system increases from west to east (for x values) and north to south (for y values).

  ```ts showLineNumbers
  //...
  function panBy(x: number, y: number): void {
    if (mapInstance) {
      mapInstance.panBy(x, y);
    }
  }
  //...
  ```

- **panTo**:
  - _return type_: `void`
  - _params_:
    - `latLng`: [`google.maps.LatLng`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng) | [`google.maps.LatLngLiteral`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral): Number of pixels to move the map in the x direction.
  - _description_: Changes the center of the map to the given LatLng. If the change is less than both the width and height of the map, the transition will be smoothly animated.

  ```ts showLineNumbers
  //...
  function panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void {
    if (mapInstance) {
      mapInstance.panTo(latLng);
    }
  }
  //...
  ```

- **panToBounds**:
  - _return type_: `void`
  - _params_:
    - `latLngBounds`: [`google.maps.LatLngBounds`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds) | [`google.maps.LatLngBoundsLiteral`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral): The bounds to pan the map to.
    - `padding`: `number` | [`google.maps.Padding`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#Padding): optional Padding in pixels. A number value will yield the same padding on all 4 sides. The default value is 0.
  - _description_: Pans the map by the minimum amount necessary to contain the given LatLngBounds. It makes no guarantee where on the map the bounds will be, except that the map will be panned to show as much of the bounds as possible inside \{currentMapSizeInPx\} - \{padding\}. For both raster and vector maps, the map's zoom, tilt, and heading will not be changed.

  ```ts showLineNumbers
  //...
  function panToBounds(
    latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    padding: number | google.maps.Padding,
  ): void {
    if (mapInstance) {
      mapInstance.panToBounds(latLngBounds, padding);
    }
  }
  //...
  ```

- **fitBounds**:
  - _return type_: `void`
  - _params_:
    - `bounds`: [`google.maps.LatLngBounds`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds) | [`google.maps.LatLngBoundsLiteral`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral): Bounds to show.
    - `padding`: `number` | [`google.maps.Padding`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#Padding): optional Padding in pixels. The bounds will be fit in the part of the map that remains after padding is removed. A number value will yield the same padding on all 4 sides. Supply 0 here to make a fitBounds idempotent on the result of getBounds.
  - _description_: Sets the viewport to contain the given bounds.
  Note: When the map is set to display: none, the fitBounds function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to visibility: hidden, thereby ensuring the map div has an actual size. For vector maps, this method sets the map's tilt and heading to their default zero values.

  ```ts showLineNumbers
  //...
  function fitBounds(
    bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
    padding: number | google.maps.Padding,
  ): void {
    if (mapInstance) {
      mapInstance.fitBounds(bounds, padding);
    }
  }
  //...
  ```

- **_resizeCallback**:
  - _return type_: `void`
  - _description_: It executes the resize function passed to the component through the `resizeBus` prop.

  ```ts showLineNumbers
  //...
  _resizeCallback = (): void => {
  resizeFn();
  //...
  };

- **_delayedResizeCallback**:
  - _return type_: `Promise<void>`
  - _description_: It use the `nextTick` function to execute the `_resizeCallback` function.

  ```ts showLineNumbers
  //...
  _delayedResizeCallback = (): Promise<void> => {
    return nextTick(() => _resizeCallback());
  };
  //...
  ```

- **resize**:
  - _return type_: `void`
  - _description_: This method trigger the resize event of Google Maps.

  ```ts showLineNumbers
  //...
  function resize(): void {
    if (mapInstance) {
      google.maps.event.trigger(mapInstance, 'resize');
    }
  }
  //...
  ```

- **resizePreserveCenter**:
  - _return type_: `void`
  - _description_: Preserve the previous center when resize the map.

  ```ts showLineNumbers
  //...
  function resizePreserveCenter(): void {
    if (!mapInstance) {
      return;
    }

    const oldCenter = mapInstance.getCenter();
    google.maps.event.trigger(mapInstance, 'resize');

    if (oldCenter) {
      mapInstance.setCenter(oldCenter);
    }
  }
  //...
  ```

- **getRecycleKey**:
  - _return type_: `string`
  - _description_: Get the recycle key of the map. The default recycle key is `__gmc__`.

  ```ts showLineNumbers
  //...
  function getRecycleKey(): string {
    return props?.recycle ? `${recyclePrefix}${props.recycle}` : recyclePrefix;
  }
  //...
  ```

## Exposed const

- **mapPromise**:
  - _type_: `Promise<InstanceType<google.maps.Map> | undefined>`
  - _description_: This promise returns the Map class constructor when the Google Maps API is ready and successfully loaded.

## Events

- **bounds_changed**:
  - _Event type_: [`google.maps.LatLngBounds | undefined`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds)
  - _description_: This event is fired when the viewport bounds have changed.
- **center_changed**:
  - _Event type_: [`google.maps.LatLng | undefined`](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng)
  - _description_: This event is fired when the map center property changes.
- **click**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent) | [`google.maps.IconMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#IconMouseEvent)
  - _description_: This event is fired when the user clicks on the map. A MapMouseEvent with properties for the clicked location is returned unless a place icon was clicked, in which case an IconMouseEvent with a place ID is returned. IconMouseEvent and MapMouseEvent are identical, except that IconMouseEvent has the place ID field. The event can always be treated as an MapMouseEvent when the place ID is not important. The click event is not fired if a marker or info window was clicked.
- **contextmenu**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent)
  - _description_: This event is fired when the DOM contextmenu event is fired on the map container.
- **dblclick**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent)
  - _description_: This event is fired when the user double-clicks on the map. Note that the click event will sometimes fire once and sometimes twice, right before this one.
- **drag**:
  - _Event type_: `void`
  - _description_: This event is repeatedly fired while the user drags the map.
- **drag**:
  - _Event type_: `void`
  - _description_: This event is repeatedly fired while the user drags the map.
- **dragend**:
  - _Event type_: `void`
  - _description_: This event is fired when the user stops dragging the map.
- **dragstart**:
  - _Event type_: `void`
  - _description_: This event is fired when the user starts dragging the map.
- **heading_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the map heading property changes.
- **idle**:
  - _Event type_: `void`
  - _description_: This event is fired when the map becomes idle after panning or zooming.
- **isfractionalzoomenabled_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the isFractionalZoomEnabled property has changed.
- **mapcapabilities_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the map capabilities change.
- **maptypeid_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the mapTypeId property changes.
- **mousemove**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent)
  - _description_: This event is fired whenever the user's mouse moves over the map container.
- **mouseout**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent)
  - _description_: This event is fired when the user's mouse exits the map container.
- **mouseover**:
  - _Event type_: [`google.maps.MapMouseEvent`](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent)
  - _description_: This event is fired when the user's mouse enters the map container.
- **projection_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the projection has changed.
- **renderingtype_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the renderingType has changed.
- **tilesloaded**:
  - _Event type_: `void`
  - _description_: This event is fired when the visible tiles have finished loading.
- **tilt_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the map tilt property changes.
- **zoom_changed**:
  - _Event type_: `void`
  - _description_: This event is fired when the map zoom property changes.
- **resize**:
  - _Event type_: `void`
  - _description_: This event is fired when the map is resized.

## Slots

- **default**: The default slot is wrapped in a class that sets display: none; so by default any component you add to your map will be invisible. This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if you want to bring up things like toolboxes, etc.
- **visible**: This slot must be used if you want to display content within the responsive wrapper for the map.

```html showLineNumbers {5,7}
<template>
  <div class="gmv-map-container">
    <div ref="gmvMap" class="gmv-map"></div>
    <div class="gmv-map-hidden">
      <slot></slot>
    </div>
    <slot name="visible"></slot>
  </div>
</template>
```

## Provide/Inject

This component provides to its descendants a `mapPromise` to know when the map instance is ready to use.

From versions **above `v2.0.1`** every map promise si provided using the `mapKey` prop or using the `$mapPromise` key as the default value. If you have only one instance of the map you can avoid to set this prop but, **take care because if you have more than one map and forget to set the `mapKey`, the second instance of the map will override the promise of the first map and you will be using the same instance in both places** causing the issues described in the following [report](https://github.com/diegoazh/gmap-vue/issues/309).

:::warning
**From `v2.0.1` and below it only provides one promise with the default key `$mapPromise`**.
:::

```ts showLineNumbers
import { $mapPromise } from '@/keys';

//...
const { promiseDeferred: mapPromiseDeferred, promise } =
  useComponentPromiseFactory(defineMapKey() || $mapPromise);
provide(defineMapKey() || $mapPromise, promise);
//...
```

You can get the promise using `inject` like de following example but, only on the descendants of the `GmvMap` component, that mean only on components placed between the `GmvMap` tags.

```ts showLineNumbers
import { $mapPromise } from '@/keys';

//...
const mapPromise = inject($mapPromise); // if you are using only one map
const mapPromise = inject('mapKey'); // two or more instances needs to use the `mapKey` prop
//...
```

```html
<GmvMap>
  <YourComponentHere /> <!-- 👈🏼 Your component here can use inject to get the promise. -->
</GmvMap>
```

For other cases you can use the `useMapPromise` composable. Read more about it [`here`](/docs/vue-3-version/api/composables#usemappromise).

```ts
import { useMapPromise } from "@gmap-vue/v3/composables";

const mapPromise = useMapPromise('mapKey');
```

:::info
This `mapPromise` is exposed and you can access it from the component reference using `ref`.
:::

## Ref

To get a component reference for the `GmvMap`, please follow this [guide](/docs/vue-3-version/guide/basic-usage/map-reference).

## Source code

<details>
  <summary>`map-layer.vue` source code</summary>

```html showLineNumbers
<template>
  <div class="gmv-map-container">
    <div ref="gmvMap" class="gmv-map"></div>
    <div class="gmv-map-hidden">
      <!-- @slot The default slot is wrapped in a class that sets display: none; so by default any component you add to your map will be invisible. This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if you want to bring up things like toolboxes, etc. -->
      <slot></slot>
    </div>
    <!-- @slot This slot must be used if you want to display content within the responsive wrapper for the map.  -->
    <slot name="visible"></slot>
  </div>
</template>

<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  onMountedResizeBusHook,
  onUnmountedResizeBusHook,
  twoWayBindingWrapper,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useGoogleMapsApiPromiseLazy,
  usePluginOptions,
  useResizeBus,
  watchPrimitivePropertiesOnSetup,
} from '@/composables';
import type { IMapLayerVueComponentProps } from '@/interfaces';
import { $mapPromise, $recyclePrefix } from '@/keys';
import type { Emitter, EventType } from 'mitt';
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
} from 'vue';

/**
 * Map component
 * @displayName GmvMap
 * @see [source code](/guide/map.html#source-code)
 * @see [Official documentation](https://developers.google.com/maps/documentation/javascript/basics)
 * @see [Official reference](https://developers.google.com/maps/documentation/javascript/reference/map)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    backgroundColor?: string;
    center: google.maps.LatLng | google.maps.LatLngLiteral;
    clickableIcons?: boolean;
    controlSize?: number;
    disableDefaultUI?: boolean;
    disableDoubleClickZoom?: boolean;
    draggableCursor?: string;
    draggingCursor?: string;
    fullscreenControl?: boolean;
    fullscreenControlOptions?: google.maps.FullscreenControlOptions;
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto';
    heading?: number;
    isFractionalZoomEnabled?: boolean;
    keyboardShortcuts?: boolean;
    mapId?: string;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: google.maps.MapTypeControlOptions;
    mapTypeId?: google.maps.MapTypeId;
    maxZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    restriction?: google.maps.MapRestriction;
    rotateControl?: boolean;
    rotateControlOptions?: google.maps.RotateControlOptions;
    scaleControl?: boolean;
    scaleControlOptions?: google.maps.ScaleControlOptions;
    scrollwheel?: boolean;
    streetView?: google.maps.StreetViewPanorama;
    streetViewControl?: boolean;
    streetViewControlOptions?: google.maps.StreetViewControlOptions;
    styles?: google.maps.MapTypeStyle[];
    tilt?: number;
    zoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: google.maps.ZoomControlOptions;
    mapKey?: string;
    resizeBus?: Emitter<Record<EventType, unknown>>;
    options?: { [key: string]: any };
  }>(),
  {
    mapTypeId: globalThis?.google?.maps?.MapTypeId?.ROADMAP || 'roadmap',
    clickableIcons: true,
    disableDefaultUI: false,
    fullscreenControl: true,
    gestureHandling: 'auto',
    keyboardShortcuts: true,
    mapTypeControl: true,
    panControl: true,
    rotateControl: true,
    scaleControl: true,
    streetViewControl: true,
    zoomControl: true,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES AND EMITTERS
 ******************************************************************************/
const gmvMap = ref<HTMLElement | null>(null);
const emits = defineEmits<{
  bounds_changed: [value: google.maps.LatLngBounds | undefined];
  center_changed: [value: google.maps.LatLng | undefined];
  click: [value: google.maps.MapMouseEvent | google.maps.IconMouseEvent];
  contextmenu: [value: google.maps.MapMouseEvent];
  dblclick: [value: google.maps.MapMouseEvent];
  drag: [];
  dragend: [];
  dragstart: [];
  heading_changed: [];
  idle: [];
  isfractionalzoomenabled_changed: [];
  mapcapabilities_changed: [];
  maptypeid_changed: [];
  mousemove: [value: google.maps.MapMouseEvent];
  mouseout: [value: google.maps.MapMouseEvent];
  mouseover: [value: google.maps.MapMouseEvent];
  projection_changed: [];
  renderingtype_changed: [];
  tilesloaded: [];
  tilt_changed: [];
  zoom_changed: [value: number | undefined];
  resize: [];
}>();

/*******************************************************************************
 * RECYCLE KEY
 ******************************************************************************/
/**
 * Define de final mapKey.
 * This method is a legacy method to maintain compatibility with the old recycle key and should be removed in the next major release.
 *
 * @method defineMapKey
 * @returns {string}
 * @internal
 */
function defineMapKey(): string {
  return props?.mapKey
    ? props.mapKey
    : props?.options && props.options?.recycle
      ? props.options.recycle
      : '';
}

/**
 * Get the recycle key of the map
 * @method getRecycleKey
 * @returns {void}
 * @public
 */
function getRecycleKey(): string {
  return `${$recyclePrefix}${defineMapKey()}`;
}

/*******************************************************************************
 * MAP
 ******************************************************************************/
defineOptions({ name: 'map-layer' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: mapPromiseDeferred, promise } =
  useComponentPromiseFactory(defineMapKey() || $mapPromise);
provide(defineMapKey() || $mapPromise, promise);

/*******************************************************************************
 * RESIZE BUS
 ******************************************************************************/
const { currentResizeBus, _delayedResizeCallback } = useResizeBus();
let { _resizeCallback } = useResizeBus();

/**
 * This method trigger the resize event of Google Maps
 * @method resize
 * @returns {void}
 * @public
 */
async function resize(): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    google.maps.event.trigger(mapInstance, 'resize');
  }
}

/**
 * Preserve the previous center when resize the map
 * @method resizePreserveCenter
 * @returns {void}
 * @public
 */
async function resizePreserveCenter(): Promise<void> {
  const mapInstance = await promise;

  if (!mapInstance) {
    return;
  }

  const oldCenter = mapInstance.getCenter();
  google.maps.event.trigger(mapInstance, 'resize');

  if (oldCenter) {
    mapInstance.setCenter(oldCenter);
  }
}

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/
const finalLat = computed(() => {
  if (!props.center) {
    return console.warn('center is not defined');
  }

  return typeof props.center.lat === 'function'
    ? props.center.lat()
    : props.center.lat;
});
const finalLng = computed(() => {
  if (!props.center) {
    return console.warn('center is not defined');
  }

  return typeof props.center.lng === 'function'
    ? props.center.lng()
    : props.center.lng;
});
const finalLatLng = computed(
  () =>
    ({ lat: finalLat.value, lng: finalLng.value }) as google.maps.LatLngLiteral,
);

/*******************************************************************************
 * METHODS
 ******************************************************************************/
/**
 * Changes the center of the map by the given distance in pixels. If the distance is less than both the width and height of the map, the transition will be smoothly animated. Note that the map coordinate system increases from west to east (for x values) and north to south (for y values).
 * @method panBy
 * @param {number} x - Number of pixels to move the map in the x direction.
 * @param {number} y - Number of pixels to move the map in the y direction.
 * @returns {void}
 * @public
 */
async function panBy(x: number, y: number): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panBy(x, y);
  }
}

/**
 * Changes the center of the map to the given LatLng. If the change is less than both the width and height of the map, the transition will be smoothly animated.
 * @method panTo
 * @param {(LatLng|LatLngLiteral)} latLng - The new center latitude/longitude of the map. (types `LatLng|LatLngLiteral`)
 * @returns {void}
 * @public
 */
async function panTo(
  latLng: google.maps.LatLng | google.maps.LatLngLiteral,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panTo(latLng);
  }
}

/**
 * Pans the map by the minimum amount necessary to contain the given LatLngBounds. It makes no guarantee where on the map the bounds will be, except that the map will be panned to show as much of the bounds as possible inside {currentMapSizeInPx} - {padding}. For both raster and vector maps, the map's zoom, tilt, and heading will not be changed.
 * @method panToBounds
 * @param {(LatLngBounds|LatLngBoundsLiteral)} latLngBounds - The bounds to pan the map to. (types: `LatLngBounds|LatLngBoundsLiteral`)
 * @param {(number|Padding)} [padding] - optional Padding in pixels. A number value will yield the same padding on all 4 sides. The default value is 0. (types: `number|Padding`)
 * @returns {void}
 * @public
 */
async function panToBounds(
  latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  padding: number | google.maps.Padding,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.panToBounds(latLngBounds, padding);
  }
}

/**
 * Sets the viewport to contain the given bounds.
 Note: When the map is set to display: none, the fitBounds function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to visibility: hidden, thereby ensuring the map div has an actual size. For vector maps, this method sets the map's tilt and heading to their default zero values.
 * @method fitBounds
 * @param {(LatLngBounds|LatLngBoundsLiteral)} bounds - Bounds to show. (types: `LatLngBounds|LatLngBoundsLiteral`)
 * @param {(number|Padding)} [padding] - optional Padding in pixels. The bounds will be fit in the part of the map that remains after padding is removed. A number value will yield the same padding on all 4 sides. Supply 0 here to make a fitBounds idempotent on the result of getBounds. (types: `number|Padding`)
 * @returns {void}
 * @public
 */
async function fitBounds(
  bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral,
  padding: number | google.maps.Padding,
): Promise<void> {
  const mapInstance = await promise;

  if (mapInstance) {
    mapInstance.fitBounds(bounds, padding);
  }
}

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.zoom,
  async (newVal, oldValue) => {
    const mapInstance = await promise;

    if (mapInstance && newVal && newVal !== oldValue) {
      mapInstance.setZoom(newVal);
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onMounted(() => {
  useGoogleMapsApiPromiseLazy()
    .then(async () => {
      if (!gmvMap.value) {
        throw new Error(`we can find the template ref: 'gmvMap'`);
      }

      const mapLayerOptions: Partial<IMapLayerVueComponentProps> = {
        ...getPropsValuesWithoutOptionsProp(props),
        ...props.options,
      };

      const recycleKey = getRecycleKey();
      let mapInstance: google.maps.Map | undefined;

      if (window[recycleKey]) {
        gmvMap.value.appendChild(window[recycleKey].div);
        mapInstance = window[recycleKey].map as google.maps.Map;
        mapInstance.setOptions(mapLayerOptions);
      } else {
        const { Map } = (await google.maps.importLibrary(
          'maps',
        )) as google.maps.MapsLibrary;
        mapInstance = new Map(gmvMap.value, mapLayerOptions);
        window[recycleKey] = { map: mapInstance };
      }

      onMountedResizeBusHook(props, resizePreserveCenter);

      const mapLayerPropsConfig = getComponentPropsConfig('GmvMap');
      const mapLayerEventsConfig = getComponentEventsConfig('GmvMap', 'auto');

      // binding properties (two and one way)
      bindPropsWithGoogleMapsSettersAndGettersOnSetup(
        mapLayerPropsConfig,
        mapInstance,
        emits as any,
        props,
      );

      // Auto bind all events by default
      bindGoogleMapsEventsToVueEventsOnSetup(
        mapLayerEventsConfig,
        mapInstance,
        emits as any,
        excludedEvents,
      );

      // manually trigger center and zoom
      twoWayBindingWrapper(
        (
          increment: () => void,
          decrement: () => void,
          shouldUpdate: () => boolean,
        ) => {
          mapInstance?.addListener('center_changed', () => {
            if (shouldUpdate()) {
              /**
               * This event is fired when the map center property changes. It sends the position displayed at the center of the map. If the center or bounds have not been set then the result is undefined. (types: `LatLng|undefined`)
               *
               * @event center_changed
               * @type {(LatLng|undefined)}
               */
              emits('center_changed', mapInstance?.getCenter());
            }

            decrement();
          });

          const updateCenter = () => {
            increment();

            mapInstance?.setCenter(finalLatLng.value);
          };

          watchPrimitivePropertiesOnSetup(
            ['finalLat', 'finalLng'],
            updateCenter,
            { finalLat, finalLng },
          );
        },
      );

      mapInstance?.addListener('zoom_changed', () => {
        /**
         * This event is fired when the map zoom property changes. It sends the zoom of the map. If the zoom has not been set then the result is undefined. (types: `number|undefined`)
         *
         * @event zoom_changed
         * @type {(number|undefined)}
         */
        emits('zoom_changed', mapInstance?.getZoom());
      });
      mapInstance?.addListener('bounds_changed', () => {
        /**
         * This event is fired when the viewport bounds have changed. It sends The lat/lng bounds of the current viewport.
         *
         * @event bounds_changed
         * @type {LatLngBounds}
         */
        emits('bounds_changed', mapInstance?.getBounds());
      });

      if (!mapPromiseDeferred.resolve) {
        throw new Error('mapPromiseDeferred.resolve is undefined');
      }

      mapPromiseDeferred.resolve(mapInstance);
    })
    .catch((error) => {
      throw error;
    });
});

onBeforeUnmount(async () => {
  const mapInstance = await promise;

  if (mapInstance) {
    const recycleKey = getRecycleKey();

    if (window[recycleKey]) {
      window[recycleKey].div = mapInstance.getDiv();
    }
  }
});

onUnmounted(() => {
  onUnmountedResizeBusHook();
  useDestroyPromisesOnUnmounted(defineMapKey() || $mapPromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({
  mapPromise: promise,
  panBy,
  panTo,
  panToBounds,
  fitBounds,
  currentResizeBus,
  _resizeCallback,
  _delayedResizeCallback,
  resize,
  resizePreserveCenter,
  getRecycleKey,
});
</script>

<style lang="stylus" scoped>
.gmv-map-container {
  position: relative;

  .gmv-map {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
  }

  .gmv-map-hidden {
    display: none;
  }
}
</style>
```

</details>
