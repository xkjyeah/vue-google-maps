# GmapVue

[![Publish](https://github.com/diegoazh/gmap-vue/workflows/publish/badge.svg)](https://github.com/diegoazh/gmap-vue/actions?query=workflow%3Apublish)
[![Documentation](https://github.com/diegoazh/gmap-vue/workflows/documentation/badge.svg)](https://github.com/diegoazh/gmap-vue/actions?query=workflow%3Adocumentation)

A Vue plugin that wraps the Google Map API into different Vue components.

## [Documentation](https://diegoazh.github.io/gmap-vue/)

You can find the documentation following the [link](https://diegoazh.github.io/gmap-vue/).

## Plugin dependencies

|Name|Version|
|----|-------|
|*vue*|[![npm version](https://badge.fury.io/js/vue.svg)](https://www.npmjs.com/package/vue?activeTab=readme)|
|*@googlemaps/markerclusterer*|[![npm version](https://badge.fury.io/js/@googlemaps%2Fmarkerclusterer.svg)](https://badge.fury.io/js/@googlemaps%2Fmarkerclusterer)|
|*lodash.isEqual*|[![npm version](https://badge.fury.io/js/lodash.isequal.svg)](https://www.npmjs.com/package/lodash.isequal)|
|*mitt*|[![npm version](https://badge.fury.io/js/mitt.svg)](https://www.npmjs.com/package/mitt)|

## Fork of vue2-google-maps

This is a fork of the popular vue2-google-maps. As the author of the library no longer commits to maintain the project, we forked it to develop and maintain the project.

## Workspaces

This project uses [pnpm](https://pnpm.io/es/) workspaces to manage the plugin and documentation site. You will find the version of this plugin for Vue 2 on [`packages/v2`](https://github.com/diegoazh/gmap-vue/blob/master/packages/v2/README.md) folder, the version for Vue 3 on the [`packages/v3`](https://github.com/diegoazh/gmap-vue/blob/master/packages/v3/README.md) folder and the documentation on [`packages/documentation`](https://github.com/diegoazh/gmap-vue/blob/master/packages/documentation/README.md) folder.

- Clone the repository and run

  - `pnpm`

    ```sh
    pnpm install
    ```

- To start the documentation site locally you can run the below command, it starts the documentation page on [http://localhost:8080/](http://localhost:8080/)

  ```sh
  pnpm run serve:docs
  ```

## CONTRIBUTORS ARE WELCOME

If you have time to contribute to a rather frequently used library, feel free to make a PR!, but first please read our [contributing guide](https://github.com/diegoazh/gmap-vue/blob/master/CONTRIBUTING.md).

What's urgently needed are:

1. Better unit tests (we use Vitest).
2. Better integration tests (we use Cypress)
