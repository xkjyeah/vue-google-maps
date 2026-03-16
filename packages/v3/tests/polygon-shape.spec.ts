import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInstance } from 'vue';
import { Polygon } from '../src/components';
import * as composables from '../src/composables';
import { useDestroyPromisesOnUnmounted } from '../src/composables';
import { $polygonShapePromise } from '../src/keys';
import {
  googleMock,
  type MockComponentConstructorWithHTML,
  polygonValues,
} from './mocks/global.mock';

describe('PolygonShape component', () => {
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
    const wrapper = mount({ ...Polygon, template });

    // when
    await flushPromises();

    // then
    expect(wrapper).toBeDefined();
  });

  it('should render the correct DOM and return a polygonShapePromise', async () => {
    // given
    const props = { polygonKey: 'myPolygonKey', clickable: false };
    const wrapper = mount({ ...Polygon, template }, { props });
    const { polygonKey, ...propsInOptions } = props;

    // when
    await flushPromises();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.html()).toBe(template);
    expect(JSON.stringify(polygonValues.options)).toEqual(
      JSON.stringify({
        map: new Map() as MockComponentConstructorWithHTML,
        ...propsInOptions,
        draggable: false,
        editable: false,
        geodesic: false,
        strokePosition: 0,
        visible: true,
        deepWatch: false,
      }),
    );
    expect(
      wrapper.getCurrentComponent().exposed.polygonShapePromise,
    ).toBeInstanceOf(Promise);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // given
    const wrapper = mount({ ...Polygon, template });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      $polygonShapePromise,
    );
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // given
    const props = { polygonKey: 'myPolygonKey' };
    const wrapper = mount({ ...Polygon, template }, { props });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      props.polygonKey,
    );
  });
});
