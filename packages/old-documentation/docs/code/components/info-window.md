---
title: info-window
---

  # Info-Window

  
  > InfoWindow component
  
  
  
  
  
  [See]([source code](/guide/info-window.html#source-code))
,[See]([Official documentation](https://developers.google.com/maps/documentation/javascript/infowindows))
,[See]([Official reference](https://developers.google.com/maps/documentation/javascript/reference/info-window))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | content | NOTE: This prop overrides the content of the default slot, use only one of them, not both at the same time<br/>Content to display in the InfoWindow. This can be an HTML element, a plain-text string, or a string containing HTML. The InfoWindow will be sized according to the content. To set an explicit size for the content, set content to be a HTML element with that size.<br/>`@value` undefined<br/>`@see` [InfoWindow content](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.content) | string\|object | - | undefined |
| opened | Determines if the info-window is open or not | boolean | - | true |
| position | Contains the LatLng at which this info window is anchored.<br/>Note: An InfoWindow may be attached either to a Marker object<br/>(in which case its position is based on the marker's location)<br/>or on the map itself at a specified LatLng.<br/><br/>The LatLng at which to display this InfoWindow. If the InfoWindow is opened with an anchor, the anchor's position will be used instead.<br/>`@value` undefined<br/>`@type` LatLng\|LatLngLiteral<br/>`@see` [InfoWindow position](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.position) | object | - | undefined |
| zIndex | All InfoWindows are displayed on the map in order of their zIndex, with higher values displaying in front of InfoWindows with lower values. By default, InfoWindows are displayed according to their latitude, with InfoWindows of lower latitudes appearing in front of InfoWindows at higher latitudes. InfoWindows are always displayed in front of markers.<br/>`@value` 0<br/>`@see` [InfoWindow position](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindowOptions.zIndex) | number | - | 0 |
| options | Extra options that you want to pass to the component | object | - | undefined |

  
  
  
  
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  | default | Used to set your info window. |  |

  ---


  
  