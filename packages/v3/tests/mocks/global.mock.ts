import { vi } from 'vitest';

export type MockComponentConstructorWithHTML = (
  html?: HTMLElement,
  options?: Record<string, unknown>,
) => void;
export type MockComponentConstructorWithoutHTML = (
  options?: Record<string, unknown>,
) => void;

export const valueMocks = {
  place: { lat: 1, lng: 1 },
  center: { lat: 2, lng: 2 },
  zoom: 4,
  bounds: { lat: 3, lng: 3 },
};

export const autocompleteValues: {
  input?: unknown;
  options?: Record<string, unknown>;
  placeChanged?: () => void;
} = {
  input: undefined,
  options: undefined,
  placeChanged: undefined,
};

export const mapValues: {
  input?: unknown;
  options?: Record<string, unknown>;
  centerChanged?: () => void;
  zoomChanged?: () => void;
  boundsChanged?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapInstance?: any;
} = {
  input: undefined,
  options: undefined,
  centerChanged: undefined,
  zoomChanged: undefined,
  boundsChanged: undefined,
  mapInstance: undefined,
};

export const markerValues: {
  input?: unknown;
  options?: Record<string, unknown>;
  updatePosition?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerInstance?: any;
} = {
  input: undefined,
  options: undefined,
  updatePosition: undefined,
  markerInstance: undefined,
};

export const circleValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const clusterValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const drawingValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const heatmapValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const infoWindowValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const kmlLayerValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const polygonValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const polylineValues: {
  options?: Record<string, unknown>;
} = {
  options: undefined,
};

export const streetViewValues: {
  html?: HTMLElement;
  options?: Record<string, unknown>;
  setPosition?: ReturnType<typeof vi.fn>;
} = {
  html: undefined,
  options: undefined,
  setPosition: undefined,
};

export const googleMock = {
  maps: {
    importLibrary: (): {
      Autocomplete: MockComponentConstructorWithHTML;
      Map: MockComponentConstructorWithHTML;
      AdvancedMarkerElement: MockComponentConstructorWithoutHTML;
      Circle: MockComponentConstructorWithoutHTML;
      DrawingManager: MockComponentConstructorWithoutHTML;
      HeatmapLayer: MockComponentConstructorWithoutHTML;
      InfoWindow: MockComponentConstructorWithoutHTML;
      KmlLayer: MockComponentConstructorWithoutHTML;
      Polygon: MockComponentConstructorWithoutHTML;
      Polyline: MockComponentConstructorWithoutHTML;
      StreetViewPanorama: MockComponentConstructorWithHTML;
    } => ({
      Autocomplete: function (
        html?: HTMLElement,
        options?: Record<string, unknown>,
      ) {
        autocompleteValues.input = html;
        autocompleteValues.options = options;
        this.getPlace = vi.fn().mockReturnValue(valueMocks.place);
        this.addListener = (name: string, cbk: () => void) => {
          if (name === 'place_changed') {
            autocompleteValues.placeChanged = cbk;
          }
        };
      },
      Map: function (html?: HTMLElement, options?: Record<string, unknown>) {
        mapValues.input = html;
        mapValues.options = options;
        this.getCenter = vi.fn().mockReturnValue(valueMocks.center);
        this.setCenter = vi.fn();
        this.getZoom = vi.fn().mockReturnValue(valueMocks.zoom);
        this.setZoom = vi.fn();
        this.getBounds = vi.fn().mockReturnValue(valueMocks.bounds);
        this.getDiv = vi.fn();
        mapValues.mapInstance = this;
        this.addListener = (name: string, cbk: () => void) => {
          if (name === 'center_changed') {
            mapValues.centerChanged = cbk;
          }
          if (name === 'zoom_changed') {
            mapValues.zoomChanged = cbk;
          }
          if (name === 'bounds_changed') {
            mapValues.boundsChanged = cbk;
          }
        };
      },
      AdvancedMarkerElement: function (options?: Record<string, unknown>) {
        markerValues.options = options;
        this.position = options?.position ?? null;
        markerValues.markerInstance = this;
        this.addListener = (name: string, cbk: () => void) => {
          if (name === 'dragend') {
            markerValues.updatePosition = cbk;
          }
        };
      },
      Circle: function (options?: Record<string, unknown>) {
        circleValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      DrawingManager: function (options?: Record<string, unknown>) {
        drawingValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      HeatmapLayer: function (options?: Record<string, unknown>) {
        heatmapValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      InfoWindow: function (options?: Record<string, unknown>) {
        infoWindowValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
        this.close = vi.fn();
      },
      KmlLayer: function (options?: Record<string, unknown>) {
        kmlLayerValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      Polygon: function (options?: Record<string, unknown>) {
        polygonValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      Polyline: function (options?: Record<string, unknown>) {
        polylineValues.options = options;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
      StreetViewPanorama: function (
        html?: HTMLElement,
        options?: Record<string, unknown>,
      ) {
        streetViewValues.html = html;
        streetViewValues.options = options;
        streetViewValues.setPosition = vi.fn();
        this.setPosition = streetViewValues.setPosition;
        this.addListener = () => {
          return undefined;
        };
        this.setMap = vi.fn();
      },
    }),
    drawing: {
      OverlayType: {
        MARKER: 'MARKER',
        CIRCLE: 'CIRCLE',
        POLYGON: 'POLYGON',
      },
    },
    ControlPosition: { TOP_CENTER: 'TOP_CENTER' },
  },
};
