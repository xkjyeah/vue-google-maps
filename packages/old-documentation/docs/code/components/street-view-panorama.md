---
title: street-view-panorama
---

  # GmapStreetViewPanorama

  
  > Street View Panorama component
  
  
  
  
  
  [See]([source code](/guide/street-view-panorama.html#source-code))
,[See]([official docs](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanorama))

  

  
## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  | resizeBus |  | undefined | - |  |
| zoom | The zoom of the panorama, specified as a number. A zoom of 0 gives a 180 degrees Field of View.<br/>`@value` number<br/>`@see` [StreetViewPanorama zoom](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.zoom) | number | - | undefined |
| pov | The camera orientation, specified as heading and pitch, for the panorama.<br/>`@value` object<br/>`@type` StreetViewPov<br/>`@see` [StreetViewPanorama pov](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pov) | object | - | undefined |
| position | The LatLng position of the Street View panorama.<br/>`@value` object<br/>`@type` LatLng\|LatLngLiteral<br/>`@see` [StreetViewPanorama position](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.position) | object | - | undefined |
| pano | The panorama ID, which should be set when specifying a custom panorama.<br/>`@value` string<br/>`@see` [StreetViewPanorama pano](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.pano) | string | - | undefined |
| motionTracking | Whether motion tracking is on or off. Enabled by default when the motion tracking control is present, so that the POV (point of view) follows the orientation of the device. This is primarily applicable to mobile devices. If motionTracking is set to false while motionTrackingControl is enabled, the motion tracking control appears but tracking is off. The user can tap the motion tracking control to toggle this option.<br/>`@value` boolean<br/>`@see` [StreetViewPanorama motionTracking](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.motionTracking) | boolean | - |  |
| visible | If true, the Street View panorama is visible on load.<br/>`@value` boolean<br/>`@see` [StreetViewPanorama visible](https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=es#StreetViewPanoramaOptions.visible) | boolean | - | true |
| options | More options that you can pass to the component<br/>`@value` boolean | object | - | undefined |

  
  
  
## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  | position_changed |  | 

  
  
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  | default | A default slot to render the street view panorama |  |

  ---


  
  