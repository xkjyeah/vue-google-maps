import type {
  TPluginComponentConfig,
  TPluginComponentNames,
  ISinglePluginComponentConfig,
} from '@/types';

const componentConfigs: TPluginComponentConfig = {
  GmvMap: {
    noBind: ['resizeBus', 'center', 'zoom', 'options'],
    twoWay: ['heading', 'mapTypeId', 'tilt'],
    trackProperties: {},
    events: {
      /**
       * @see https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
       */
      auto: [
        'click',
        'contextmenu',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'heading_changed',
        'idle',
        'isfractionalzoomenabled_changed',
        'mapcapabilities_changed',
        'maptypeid_changed',
        'mousemove',
        'mouseout',
        'mouseover',
        'projection_changed',
        'renderingtype_changed',
        'tilesloaded',
        'tilt_changed',
        'zoom_changed',
        'resize',
      ],
      manual: ['bounds_changed', 'center_changed', 'zoom_changed'],
    },
  },
  GmvMarker: {
    noBind: [],
    twoWay: [
      'animation',
      'clickable',
      'cursor',
      'draggable',
      'icon',
      'position',
      'shape',
      'title',
      'visible',
      'zIndex',
    ],
    trackProperties: {},
    events: {
      auto: ['click', 'drag', 'dragstart', 'gmp-click'],
      manual: ['dragend', 'update:position'],
    },
  },
  GmvCluster: {
    noBind: [],
    twoWay: [],
    trackProperties: {},
    events: {
      auto: [
        'clusteringbegin',
        'clusteringend',
        'click',
        'rightclick',
        'dblclick',
        'drag',
        'dragstart',
        'dragend',
        'mouseup',
        'mousedown',
        'mouseover',
        'mouseout',
      ],
      manual: [],
    },
  },
  GmvInfoWindow: {
    noBind: ['ariaLabel', 'options'],
    twoWay: [
      'content',
      'disableAutoPan',
      'maxWidth',
      'minWidth',
      'pixelOffset',
      'position',
      'zIndex',
    ],
    trackProperties: {},
    events: {
      /**
       * @see https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow-Events
       */
      auto: [
        'close',
        'closeclick',
        'content_changed',
        'domready',
        'position_changed',
        'visible',
        'zindex_changed',
      ],
      manual: [],
    },
  },
  GmvAutocomplete: {
    noBind: ['componentRestrictions'],
    twoWay: [],
    trackProperties: {},
    events: {
      auto: [],
      manual: ['place_changed'],
    },
  },
  GmvKmlLayer: {
    noBind: [
      'clickable',
      'preserveViewport',
      'screenOverlays',
      'suppressInfoWindows',
    ],
    twoWay: ['map', 'zIndex'],
    trackProperties: {},
    events: {
      auto: ['click', 'defaultviewport_changed', 'status_changed'],
      manual: [],
    },
  },
  GmvStreetViewPanorama: {
    noBind: ['position'],
    twoWay: ['pov', 'pano', 'visible'],
    trackProperties: {
      pov: ['pitch', 'heading'],
    },
    events: {
      auto: [
        'closeclick',
        'pano_changed',
        'position_changed',
        'pov_changed',
        'resize',
        'status_changed',
        'visible_changed',
        'zoom_changed',
      ],
      manual: ['position_changed'],
    },
  },
  GmvHeatmapLayer: {
    noBind: [],
    twoWay: ['data'],
    trackProperties: {},
    events: {
      auto: ['data_changed'],
      manual: [],
    },
  },
  GmvCircle: {
    noBind: [
      'clickable',
      'fillColor',
      'fillOpacity',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
      '',
    ],
    twoWay: ['center', 'radius'],
    trackProperties: {},
    events: {
      auto: [
        'center_changed',
        'click',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'radius_changed',
        'rightclick',
      ],
      manual: [],
    },
  },
  GmvPolygon: {
    noBind: [
      'clickable',
      'fillColor',
      'fillOpacity',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
      'path',
      'paths',
    ],
    twoWay: [],
    trackProperties: {},
    events: {
      auto: [
        'click',
        'contextmenu',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
      ],
      manual: [],
    },
  },
  GmvPolyline: {
    noBind: ['clickable', 'strokeColor', 'strokeOpacity', 'strokeWeight'],
    twoWay: ['path'],
    trackProperties: {},
    events: {
      /**
       * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Polyline-Events
       */
      auto: [
        'click',
        'contextmenu',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
      ],
      manual: [],
    },
  },
  GmvRectangle: {
    noBind: [
      'clickable',
      'fillColor',
      'fillOpacity',
      'strokeColor',
      'strokeOpacity',
      'strokePosition',
      'strokeWeight',
    ],
    twoWay: ['bounds', ''],
    trackProperties: {},
    events: {
      /**
       * @see https://developers.google.com/maps/documentation/javascript/reference/polygon?hl=es#Rectangle-Events
       */
      auto: [
        'bounds_changed',
        'click',
        'contextmenu',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
      ],
      manual: [],
    },
  },
  GmvDrawingManager: {
    noBind: [
      'circleOptions',
      'markerOptions',
      'polygonOptions',
      'polylineOptions',
      'rectangleOptions',
    ],
    twoWay: [],
    trackProperties: {},
    events: {
      auto: [
        'circlecomplete',
        'markercomplete',
        'polygoncomplete',
        'polylinecomplete',
        'rectanglecomplete',
      ],
      manual: [
        'overlaycomplete',
        'update:shapes',
        'added:shape',
        'removed:shape',
      ],
    },
  },
};

/**
 * Return the configuration for props on every component
 * @internal
 *
 * @param {string} componentName - The name of the component that should be found
 * @returns {SinglePluginComponentConfigWithoutEvents}
 */
export function getComponentPropsConfig(
  componentName: TPluginComponentNames,
): Omit<ISinglePluginComponentConfig, 'events'> {
  const { events, ...config } = componentConfigs[componentName];
  return config;
}

/**
 * Return the map events attached to the Google Maps Instance
 * @internal
 *
 * @param {string} componentName - The name of the component that should be found
 * @param {'auto'|'manual'} type
 * @returns {string[]}
 */
export function getComponentEventsConfig(
  componentName: TPluginComponentNames,
  type?: 'auto' | 'manual',
): string[] {
  if (type) {
    return componentConfigs[componentName].events[type];
  }

  return [
    ...componentConfigs[componentName].events.auto,
    ...componentConfigs[componentName].events.manual,
  ];
}
