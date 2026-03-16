---
id: dynamic-load
sidebar_position: 1
sidebar_label: Dynamic load
---

# Dynamic load

If you need to initialize the Google Maps API in a dynamic way you can use the `dynamicLoad` option of the plugin
configuration, this option start the plugin but **it doesn't load the Google Maps API**, **you need to load it manually** using
the `googleMapsApiInitializer` function from the `utilities` object exposed by the plugin as we show below

```ts title="main.ts" showLineNumbers
//...

createApp(App)
  .use(router)
  .use(createGmapVuePlugin({ dynamicLoad: true }))
  .mount("#app");

//...
```

In setup script

```ts title="[your-component].vue - Composition API" showLineNumbers {5,6,9}
import { onMounted } from "vue";
import { utilities } from "@gmap-vue/v3";
import { usePluginOptions } from "@gmap-vue/v3/composables";

const { googleMapsApiInitializer } = utilities;
const options = usePluginOptions();

onMounted(() => {
  googleMapsApiInitializer(options);
});
```

or in options API

```ts title="[your-component].vue - Options API" showLineNumbers {4,8}
import { onMounted } from "vue";
import { utilities } from "@gmap-vue/v3";

const { googleMapsApiInitializer } = utilities;

export default {
  mounted() {
    googleMapsApiInitializer(this.$gmapOptions);
  },
};
```

:::info

- If you want to know the **`googleMapsApiInitializer` API** please check it [here](/wip).
- Check the plugin **options** interface [here](/docs/vue-3-version/api/gmap-vue-plugin#plugin-options)

:::
