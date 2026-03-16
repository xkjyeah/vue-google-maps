import { describe, expect, it } from 'vitest';
import type { IGmapVuePluginOptions } from '../src/interfaces';
import * as main from '../src/main';

describe('main.ts module', () => {
  it('should export one function and one object with three functions', () => {
    // arrange
    const options: IGmapVuePluginOptions = {
      load: { key: 'abc', mapIds: ['test'] },
    };

    // act
    const installFn = main.createGmapVuePlugin(options);

    // assert
    expect(main.createGmapVuePlugin).toBeTypeOf('function');
    expect(main.utilities).toBeTypeOf('object');
    expect(Object.keys(main.utilities)).toHaveLength(3);
    expect(Object.keys(main.utilities)).toEqual([
      'googleMapsApiInitializer',
      'pluginComponentBuilder',
      'getGoogleMapsAPI',
    ]);
    expect(main.utilities.googleMapsApiInitializer).toBeTypeOf('function');
    expect(main.utilities.pluginComponentBuilder).toBeTypeOf('function');
    expect(main.utilities.getGoogleMapsAPI).toBeTypeOf('function');
    expect(installFn).toBeTypeOf('function');
    expect(globalThis.GoogleMapsApi).toBeDefined();
    expect(globalThis.GoogleMapsApi).toBeTypeOf('object');
    expect(Object.keys(globalThis.GoogleMapsApi)).toHaveLength(1);
    expect(Object.keys(globalThis.GoogleMapsApi)).toEqual(['isReady']);
    expect(globalThis.GoogleMapsApi.isReady).toBeFalsy();
  });
});
