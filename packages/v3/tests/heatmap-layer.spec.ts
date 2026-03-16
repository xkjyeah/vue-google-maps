import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInstance } from 'vue';
import { HeatmapLayer } from '../src/components';
import * as composables from '../src/composables';
import { useDestroyPromisesOnUnmounted } from '../src/composables';
import { $heatmapLayerPromise } from '../src/keys';
import {
  googleMock,
  heatmapValues,
  type MockComponentConstructorWithHTML,
} from './mocks/global.mock';

describe('HeatmapLayer component', () => {
  let Map: MockComponentConstructorWithHTML;
  let template: string;

  beforeEach(() => {
    template = '<div class="myHeatmap"></div>';
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
    const wrapper = mount({ ...HeatmapLayer, template });

    // when
    await flushPromises();

    // then
    expect(wrapper).toBeDefined();
  });

  it('should render the correct DOM and return a heatmapLayerPromise', async () => {
    // given
    const props = { heatmapKey: 'myHeatmapKey', dissipating: true };
    const wrapper = mount({ ...HeatmapLayer, template }, { props });
    const { heatmapKey, ...propsInOptions } = props;

    // when
    await flushPromises();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.html()).toEqual(template);
    expect(JSON.stringify(heatmapValues.options)).toEqual(
      JSON.stringify({
        map: new Map() as MockComponentConstructorWithHTML,
        ...propsInOptions,
        opacity: 0.6,
      }),
    );
    expect(
      wrapper.getCurrentComponent().exposed.heatmapLayerPromise,
    ).toBeInstanceOf(Promise);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // given
    const wrapper = mount({ ...HeatmapLayer, template });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      $heatmapLayerPromise,
    );
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // given
    const props = { heatmapKey: 'myHeatmapKey' };
    const wrapper = mount({ ...HeatmapLayer, template }, { props });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      props.heatmapKey,
    );
  });
});
