---
id: nuxt
sidebar_position: 7
sidebar_label: Nuxt
---
# Nuxt

:::warning
This was taken from the documentation about the version form Vue 2. This **should be checked and confirmed**.
:::

For Nuxt projects, please import `GmapVuePlugin` in the following way:

```js
import { GmapVuePlugin } from '~/node_modules/@gmap-vue/v3'
```

Add the following to your `nuxt.config.js`'s `build.extend()`:

```js
transpile: [/^@gmap-vue\/v3($|\/)/]
```

:::note

Please take a look at this [example on stackblitz](/wip)

:::
