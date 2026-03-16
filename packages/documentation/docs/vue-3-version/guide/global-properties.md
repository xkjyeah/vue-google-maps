---
id: global-properties
sidebar_position: 3
sidebar_label: Global properties
---
# Global Properties

We have two main global properties

1. `$gmapApiPromiseLazy`
2. `$gmapOptions`.

You can access these properties as follows

## Options API

```ts title="[your-component].vue" showLineNumbers {3,4}
export default {
  mounted() {
    this.$gmapApiPromiseLazy().then(...).catch(...);
    this.$gmapOptions;
  }
}
```

## Composition API

You can use the following composables

```ts title="[your-component].vue" showLineNumbers {3,4}
import { usePluginOptions, useGoogleMapsApiPromiseLazy } from '@gmap-vue/v3/composables';

const options = usePluginOptions();
const googleMapsApiPromiseLazy = useGoogleMapsApiPromiseLazy();
```

## Getting the plugin options with `inject`

```ts title="[your-component].vue" showLineNumbers {4}
import { $gmapOptions } from '@gmap-vue/v3/keys';
import { inject } from 'vue';

const options = inject($gmapOptions);
```

:::info

- Check the `useGoogleMapsApiPromiseLazy` object [here](/docs/vue-3-version/api/composables#usegooglemapsapipromiselazy)
- Check the `usePluginOptions` object [here](/docs/vue-3-version/api/composables#usePluginOptions)

:::
