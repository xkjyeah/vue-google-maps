import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { IGmapVuePluginOptions } from '../src/interfaces';
import type { TGlobalGoogleObject } from '../src/types/gmap-vue.type';

describe('promise-lazy-builder', () => {
  let promiseLazyBuilder: {
    usePluginOptions: () => IGmapVuePluginOptions;
    saveLazyPromiseAndFinalOptions: (
      o: Record<string, unknown>,
      f: () => void,
    ) => void;
    useGoogleMapsApiPromiseLazy: () => Promise<TGlobalGoogleObject | undefined>;
  };

  beforeEach(async () => {
    promiseLazyBuilder = await import(
      '../src/composables/promise-lazy-builder'
    );
    vi.clearAllMocks();
    vi.resetModules();
  });

  test('should print a message when plugins options are not define', () => {
    // Arrange
    const message = '$finalOptions was not defined yet...';
    vi.spyOn(console, 'warn');

    // Act
    promiseLazyBuilder.usePluginOptions();

    // Assert
    expect(console.warn).toBeCalledTimes(1);
    expect(console.warn).toBeCalledWith(message);
  });

  test('should return the options passed to the plugin when it is initialized', () => {
    // Arrange
    const optionsMock = { load: { key: 'abc' } };
    promiseLazyBuilder.saveLazyPromiseAndFinalOptions(
      optionsMock,
      () => undefined,
    );

    // Act
    const result = promiseLazyBuilder.usePluginOptions();

    // Assert
    expect(result).toEqual(optionsMock);
  });

  test('should save the options and the API promise lazy when its called', () => {
    // Arrange
    const optionsMock = { load: { key: 'abc' } };
    const fnMock = () => 'this is a test';

    // Act
    promiseLazyBuilder.saveLazyPromiseAndFinalOptions(optionsMock, fnMock);

    expect(promiseLazyBuilder.usePluginOptions()).toEqual(optionsMock);
    expect(promiseLazyBuilder.useGoogleMapsApiPromiseLazy()).toEqual(fnMock());
  });

  test('should only save once the options and the API promise lazy when its called', () => {
    // Arrange
    const optionsMock = { load: { key: 'abc' } };
    const fnMock = () => 'this is a test';
    const optionsMock2 = { load: { key: 'def' } };
    const fnMock2 = () => 'this is a test 2';

    // Act
    promiseLazyBuilder.saveLazyPromiseAndFinalOptions(optionsMock2, fnMock2);
    promiseLazyBuilder.saveLazyPromiseAndFinalOptions(optionsMock, fnMock);

    expect(promiseLazyBuilder.usePluginOptions()).toEqual(optionsMock2);
    expect(promiseLazyBuilder.useGoogleMapsApiPromiseLazy()).toEqual(fnMock2());
  });

  test('should print a message when gmapApiPromiseLazy is not define', async () => {
    // Arrange
    vi.spyOn(console, 'warn');
    const message = '$googleMapsApiPromiseLazy was not created yet...';

    // Act
    await promiseLazyBuilder.useGoogleMapsApiPromiseLazy();

    // Assert
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(message);
  });
});
