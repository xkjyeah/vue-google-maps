---
title: circle-shape
---

  # GmapCircle

  
  > Circle component
  
  
  
  
  
  [See]([source code](/guide/circle.html#source-code))
,[See]([official reference](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Circle))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | center | The center of the Circle.<br/>`@value` { lat: 41.878, lng: -87.629 }<br/>`@see` [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.center) | object | - |  |
| radius | The radius in meters on the Earth's surface.<br/>`@value` 10<br/>`@see` [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.radius) | number | - | 10 |
| clickable | Indicates whether this Polygon handles mouse events. Defaults to true.<br/>`@value` true, false<br/>`@see` [Circle draggable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.clickable) | boolean | - | false |
| draggable | If set to true, the user can drag this circle over the map. Defaults to false.<br/>`@value` true, false<br/>`@see` [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.draggable) | boolean | - | false |
| editable | If set to true, the user can edit this circle by dragging the control points shown at the center and around the circumference of the circle. Defaults to false.<br/>`@value` true, false<br/>`@see` [Circle simple](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.editable) | boolean | - | false |
| fillColor | The fill color. All CSS3 colors are supported except for extended named colors.<br/>`@value` '#000'<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillColor) | string | - | '' |
| fillOpacity | The fill opacity between 0.0 and 1.0<br/>`@value` 1<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.fillOpacity) | number | - | 1 |
| strokeColor | The stroke color. All CSS3 colors are supported except for extended named colors.<br/>`@value` '#000'<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeColor) | string | - | '' |
| strokeOpacity | The stroke opacity between 0.0 and 1.0.<br/>`@value` 1<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeOpacity) | number | - | 1 |
| strokePosition | The stroke position. Defaults to CENTER.<br/>`@value` 1<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokePosition)<br/>`@see` [StrokePosition constant](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#StrokePosition) | number | - | 0 |
| strokeWeight | The stroke width in pixels.<br/>`@value` 1<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.strokeWeight) | number | - | 1 |
| visible | Whether this polyline is visible on the map. Defaults to true.<br/>`@value` 1<br/>`@see` [Circle editable](https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#CircleOptions.visible) | boolean | - | true |
| options | The Google Maps circle options<br/>`@value` {<br/>        strokeColor: "#FF0000",<br/>        strokeOpacity: 0.8,<br/>        strokeWeight: 2,<br/>        fillColor: "#FF0000",<br/>        fillOpacity: 0.35,<br/>        map,<br/>        center: citymap[city].center,<br/>        radius: Math.sqrt(citymap[city].population) * 100,<br/>      }<br/>`@see` [Circle simple](https://developers.google.com/maps/documentation/javascript/examples/circle-simple) | object | - | undefined |

  
  
  
  
  ---


  
  