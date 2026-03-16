import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInstance } from 'vue';
import { InfoWindow } from '../src/components';
import * as composables from '../src/composables';
import { $infoWindowPromise } from '../src/keys';
import {
  googleMock,
  infoWindowValues,
  type MockComponentConstructorWithHTML,
} from './mocks/global.mock';

describe('InfoWindow component', () => {
  let Map: MockComponentConstructorWithHTML;

  beforeEach(() => {
    ({ Map } = googleMock.maps.importLibrary());
    vi.stubGlobal('google', googleMock);
    vi.spyOn(composables, 'usePluginOptions').mockReturnValue({
      load: { key: 'abc', mapId: 'test' },
    });
    vi.spyOn(composables, 'findParentInstanceByName').mockImplementation(
      () =>
        ({
          exposed: {
            mapPromise: Promise.resolve(new Map()),
          },
        }) as unknown as ComponentInstance<unknown>,
    );
    vi.spyOn(composables, 'useDestroyPromisesOnUnmounted');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be mounted successfully', async () => {
    // give
    const wrapper = mount(InfoWindow);

    // when
    await flushPromises();

    // then
    expect(wrapper).toBeDefined();
  });

  it('should render the correct DOM and return a infoWindowPromise', async () => {
    // give
    const props = { infoWindowKey: 'myInfoWindowKey', disableAutoPan: true };
    const wrapper = mount(InfoWindow, { props });
    const { infoWindowKey, ...propsInOptions } = props;

    // when
    await flushPromises();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.html()).toBe('<div class="info-window-container"></div>');
    expect(JSON.stringify(infoWindowValues.options)).toEqual(
      JSON.stringify({
        map: new Map() as MockComponentConstructorWithHTML,
        ...propsInOptions,
        disableAutoPan: true,
        content: {},
      }),
    );
    expect(
      wrapper.getCurrentComponent().exposed?.infoWindowPromise,
    ).toBeInstanceOf(Promise);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // give
    const wrapper = mount(InfoWindow);

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(composables.useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(composables.useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      $infoWindowPromise,
    );
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // give
    const props = { infoWindowKey: 'myInfoWindowKey' };
    const wrapper = mount(InfoWindow, { props });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(composables.useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(composables.useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      props.infoWindowKey,
    );
  });
});
