import {
  useCirclePromise,
  useClusterPromise,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useDrawingPromise,
  useHeatmapLayerPromise,
  useInfoWindowPromise,
  useKmlPromise,
  useMapPromise,
  useMarkerPromise,
  usePolygonPromise,
  usePolylinePromise,
  useRectanglePromise,
  useStreetViewPanoramaPromise,
} from '../src/composables/component-promise-factory';

import { describe, expect, it } from 'vitest';
import {
  $circleShapePromise,
  $clusterPromise,
  $drawingManagerPromise,
  $heatmapLayerPromise,
  $infoWindowPromise,
  $kmlLayerPromise,
  $mapPromise,
  $markerPromise,
  $polygonShapePromise,
  $polylineShapePromise,
  $rectangleShapePromise,
  $streetViewPanoramaPromise,
} from '../src/keys/index';

describe('component-promise-factory.ts', () => {
  it('should create and return a map promise with the default key', () => {
    // act
    const promise = useMapPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($mapPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a street view promise with the default key', () => {
    // act
    const promise = useStreetViewPanoramaPromise();
    const { promise: promise2 } = useComponentPromiseFactory<string>(
      $streetViewPanoramaPromise,
    );

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a circle promise with the default key', () => {
    // act
    const promise = useCirclePromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($circleShapePromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a cluster promise with the default key', () => {
    // act
    const promise = useClusterPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($clusterPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a drawing promise with the default key', () => {
    // act
    const promise = useDrawingPromise();
    const { promise: promise2 } = useComponentPromiseFactory<string>(
      $drawingManagerPromise,
    );

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a heatmap promise with the default key', () => {
    // act
    const promise = useHeatmapLayerPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($heatmapLayerPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a info window promise with the default key', () => {
    // act
    const promise = useInfoWindowPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($infoWindowPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a kml promise with the default key', () => {
    // act
    const promise = useKmlPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($kmlLayerPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a marker promise with the default key', () => {
    // act
    const promise = useMarkerPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($markerPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a polygon promise with the default key', () => {
    // act
    const promise = usePolygonPromise();
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($polygonShapePromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a polyline promise with the default key', () => {
    // act
    const promise = usePolylinePromise();
    const { promise: promise2 } = useComponentPromiseFactory<string>(
      $polylineShapePromise,
    );

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a rectangle promise with the default key', () => {
    // act
    const promise = useRectanglePromise();
    const { promise: promise2 } = useComponentPromiseFactory<string>(
      $rectangleShapePromise,
    );

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a promise with a custom key', () => {
    // act
    const promise = useMapPromise('customKey');
    const { promise: promise2 } =
      useComponentPromiseFactory<string>($mapPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);
  });

  it('should create and return a map promise and resolve it', async () => {
    // arrange
    const value = 'resolved';

    // act
    const promise = useMapPromise();
    const { promiseDeferred, promise: promise2 } =
      useComponentPromiseFactory<string>($mapPromise);
    useDestroyPromisesOnUnmounted($mapPromise);

    // assert
    expect(promise).instanceOf(Promise);
    expect(promise).toEqual(promise2);

    // act
    promiseDeferred.resolve(value);
    const r = await promise;
    const r2 = await promise2;

    // assert
    expect(r).toBe(value);
    expect(r2).toBe(value);
  });

  it('should create and return a map promise and reject it', async () => {
    // arrange
    const reason = 'rejected';

    // act
    const promise = useMapPromise('test2');
    const { promiseDeferred, promise: promise2 } =
      useComponentPromiseFactory<string>('test2');
    useDestroyPromisesOnUnmounted('test2');

    // act
    promiseDeferred.reject(reason);

    // assert
    try {
      await promise;
    } catch (e) {
      expect(e).toBe(reason);
    }
    try {
      await promise2;
    } catch (e) {
      expect(e).toBe(reason);
    }
  });

  it('should create and return a promise with a custom key', async () => {
    // arrange
    const result = 'the result';

    // act
    const { promiseDeferred, promise } =
      useComponentPromiseFactory<string>('deferredKey');
    promiseDeferred.resolve(result);
    const value = await promise;

    // assert
    expect(value).toBe(result);
  });
});
