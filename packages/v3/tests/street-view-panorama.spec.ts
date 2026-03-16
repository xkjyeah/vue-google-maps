import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInstance } from 'vue';
import { nextTick } from 'vue';
import { StreetViewPanorama } from '../src/components';
import * as composables from '../src/composables';
import { useDestroyPromisesOnUnmounted } from '../src/composables';
import { $streetViewPanoramaPromise } from '../src/keys';
import {
  googleMock,
  type MockComponentConstructorWithHTML,
  streetViewValues,
} from './mocks/global.mock';

describe('StreetViewPanorama component', () => {
  let Map: MockComponentConstructorWithHTML;

  beforeEach(() => {
    ({ Map } = googleMock.maps.importLibrary());
    vi.stubGlobal('google', googleMock);
    vi.spyOn(composables, 'useGoogleMapsApiPromiseLazy').mockResolvedValue({});
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
    const wrapper = mount(StreetViewPanorama, {
      attachTo: document.body,
    });

    // when
    await flushPromises();

    // then
    expect(wrapper).toBeDefined();
  });

  it('should render the correct DOM and return a streetViewPanoramaPromise', async () => {
    // given
    const template = `<div class="gmv-street-view-panorama-container">\n  <div class="gmv-street-view-panorama"></div><!-- @slot A default slot to render the street view panorama -->\n</div>`;
    const props = { streetViewKey: 'myStreetViewKey', addressControl: false };
    const wrapper = mount(StreetViewPanorama, {
      props,
      attachTo: document.body,
    });

    // when
    await flushPromises();

    // then
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.html()).toBe(template);
    expect(JSON.stringify(streetViewValues.options)).toEqual(
      JSON.stringify({
        addressControl: false,
        clickToGo: true,
        disableDefaultUI: false,
        disableDoubleClickZoom: true,
        enableCloseButton: false,
        fullscreenControl: false,
        imageDateControl: false,
        linksControl: false,
        motionTracking: false,
        motionTrackingControl: false,
        panControl: false,
        scrollwheel: true,
        showRoadLabels: true,
        visible: true,
        zoomControl: false,
      }),
    );
    expect(
      wrapper.getCurrentComponent().exposed?.streetViewPanoramaPromise,
    ).toBeInstanceOf(Promise);
  });

  it('should call useDestroyPromisesOnUnmounted with the default key when the component is unmounted', async () => {
    // given
    const wrapper = mount(StreetViewPanorama, { attachTo: document.body });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      $streetViewPanoramaPromise,
    );
  });

  it('should call useDestroyPromisesOnUnmounted with the custom key when the component is unmounted', async () => {
    // given
    const props = { streetViewKey: 'myStreetViewKey' };
    const wrapper = mount(StreetViewPanorama, {
      props,
      attachTo: document.body,
    });

    // when
    await flushPromises();
    wrapper.unmount();
    await flushPromises();

    // then
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledOnce();
    expect(useDestroyPromisesOnUnmounted).toHaveBeenCalledWith(
      props.streetViewKey,
    );
  });

  it('should call setPosition on the panorama instance when the position prop changes', async () => {
    // given
    const wrapper = mount(StreetViewPanorama, {
      props: { position: { lat: 40, lng: -73 } },
      attachTo: document.body,
    });
    await flushPromises();

    // when
    await wrapper.setProps({ position: { lat: 41, lng: -74 } });
    await flushPromises();
    await nextTick();

    // then
    expect(streetViewValues.setPosition).toHaveBeenCalledWith({
      lat: 41,
      lng: -74,
    });
  });
});
