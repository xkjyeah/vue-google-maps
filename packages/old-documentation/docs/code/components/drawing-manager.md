---
title: drawing-manager
---

  # GmapDrawingManager

  
  > DrawingManager component
  
  
  
  
  
  [See]([source code](/guide/drawing-manager.html#source-code))
,[See]([Official documentation](https://developers.google.com/maps/documentation/javascript/drawinglayer))
,[See]([Official reference](https://developers.google.com/maps/documentation/javascript/reference/drawing))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | circleOptions | The circle options<br/>`@see` [circleOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#CircleOptions) | object | - | undefined |
| markerOptions | The marker options<br/>`@see` [markerOptions interface](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions) | object | - | undefined |
| polygonOptions | The polygon options<br/>`@see` [polygonOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolygonOptions) | object | - | undefined |
| polylineOptions | The polyline options<br/>`@see` [polylineOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolylineOptions) | object | - | undefined |
| rectangleOptions | The rectangle options<br/>`@see` [rectangleOptions interface](https://developers.google.com/maps/documentation/javascript/reference/polygon#RectangleOptions) | object | - | undefined |
| position | The position of the toolbar<br/>**Possible values**: `'TOP_CENTER', 'TOP_LEFT', 'TOP_RIGHT', 'LEFT_TOP', 'RIGHT_TOP', 'LEFT_CENTER',<br/>'RIGHT_CENTER', 'LEFT_BOTTOM', 'RIGHT_BOTTOM', 'BOTTOM_CENTER', 'BOTTOM_LEFT', 'BOTTOM_RIGHT'` | string | - | '' |
| shapes | An array of shapes that you can set to render in the map and saves on it the new shapes that you add. | array | - |  |

  
  
## Methods

  
### setDrawingMode
  > The setDrawingMode method is binded into the default component slot

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  | mode | string | mode - Possible values 'marker', 'circle', 'polygon', 'polyline', 'rectangle', null |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
### deleteSelection
  > The deleteSelection method is binded into the default component slot

  
#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  |  | mixed | It doesn't requires any parameter |

  
#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | void |  |
  
  
  
  
## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  | update:shapes | **place** `array` - `this.finalShapes` | update:shapes event

  
  
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  | default | Used to set your drawing manager | <br/> |

  ---


  
  