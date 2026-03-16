import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInstance } from 'vue';
import { KmlLayer } from '../src/components';
import * as composables from '../src/composables';
import { useDestroyPromisesOnUnmounted } from '../src/composables';
import { $kmlLayerPromise } from '../src/keys';
import {
  googleMock,
  kmlLayerValues,
  type MockComponentConstructorWithHTML,
} from './mocks/global.mock';

describe('KmlLayer component', () => {
  let Map: MockComponentConstructorWithHTML;
  let template: string;

  beforeEach(() => {
    template = '<div class="myKmlLayer"></div>';
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
    // given
    const wrapper = mount({ ...KmlLayer, template });

    // when
    await flushPromises();

    // then
    expect(wrapper).toBeDefined();
  });

  it('should render the correct DOM and return a kmlLayerPromise', async () => {
    // given
    const props = { kmlKey: 'myKmlKey', clickable: false };
    const wrapper = mount({ ...KmlLayer, template }, { props });
    const { kmlKey, ...propsInOptions } = props;

    // when
    await flushPromises();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.html()).toBe(template);
    expect(JSON.stringify(kmlLayerValues.options)).toEqual(
      JSON.stringify({
        map: new Map() as MockComponentConstructorWithHTML,
        ...propsInOptions,
        preserveViewport: false,
        screenOverlays: true,
        suppressInfoWindows: false,
      }),
    );
    expect(
      wrapper.getCurrentComponent().exposed.kmlLayerPromise,
    ).toBeInstanceOf(Promise);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // given
    const wrapper = mount({ ...KmlLayer, template });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      $kmlLayerPromise,
    );
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // given
    const props = { kmlKey: 'myKmlKey' };
    const wrapper = mount({ ...KmlLayer, template }, { props });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(props.kmlKey);
  });
});
