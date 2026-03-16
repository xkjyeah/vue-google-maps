<template>
  <div>
    <!--
				@slot Used to set your custom component for the input, eg: v-text-field.
        It has two binding properties:
        - `attrs`, it's type is `object`, it's all attributes passed to the component ([vm.$attrs](https://vuejs.org/v2/api/?#vm-attrs))<br>
			-->
    <slot :attrs="$attrs">
      <input ref="gmvAutoCompleteInputRef" v-bind="$attrs" />
    </slot>
  </div>
</template>

<script lang="ts" setup>
import {
  bindGoogleMapsEventsToVueEventsOnSetup,
  bindPropsWithGoogleMapsSettersAndGettersOnSetup,
  downArrowSimulator,
  getComponentEventsConfig,
  getComponentPropsConfig,
  getPropsValuesWithoutOptionsProp,
  useComponentPromiseFactory,
  useDestroyPromisesOnUnmounted,
  useGoogleMapsApiPromiseLazy,
  usePluginOptions,
} from '@/composables';
import type { IAutoCompleteInputVueComponentProps } from '@/interfaces';
import { $autocompletePromise } from '@/keys';
import { onMounted, onUnmounted, provide, useTemplateRef, watch } from 'vue';

/**
 * Autocomplete component
 * @displayName GmvAutocomplete
 * @see [official guide](https://developers.google.com/maps/documentation/javascript/place-autocomplete)
 * @see [official reference](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete)
 * @see [source code](https://diegoazh.github.io/gmap-vue/docs/vue-3-version/api/components/autocomplete)
 */

/*******************************************************************************
 * DEFINE COMPONENT PROPS
 ******************************************************************************/
const props = withDefaults(
  defineProps<{
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    componentRestrictions?: google.maps.places.ComponentRestrictions;
    fields?: string[];
    strictBounds?: boolean;
    types?: string[];
    /**
     * Select the first result in the list when press enter keyboard
     * @values true, false
     */
    selectFirstOnEnter?: boolean;
    /**
     * the unique ref set to the component passed in the slot input
     */
    slotRef?: HTMLInputElement;
    /**
     * To avoid paying for data that you don't need,
     * be sure to use Autocomplete.setFields() to specify
     * only the place data that you will use.
     *
     * @see [Place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
     * @see [setFields](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete.setFields)
     * @see [PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)
     */
    setFieldsTo?: string[];
    autocompleteKey?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    selectFirstOnEnter: true,
    bounds: undefined,
    componentRestrictions: undefined,
    fields: undefined,
    strictBounds: undefined,
    types: undefined,
    slotRef: undefined,
    setFieldsTo: undefined,
    autocompleteKey: undefined,
    options: undefined,
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const gmvAutoCompleteInput = useTemplateRef<HTMLInputElement | null>(
  'gmvAutoCompleteInputRef',
);
const emits = defineEmits<{
  place_changed: [value: google.maps.places.PlaceResult];
}>();

/*******************************************************************************
 * INJECT
 ******************************************************************************/

/*******************************************************************************
 * AUTOCOMPLETE
 ******************************************************************************/
// eslint-disable-next-line vue/component-definition-name-casing
defineOptions({ inheritAttrs: false, name: 'autocomplete-input' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: autocompletePromiseDeferred, promise } =
  useComponentPromiseFactory(props.autocompleteKey ?? $autocompletePromise);
provide(props.autocompleteKey ?? $autocompletePromise, promise);

/*******************************************************************************
 * COMPUTED
 ******************************************************************************/

/*******************************************************************************
 * METHODS
 ******************************************************************************/

/*******************************************************************************
 * WATCHERS
 ******************************************************************************/
watch(
  () => props.componentRestrictions,
  async (newValue, oldValue) => {
    const autocomplete = await promise;

    if (!autocomplete) {
      console.error('the autocomplete instance is not defined');
      return;
    }

    if (newValue && newValue !== oldValue) {
      autocomplete.setComponentRestrictions(newValue);
    }
  },
);

/*******************************************************************************
 * HOOKS
 ******************************************************************************/
onMounted(() => {
  useGoogleMapsApiPromiseLazy()
    ?.then(async () => {
      const scopedInput = props.slotRef
        ? props.slotRef
        : gmvAutoCompleteInput.value;

      if (!scopedInput) {
        throw new Error(
          `we can find the template ref: 'gmvAutoCompleteInput' or we can't use the slotRef prop`,
        );
      }

      if (props.selectFirstOnEnter) {
        downArrowSimulator(scopedInput);
      }

      const autocompleteOptions: IAutoCompleteInputVueComponentProps &
        Record<string, unknown> = {
        ...getPropsValuesWithoutOptionsProp(props),
        ...props.options,
      };

      const { Autocomplete } = (await google.maps.importLibrary(
        'places',
      )) as google.maps.PlacesLibrary;

      if (typeof Autocomplete !== 'function') {
        throw new Error(
          "google.maps.places.Autocomplete is undefined. Did you add 'places' to libraries when loading Google Maps?",
        );
      }

      const autocomplete = new Autocomplete(scopedInput, autocompleteOptions);

      const autocompletePropsConfig =
        getComponentPropsConfig('GmvAutocomplete');
      const autocompleteEventsConfig = getComponentEventsConfig(
        'GmvAutocomplete',
        'auto',
      );

      bindPropsWithGoogleMapsSettersAndGettersOnSetup(
        autocompletePropsConfig,
        autocomplete,
        emits as (ev: string, value: unknown) => void,
        props,
      );

      bindGoogleMapsEventsToVueEventsOnSetup(
        autocompleteEventsConfig,
        autocomplete,
        emits as (ev: string, value: unknown) => void,
        excludedEvents,
      );

      if (props.setFieldsTo) {
        autocomplete.setFields(props.setFieldsTo);
      }

      /**
       * Not using `bindEvents` because we also want
       * to return the result of `getPlace()`
       */
      autocomplete.addListener('place_changed', () => {
        /**
         * Place change event
         * @event place_changed
         * @property {object} place `this.$autocomplete.getPlace()`
         * @see [Get place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
         */
        emits('place_changed', autocomplete.getPlace());
      });

      if (!autocompletePromiseDeferred.resolve) {
        throw new Error('autocompletePromiseDeferred.resolve is undefined');
      }

      autocompletePromiseDeferred.resolve(autocomplete);
    })
    .catch((error: unknown) => {
      throw error;
    });
});

onUnmounted(() => {
  useDestroyPromisesOnUnmounted(props.autocompleteKey ?? $autocompletePromise);
});

/*******************************************************************************
 * RENDERS
 ******************************************************************************/

/*******************************************************************************
 * EXPOSE
 ******************************************************************************/
defineExpose({
  autocompletePromise: promise,
});
</script>
