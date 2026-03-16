import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { IGmapVuePluginOptions } from '../src/interfaces/gmap-vue.interface';
import type { TGoogleMapsAPIInitializerFn } from '../src/types/gmap-vue.type';

describe('google-maps-api-initializer.ts', () => {
  let initializer: { googleMapsApiInitializer: TGoogleMapsAPIInitializerFn };
  let spy: MockInstance;
  let options: Partial<IGmapVuePluginOptions>;
  let googleMapScript: HTMLElement;

  beforeEach(async () => {
    vi.mock('../src/composables', async (originalImport) => {
      const original: Record<string, unknown> = await originalImport();

      return {
        ...original,
        usePluginOptions: vi
          .fn()
          .mockReturnValue({ load: { key: 'abc', mapId: 'test' } }),
      };
    });
    initializer = await import(
      '../src/composables/google-maps-api-initializer'
    );
    vi.resetModules();

    spy = vi.spyOn(globalThis.document.head, 'appendChild');
    options = {
      load: {
        key: 'test-key',
        libraries: 'roadmap',
        callback: 'GoogleMapsCallback',
      },
    };
    googleMapScript = document.createElement('SCRIPT');
    googleMapScript.setAttribute('async', '');
    googleMapScript.setAttribute('defer', '');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should export a single function when is imported', () => {
    // Act
    const keys = Object.keys(initializer);

    // Assert
    expect(keys.length).toBe(1);
  });

  test('should throw an error when the initializer is called without options', () => {
    // Arrange
    let error;

    // Act
    try {
      initializer.googleMapsApiInitializer(undefined);
    } catch (e) {
      error = e;
    }

    // Assert
    expect(error.message).toBe('options should  be an object');
  });

  test('should throw an error when the initializer is called without an options object', () => {
    // Arrange
    let error;

    // Act
    try {
      initializer.googleMapsApiInitializer(['test']);
    } catch (e) {
      error = e;
    }

    // Assert
    expect(error.message).toBe('options should  be an object');
  });

  test('should initialize the google maps api when is called with load options', () => {
    // Arrange
    googleMapScript.innerHTML = `
      ((g) => {
        var h,
          a,
          k,
          p = 'The Google Maps JavaScript API',
          c = 'google',
          l = 'importLibrary',
          q = '__ib__',
          m = document,
          b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            h ||
            (h = new Promise(async (f, n) => {
              await (a = m.createElement('script'));
              e.set('libraries', [...r] + '');
              for (k in g)
                e.set(
                  k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                  g[k]
                );
              e.set('callback', c + '.maps.' + q);
              a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
              d[q] = f;
              a.onerror = () => (h = n(Error(p + ' could not load.')));
              a.nonce = m.querySelector('script[nonce]')?.nonce || '';
              m.head.append(a);
            }));
        d[l]
          ? console.warn(p + ' only loads once. Ignoring:', g)
          : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
      })(${JSON.stringify(options.load)});`;

    // Act
    initializer.googleMapsApiInitializer(options.load);

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as HTMLElement).innerHTML).toBe(
      googleMapScript.innerHTML,
    );
  });

  test('should initialize once the google api when is called', () => {
    // Arrange
    googleMapScript.innerHTML = `
      ((g) => {
        var h,
          a,
          k,
          p = 'The Google Maps JavaScript API',
          c = 'google',
          l = 'importLibrary',
          q = '__ib__',
          m = document,
          b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            h ||
            (h = new Promise(async (f, n) => {
              await (a = m.createElement('script'));
              e.set('libraries', [...r] + '');
              for (k in g)
                e.set(
                  k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
                  g[k]
                );
              e.set('callback', c + '.maps.' + q);
              a.src = \`https://maps.\${c}apis.com/maps/api/js?\` + e;
              d[q] = f;
              a.onerror = () => (h = n(Error(p + ' could not load.')));
              a.nonce = m.querySelector('script[nonce]')?.nonce || '';
              m.head.append(a);
            }));
        d[l]
          ? console.warn(p + ' only loads once. Ignoring:', g)
          : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
      })(${JSON.stringify(options.load)});`;

    // Act
    initializer.googleMapsApiInitializer(options.load);
    initializer.googleMapsApiInitializer(options.load);

    // Assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect((spy.mock.calls[0][0] as HTMLElement).innerHTML).toBe(
      googleMapScript.innerHTML,
    );
  });
});
