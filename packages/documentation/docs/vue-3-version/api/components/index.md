---
id: introduction
sidebar_position: 1
sidebar_label: Introduction
---

# The `components` of the plugin

This plugin expose all **components types** from the following path `@gmap-vue/v3/components`.

```ts showLineNumbers
/**
 * Export all components
 * @property  {Object}  HeatmapLayer - Vue component HeatmapLayer
 * @property  {Object}  KmlLayer - Vue component KmlLayer
 * @property  {Object}  Marker - Vue component Marker
 * @property  {Object}  Polyline - Vue component Polyline
 * @property  {Object}  Polygon - Vue component Polygon
 * @property  {Object}  Circle - Vue component Circle
 * @property  {Object}  Cluster - Vue component Cluster
 * @property  {Object}  Rectangle - Vue component Rectangle
 * @property  {Object}  DrawingManager - Vue component DrawingManager
 * @property  {Object}  InfoWindow - Vue component InfoWindow
 * @property  {Object}  MapLayer - Vue component MapLayer
 * @property  {Object}  PlaceInput - Vue component PlaceInput
 * @property  {Object}  Autocomplete - Vue component Autocomplete
 * @property  {Object}  StreetViewPanorama - Vue component StreetViewPanorama
 */
export {
  Autocomplete,
  Circle,
  Cluster,
  DrawingManager,
  HeatmapLayer,
  InfoWindow,
  KmlLayer,
  MapLayer,
  Marker,
  Polyline,
  Polygon,
  Rectangle,
  StreetViewPanorama,
};
```

## How to use it

This object is useful to install only the components that you need, for example

```ts showLineNumbers
import { ref, ComponentInstance } from 'vue';
import type { MapLayer } from '@gmap-vue/v3/components';

const mapRef = ref<ComponentInstance<typeof MapLayer> | null>(null);
```

:::warning
Remember this path export component **types** not classes. This exports are only types not the final components classes.
:::
