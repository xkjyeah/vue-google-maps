---
id: autocomplete
sidebar_position: 2
sidebar_label: Autocomplete
---

# Autocomplete

:::info Official sources

- [Reference](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete)
- [Guide](https://developers.google.com/maps/documentation/javascript/place-autocomplete)

:::

This component is a wrapper of the Google Autocomplete class.

:::note From the authors
> Autocomplete is a feature of the Places library in the Maps JavaScript API. You can use autocomplete to give your applications the type-ahead-search behavior of the Google Maps search field. The autocomplete service can match on full words and substrings, resolving place names, addresses, and plus codes. Applications can therefore send queries as the user types, to provide on-the-fly place predictions. [reference](https://developers.google.com/maps/documentation/javascript/place-autocomplete#introduction)
:::

## Props

:::info
The _highlighted_ lines are the official props, we strongly recommend to read the [**official documentation**](https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions).

**Here we only describe the custom props added by this plugin**
:::

```ts title="Autocomplete props interface" showLineNumbers {11-15}
/**
 * Autocomplete input Google Maps properties documentation
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.bounds
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.componentRestrictions
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.fields
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.strictBounds
 * @see https://developers.google.com/maps/documentation/javascript/reference/places-widget#AutocompleteOptions.types
 */
export interface IAutoCompleteInputVueComponentProps {
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
}
```

- **selectFirstOnEnter**:
  - _type_: `boolean`
  - _description_: Select the first result in the list when press enter keyboard
- **slotRef**:
  - _type_: `HTMLInputElement`
  - _description_: the unique ref set to the component passed in the slot input
- **setFieldsTo**: To avoid paying for data that you don't need, be sure to use Autocomplete.setFields() to specify only the place data that you will use.
- **autocompleteKey**: This is used to identify every instance of the Google Maps Autocomplete class. If it's not provided it always use the `$autocompletePromise` key as its default value, but take care about it because if you use it in many places you will use always the same instance.
- **options**:
  - _type_: `Record<string, unknown>`
  - _description_: We use this prop as a fallback option. If the official API changes and add new props to the class you can use the options prop to use and populate these new props until we update our API to use it explicitly.

## Exposed const

:::note
We only document the exposed methods of the component
:::

- **autoCompletePromise**:
  - _type_: [`Promise<InstanceType<google.maps.places.Autocomplete> | undefined>`](https://developers.google.com/maps/documentation/javascript/reference/places-widget#Autocomplete)
  - _description_: This is a promise that resolves the instance of the Google Maps Autocomplete class.

## Events

- **place_changed**:
  - _Event type_: [`google.maps.places.PlaceResult`](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)
  - _description_: This event is fired when a PlaceResult is made available for a Place the user has selected.
If the user enters the name of a Place that was not suggested by the control and presses the Enter key, or if a Place Details request fails, the PlaceResult contains the user input in the name property, with no other properties defined.

## Slots

- **default**: It provides a fallback content if you don't provide a slot content

```html showLineNumbers {3-5}
<template>
  <div>
    <slot :attrs="$attrs">
      <input ref="gmvAutoCompleteInput" v-bind="$attrs" />
    </slot>
  </div>
</template>
```

## Source code

<details>
  <summary>`autocomplete-input.vue` source code</summary>

```html showLineNumbers
<template>
  <div>
    <!--
				@slot Used to set your custom component for the input, eg: v-text-field.
        It has two binding properties:
        - `attrs`, it's type is `object`, it's all attributes passed to the component ([vm.$attrs](https://vuejs.org/v2/api/?#vm-attrs))<br>
			-->
    <slot :attrs="$attrs">
      <input ref="gmvAutoCompleteInput" v-bind="$attrs" />
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
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';

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
  },
);

/*******************************************************************************
 * TEMPLATE REF, ATTRIBUTES, EMITTERS AND SLOTS
 ******************************************************************************/
const gmvAutoCompleteInput = ref<HTMLInputElement | null>(null);
const emits = defineEmits<{
  place_changed: [value: google.maps.places.PlaceResult];
}>();

/*******************************************************************************
 * INJECT
 ******************************************************************************/

/*******************************************************************************
 * AUTOCOMPLETE
 ******************************************************************************/
defineOptions({ inheritAttrs: false, name: 'autocomplete-input' });
const excludedEvents = usePluginOptions()?.excludeEventsOnAllComponents?.();

/*******************************************************************************
 * PROVIDE
 ******************************************************************************/
const { promiseDeferred: autocompletePromiseDeferred, promise } =
  useComponentPromiseFactory(props.autocompleteKey || $autocompletePromise);
provide(props.autocompleteKey || $autocompletePromise, promise);

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
      return console.error('the autocomplete instance is not defined');
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
    .then(async () => {
      let scopedInput = props.slotRef
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

      const autocompleteOptions: IAutoCompleteInputVueComponentProps & {
        [key: string]: any;
      } = {
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
        emits as any,
        props,
      );

      bindGoogleMapsEventsToVueEventsOnSetup(
        autocompleteEventsConfig,
        autocomplete,
        emits as any,
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
        if (autocomplete) {
          /**
           * Place change event
           * @event place_changed
           * @property {object} place `this.$autocomplete.getPlace()`
           * @see [Get place information](https://developers.google.com/maps/documentation/javascript/places-autocomplete#get-place-information)
           */
          emits('place_changed', autocomplete.getPlace());
        }
      });

      if (!autocompletePromiseDeferred.resolve) {
        throw new Error('autocompletePromiseDeferred.resolve is undefined');
      }

      autocompletePromiseDeferred.resolve(autocomplete);
    })
    .catch((error) => {
      throw error;
    });
});

onUnmounted(() => {
  useDestroyPromisesOnUnmounted(props.autocompleteKey || $autocompletePromise);
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
```

</details>
