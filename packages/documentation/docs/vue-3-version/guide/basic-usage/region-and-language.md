---
id: region-and-language
sidebar_position: 4
sidebar_label: Region and Language
---

# Region and Language

Use the region and language options to localize your map.

:::info For more information

- Go to the [language tutorial](https://developers.google.com/maps/documentation/javascript/localization).
- Check the [supported languages](https://developers.google.com/maps/faq#languagesupport).
- Visit the [region localization](https://developers.google.com/maps/documentation/javascript/localization#Region).

:::

```ts title="main.ts" showLineNumbers {12,13}
import { createGmapVuePlugin } from '@gmap-vue/v3';
import '@gmap-vue/v3/dist/style.css';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App)
  .use(
    createGmapVuePlugin({
      load: {
        key: '...',
        region: 'VI',
        language: 'vi',
      },
    })
  )
  .mount('#app');
```
