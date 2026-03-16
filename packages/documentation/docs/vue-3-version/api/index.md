---
id: main.ts
sidebar_position: 1
sidebar_label: main.ts
---
# `main.ts`

The `main.ts` file expose four objects.

- `createGmapVuePlugin`: The main factory function, used to install the plugin. It returns the install function required by Vue.
- `utilities`: An object with util functions.

```ts
export { createGmapVuePlugin, utilities };
```

## Other exposed APIs

This plugin also exports:

- `keys`: keys to use with the Vue `inject` function
  - path: `@gmap-vue/v3/keys`
- `types`: types possible needed to type things when using TypeScript
  - path: `@gmap-vue/v3/types`
- `interfaces`: interfaces possible needed to type things when using TypeScript
  - path: `@gmap-vue/v3/interfaces`
- `composables`: useful composables to access different things of the plugin
  - path: `@gmap-vue/v3/composables`
- `components`: components **types** of the plugin
  - path: `@gmap-vue/v3/components`
