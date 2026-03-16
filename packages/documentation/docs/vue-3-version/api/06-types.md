---
id: types
sidebar_position: 6
sidebar_label: Types definitions
---
# Types definitions

## `GlobalGoogleObject`

```ts showLineNumbers
export type GlobalGoogleObject = typeof google;
```

## `LazyValueGetterFn`

```ts showLineNumbers
export type LazyValueGetterFn<T> = () => Promise<T>;
```

## `SinglePluginComponentConfig`

```ts showLineNumbers
/**
 * @typedef {Object} SinglePluginComponentConfigWithoutEvents
 * @property {string[]} noBind - Props with should not be bind to Google Maps. Has precedence over twoWay
 * @property {string[]} twoWay - Props that should be bind in two-way data binding
 * @property {Object} trackProperties - Object with nested properties of a prop that should be watched
 * @property {string} trackProperties.key - Should be a string
 * @property {string[]} trackProperties.value - Should be an array of nested properties of the prop that should be watched
 */
/**
 * @typedef {Object} SinglePluginComponentConfig
 * @property {string[]} noBind - Props with should not be bind to Google Maps. Has precedence over twoWay
 * @property {string[]} twoWay - Props that should be bind in two-way data binding
 * @property {Object} trackProperties - Object with nested properties of a prop that should be watched
 * @property {string} trackProperties.key - Should be a string
 * @property {string[]} trackProperties.value - Should be an array of nested properties of the prop that should be watched
 * @property {Object} events - Events should be bind on the component
 * @property {string[]} events.auto - Events of the Google Maps component instance that should be bind
 * @property {string[]} events.manual - Manual events that should emit or bind
 */
/** @internal */
export type SinglePluginComponentConfig = {
  noBind: string[];
  twoWay: string[];
  trackProperties: { [key: string]: string[] };
  events: {
    auto: string[];
    manual: string[]; // TODO: try to improve this to be an object with specific keys that can be used in the code
  };
};
```
