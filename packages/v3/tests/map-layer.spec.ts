import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import { MapLayer } from '../src/components';
import * as composables from '../src/composables';
import { useDestroyPromisesOnUnmounted } from '../src/composables';
import { $mapPromise } from '../src/keys';
import { googleMock, mapValues, valueMocks } from './mocks/global.mock';

describe('MapLayer component', () => {
  beforeAll(() => {
    vi.stubGlobal('google', googleMock);
    vi.spyOn(composables, 'useGoogleMapsApiPromiseLazy').mockResolvedValue({});
    vi.spyOn(composables, 'usePluginOptions').mockReturnValue({
      load: { key: 'abc', mapId: 'test' },
    });
    vi.spyOn(composables, 'useDestroyPromisesOnUnmounted');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be mounted successfully', async () => {
    // given
    const wrapper = mount(MapLayer, { props: { center: { lat: 1, lng: 1 } } });

    // when
    await flushPromises();

    // then
    expect(wrapper).not.toBeNull();
  });

  it('should render a correct DOM and export a mapPromise', async () => {
    // given
    const props = { center: { lat: 1, lng: 1 }, mapKey: 'myMap' };
    vi.stubGlobal('window', { __gmc__: undefined });
    const wrapper = mount(MapLayer, {
      props,
      slots: { visible: h('div') },
    });
    const { mapKey, ...propsInOptions } = props;

    // when
    await flushPromises();
    const component = wrapper.getCurrentComponent();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find('gmv-map-container')).toBeDefined();
    expect(wrapper.find('gmv-map')).toBeDefined();
    expect(wrapper.find('gmv-map-hidden')).toBeDefined();
    expect(Object.keys(component.slots).length).toEqual(1);
    expect(mapValues.options).toEqual({
      ...propsInOptions,
      clickableIcons: true,
      disableDefaultUI: false,
      fullscreenControl: true,
      gestureHandling: 'auto',
      keyboardShortcuts: true,
      mapTypeControl: true,
      mapTypeId: 'roadmap',
      rotateControl: true,
      scaleControl: true,
      streetViewControl: true,
      zoomControl: true,
    });
    expect(component.exposed?.mapPromise).instanceOf(Promise);
  });

  it('should emit the correct events', async () => {
    // given
    vi.stubGlobal('window', { __gmc__: undefined });
    const wrapper = mount(MapLayer, {
      props: { center: { lat: 1, lng: 1 } },
      slots: { visible: h('div') },
    });

    // when
    await flushPromises();
    mapValues.centerChanged?.();
    mapValues.centerChanged?.();
    mapValues.zoomChanged?.();
    mapValues.boundsChanged?.();
    const centerChangedEmitted = wrapper.emitted('center_changed');
    const zoomChangedEmitted = wrapper.emitted('zoom_changed');
    const boundsChangedEmitted = wrapper.emitted('bounds_changed');

    // then
    expect(centerChangedEmitted).toHaveLength(2);
    expect(centerChangedEmitted?.[0]).toEqual([valueMocks.center]);
    expect(centerChangedEmitted?.[1]).toEqual([valueMocks.center]);
    expect(zoomChangedEmitted).toHaveLength(1);
    expect(zoomChangedEmitted?.[0]).toEqual([valueMocks.zoom]);
    expect(boundsChangedEmitted).toHaveLength(1);
    expect(boundsChangedEmitted?.[0]).toEqual([valueMocks.bounds]);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // given
    const props = { center: { lat: 1, lng: 1 } };
    vi.stubGlobal('window', { __gmc__: undefined });
    const wrapper = mount(MapLayer, {
      props,
      slots: { visible: h('div') },
    });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith($mapPromise);
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // given
    const props = { center: { lat: 1, lng: 1 }, mapKey: 'myMap' };
    vi.stubGlobal('window', { __gmc__: undefined });
    const wrapper = mount(MapLayer, {
      props,
      slots: { visible: h('div') },
    });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(props.mapKey);
  });

  it('should call setCenter on the map instance when the center prop changes', async () => {
    // given
    vi.stubGlobal('window', { __gmc__: undefined });
    const wrapper = mount(MapLayer, {
      props: { center: { lat: 1, lng: 1 } },
    });
    await flushPromises();

    // when
    await wrapper.setProps({ center: { lat: 5, lng: 10 } });
    await flushPromises();

    // then
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(mapValues.mapInstance?.setCenter).toHaveBeenCalledWith({
      lat: 5,
      lng: 10,
    });
  });
});
