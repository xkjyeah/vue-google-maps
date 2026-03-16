---
title: kml-layer
---

  # Kml-Layer

  
  > KmlLayer component
  
  
  
  
  
  [See]([source code](/guide/kml-layer.html#source-code))
,[See]([Official documentation](https://developers.google.com/maps/documentation/javascript/kmllayer))
,[See]([Official reference](https://developers.google.com/maps/documentation/javascript/reference/kml))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | clickable | If true, the layer receives mouse events. Default value is true.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.clickable) | boolean | - | true |
| map | Specifies the Map on which to render the KmlLayer. You can hide a KmlLayer by setting this value to null within the setMap() method<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.map) | object | - | undefined |
| preserveViewport | By default, the input map is centered and zoomed to the bounding box of the contents of the layer. If this option is set to true, the viewport is<br/>left unchanged, unless the map's center and zoom were never set.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.preserveViewport) | boolean | - | false |
| screenOverlays | Whether to render the screen overlays. Default true.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.screenOverlays) | boolean | - | false |
| suppressInfoWindows | Suppress the rendering of info windows when layer features are clicked.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.suppressInfoWindows) | boolean | - | undefined |
| url | The URL of the KML document to display.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.url) | string | - | '' |
| zIndex | The z-index of the layer.<br/>`@see` [KmlLayerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/kml#KmlLayerOptions.zIndex) | number | - | undefined |
| options | More options that you can pass to the component<br/>`@value` boolean | object | - | undefined |

  
  
  
  
  ---


  
  