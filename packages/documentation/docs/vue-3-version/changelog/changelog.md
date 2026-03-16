---
id: changelog
title: Changelog
sidebar_position: 5
sidebar_label: Changelog
---
## [2.1.2](https://github.com/diegoazh/gmap-vue/compare/gmv3_v2.1.1...gmv3_v2.1.2) (2024-04-24)


### Bug Fixes

* **v3:** change inject for composable to get component promise  ([#324](https://github.com/diegoazh/gmap-vue/issues/324)) ([6613c59](https://github.com/diegoazh/gmap-vue/commit/6613c59a14887986412a73b3611829db299455e4)), closes [#323](https://github.com/diegoazh/gmap-vue/issues/323)

## [2.1.1](https://github.com/diegoazh/gmap-vue/compare/gmv3_v2.1.0...gmv3_v2.1.1) (2024-04-24)


### Bug Fixes

* **v3:** remove exposed instances because they are always undefined and cause errors with watchers and events ([bdc2f86](https://github.com/diegoazh/gmap-vue/commit/bdc2f8618c1b88c955ce116f5b25aabe5a70da44)), closes [#318](https://github.com/diegoazh/gmap-vue/issues/318) [#319](https://github.com/diegoazh/gmap-vue/issues/319) [#320](https://github.com/diegoazh/gmap-vue/issues/320)

# [2.1.0](https://github.com/diegoazh/gmap-vue/compare/gmv3_v2.0.1...gmv3_v2.1.0) (2024-04-11)


### Features

* **v3:** create independent instances of every component using a component key prop ([#315](https://github.com/diegoazh/gmap-vue/issues/315)) ([0c21c60](https://github.com/diegoazh/gmap-vue/commit/0c21c608125c37115a8625b1e1cdcf9e081ac6fd)), closes [#309](https://github.com/diegoazh/gmap-vue/issues/309) [#309](https://github.com/diegoazh/gmap-vue/issues/309) [#309](https://github.com/diegoazh/gmap-vue/issues/309)

## [2.0.1](https://github.com/diegoazh/gmap-vue/compare/gmv3_v2.0.0...gmv3_v2.0.1) (2024-04-05)


### Bug Fixes

* **v3:** update map props and its interface ([90acc21](https://github.com/diegoazh/gmap-vue/commit/90acc21ee6c1649ca5d5124209cfbd706996c501))

# [2.0.0](https://github.com/diegoazh/gmap-vue/compare/gmv3_v1.0.3...gmv3_v2.0.0) (2024-03-31)


### Bug Fixes

* **v3:** add type define-emit declarations ([fb29c9c](https://github.com/diegoazh/gmap-vue/commit/fb29c9c40e902525f875be75c55188647015614c))
* **v3:** improve types, interfaces and composables ([072f661](https://github.com/diegoazh/gmap-vue/commit/072f661f34802a6d2a2f7395d03290254dd75c1a))


### Features

* **v3:** implement import-library in all components ([5d13adf](https://github.com/diegoazh/gmap-vue/commit/5d13adfa03021648ffbf4abb8d9569e15bbd6af6))
* **v3:** improve exports, types and remove deprecated options ([9947ce6](https://github.com/diegoazh/gmap-vue/commit/9947ce6df1c920e5298ca41ceec82909dcb77c06))


### BREAKING CHANGES

* **v3:** CHANGE

## [1.0.3](https://github.com/diegoazh/gmap-vue/compare/gmv3_v1.0.2...gmv3_v1.0.3) (2023-07-23)


### Bug Fixes

* **v3:** fix reactivity problems with google maps objects ([#303](https://github.com/diegoazh/gmap-vue/issues/303)) ([0ef42e7](https://github.com/diegoazh/gmap-vue/commit/0ef42e7d04e522cc5ef72d8264fea15c5f273346)), closes [#301](https://github.com/diegoazh/gmap-vue/issues/301)

## [1.0.2](https://github.com/diegoazh/gmap-vue/compare/gmv3_v1.0.1...gmv3_v1.0.2) (2023-07-22)


### Bug Fixes

* **docs:** update path on import to the new structure ([3a0a0ad](https://github.com/diegoazh/gmap-vue/commit/3a0a0adf0870c5fc0d2e20ffabaa0bdb659198a7))
* **v3:** fix visibility issue excluding only null and undefined values from props ([159b048](https://github.com/diegoazh/gmap-vue/commit/159b04878c2a285f4cbf3ee259350da369b0cb73))

# [1.0.1](https://github.com/diegoazh/gmap-vue/compare/gmv3_v1.0.0...gmv3_v1.0.1) (2023-06-04)


### Bug Fixes

* **v3:** add all single file components to the npm package ([79839af](https://github.com/diegoazh/gmap-vue/commit/79839afd65a582faec977f0eabea8a4309fb9d6c))

# [1.0.0](https://github.com/diegoazh/gmap-vue/compare/v3.5.4...gmv3_v1.0.0) (2023-06-04)


### Features

* **v3:** Issue 15 vue 3 ([4dab7e2](https://github.com/diegoazh/gmap-vue/commit/4dab7e292bf9a38e7f63b33694d4d06e2ee0f2b6)), close [#15](https://github.com/diegoazh/gmap-vue/issues/15)


### BREAKING CHANGES

* **v3:** migrate to vue v3
