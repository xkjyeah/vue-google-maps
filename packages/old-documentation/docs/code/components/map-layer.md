---
title: map-layer
---

  # Map

  
  > Map component
  
  
  
  
  
  [See]([source code](/guide/map.html#source-code))
,[See]([Official documentation](https://developers.google.com/maps/documentation/javascript/basics))
,[See]([Official reference](https://developers.google.com/maps/documentation/javascript/reference/map))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | resizeBus |  | undefined | - |  |
| center | The initial Map center.<br/>`@see` https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions | object | - |  |
| zoom | The initial Map zoom level. Valid values: Integers between zero, and up to the supported maximum zoom level.<br/>`@see` https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions | number | - | undefined |
| heading | The heading for aerial imagery in degrees measured clockwise from cardinal direction North. Headings are snapped to the nearest available angle for which imagery is available.<br/>`@see` https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions | number | - | undefined |
| mapTypeId | The initial Map mapTypeId. Defaults to ROADMAP.<br/>`@see` https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions | string | - | 'roadmap' |
| tilt | For vector maps, sets the angle of incidence of the map. The allowed values are restricted depending on the zoom level of the map. For raster maps, controls the automatic switching behavior for the angle of incidence of the map. The only allowed values are 0 and 45. The value 0 causes the map to always use a 0° overhead view regardless of the zoom level and viewport. The value 45 causes the tilt angle to automatically switch to 45 whenever 45° imagery is available for the current zoom level and viewport, and switch back to 0 whenever 45° imagery is not available (this is the default behavior). 45° imagery is only available for satellite and hybrid map types, within some locations, and at some zoom levels. Note: getTilt returns the current tilt angle, not the value specified by this option. Because getTilt and this option refer to different things, do not bind() the tilt property; doing so may yield unpredictable effects.<br/>`@see` https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions | number | - | undefined |
| options | Extra options that you want pass to the component | object | - | undefined |

  
  
## Methods

  
### resize
  > This method trigger the resize event of Google Maps

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  |  | undefined |  |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### resizePreserveCenter
  > Preserve the previous center when resize the map

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  |  | undefined |  |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### panBy
  > Changes the center of the map by the given distance in pixels. If the distance is less than both the width and height of the map, the transition will be smoothly animated. Note that the map coordinate system increases from west to east (for x values) and north to south (for y values).

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  |  | number | x - Number of pixels to move the map in the x direction. |
|  | number | y - Number of pixels to move the map in the y direction. |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### panTo
  > Changes the center of the map to the given LatLng. If the change is less than both the width and height of the map, the transition will be smoothly animated.

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  | latLng | union | The new center latitude/longitude of the map. (types `LatLng\|LatLngLiteral`) |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### panToBounds
  > Pans the map by the minimum amount necessary to contain the given LatLngBounds. It makes no guarantee where on the map the bounds will be, except that the map will be panned to show as much of the bounds as possible inside {currentMapSizeInPx} - {padding}. For both raster and vector maps, the map's zoom, tilt, and heading will not be changed.

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  | latLngBounds | union | The bounds to pan the map to. (types: `LatLngBounds\|LatLngBoundsLiteral`) |
|  | union | [padding] - optional Padding in pixels. A number value will yield the same padding on all 4 sides. The default value is 0. (types: `number\|Padding`) |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### fitBounds
  > Sets the viewport to contain the given bounds.
Note: When the map is set to display: none, the fitBounds function reads the map's size as 0x0, and therefore does not do anything. To change the viewport while the map is hidden, set the map to visibility: hidden, thereby ensuring the map div has an actual size. For vector maps, this method sets the map's tilt and heading to their default zero values.

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  | bounds | union | Bounds to show. (types: `LatLngBounds\|LatLngBoundsLiteral`) |
|  | union | [padding] - optional Padding in pixels. The bounds will be fit in the part of the map that remains after padding is removed. A number value will yield the same padding on all 4 sides. Supply 0 here to make a fitBounds idempotent on the result of getBounds. (types: `number\|Padding`) |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### getRecycleKey
  > Get the recycle key of the map

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  |  | undefined |  |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
  
  
## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  | center_changed |  | This event is fired when the map center property changes. It sends the position displayed at the center of the map. If the center or bounds have not been set then the result is undefined. (types: `LatLng\|undefined`)
| zoom_changed |  | This event is fired when the map zoom property changes. It sends the zoom of the map. If the zoom has not been set then the result is undefined. (types: `number\|undefined`)
| bounds_changed |  | This event is fired when the viewport bounds have changed. It sends The lat/lng bounds of the current viewport.

  
  
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  | default | The default slot is wrapped in a class that sets display: none; so by default any component you add to your map will be invisible. This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if you want to bring up things like toolboxes, etc. |  |
| visible | This slot must be used if you want to display content within the responsive wrapper for the map. |  |

  ---


  
  