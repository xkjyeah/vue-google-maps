---
id: introduction
title: Introduction
sidebar_position: 1
sidebar_label: Introduction
---

This plugin is a Vue wrapper over the Google Maps API.

## TypeScript support

This plugin was re-built entirely to has a full TypeScript support. Many things on it changed from the plugin built to use with Vue 2.

## JSDoc comments

All files in the source code are entirely self documented with **jsdoc** comments. You can refer to this comments with confidence to learn how this new version of the plugin works.

## Get an API key from Google

[Generating an Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

## How to use it

The `GmapVuePlugin` exposed in the package is an object that contains the `install` function required for Vue to add plugins to your app.

```ts title="main.ts" showLineNumbers {1,3,8-12}
import { createGmapVuePlugin } from '@gmap-vue/v3';
import App from './App.vue';
import '@gmap-vue/v3/dist/style.css';

const app = createApp(App);

app.use(
  createGmapVuePlugin({
    load: {
      key: 'DlSzZaMeStOJndmvuPsSUcPBjxUNCpqd3BNYlZ1sWdMrOT5XrxrcvMNVllLH2nwINsFo8kyXVGStqKci',
    },
  })
);
app.mount('#app');
```

:::info
To know the available options of the plugin go to the [api documentation](/docs/vue-3-version/api/gmap-vue-plugin) to check it.
:::

:::info
To know more about the `components` object check the [api documentation](/docs/vue-3-version/api/components) to check it.
:::
