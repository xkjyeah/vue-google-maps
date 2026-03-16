## [3.5.2](https://github.com/diegoazh/gmap-vue/compare/v3.5.1...v3.5.2) (2022-03-12)


### Bug Fixes

* **gmap-vue:** fix mapped props and kml-layer component ([2cc7157](https://github.com/diegoazh/gmap-vue/commit/2cc7157fd506555789d167b0327e9f40dc80e742))
* **gmap-vue:** move from webpack to rollup and make differente builds ([dbafc84](https://github.com/diegoazh/gmap-vue/commit/dbafc845a9b38389f773e20d666ac2b89de0a875)), closes [#231](https://github.com/diegoazh/gmap-vue/issues/231)

## [3.5.1](https://github.com/diegoazh/gmap-vue/compare/v3.5.0...v3.5.1) (2022-03-03)


### Bug Fixes

* **gmap-vue:** add mapped props to cluster-icon component ([f008a35](https://github.com/diegoazh/gmap-vue/commit/f008a35595c92fc075286400af4c80d47b389113))

# [3.5.0](https://github.com/diegoazh/gmap-vue/compare/v3.4.5...v3.5.0) (2022-03-03)


### Features

* **gmap-vue:** add render, on-cluster-click and options props to cluster component ([8552070](https://github.com/diegoazh/gmap-vue/commit/8552070f43395ac138601405a3aa2906a5004fe9))

## [3.4.5](https://github.com/diegoazh/gmap-vue/compare/v3.4.4...v3.4.5) (2022-03-03)


### Bug Fixes

* **gmap-vue:** add missing options on marker-clusterer constructor ([7b4d573](https://github.com/diegoazh/gmap-vue/commit/7b4d5739b01c2db38a9e028309a33f46da282ffb)), closes [#255](https://github.com/diegoazh/gmap-vue/issues/255)

## [3.4.4](https://github.com/diegoazh/gmap-vue/compare/v3.4.3...v3.4.4) (2022-03-02)


### Bug Fixes

* **gmap-vue:** set default vallue of contentn prop to undefined ([bee86ad](https://github.com/diegoazh/gmap-vue/commit/bee86ad6d5537b271676262df18b868356306b12)), closes [#254](https://github.com/diegoazh/gmap-vue/issues/254)

## [3.4.3](https://github.com/diegoazh/gmap-vue/compare/v3.4.2...v3.4.3) (2022-02-21)


### Bug Fixes

* **gmap-vue:** add prop content to info-window component ([29dface](https://github.com/diegoazh/gmap-vue/commit/29dfacee6526ea5e5754f62306ff2d82f363553a))

## [3.4.2](https://github.com/diegoazh/gmap-vue/compare/v3.4.1...v3.4.2) (2022-02-19)


### Bug Fixes

* **gmap-vue:** add missing props to all shapes for drawing over the map ([c39c500](https://github.com/diegoazh/gmap-vue/commit/c39c50048ebbdc1411701bebd4f37e9718c0ed6e)), closes [#138](https://github.com/diegoazh/gmap-vue/issues/138)

## [3.4.1](https://github.com/diegoazh/gmap-vue/compare/v3.4.0...v3.4.1) (2022-02-18)


### Bug Fixes

* **gmap-vue:** change repaint method by render ([4d7b7c9](https://github.com/diegoazh/gmap-vue/commit/4d7b7c93de0ed517395e2c18fa52b0aafb565450)), closes [#247](https://github.com/diegoazh/gmap-vue/issues/247)
* **gmap-vue:** clear interval when callback was successfully called ([302c6e1](https://github.com/diegoazh/gmap-vue/commit/302c6e1efba0976fb5e13f44dabdfd2a24bb6ed5))

# [3.4.0](https://github.com/diegoazh/gmap-vue/compare/v3.3.0...v3.4.0) (2022-02-16)


### Features

* **gmap-vue:** update kml-layer adding all options as props ([d8cb91f](https://github.com/diegoazh/gmap-vue/commit/d8cb91fa6acb3c7d28d717705c1a81206016cf22)), closes [#148](https://github.com/diegoazh/gmap-vue/issues/148)

# [3.3.0](https://github.com/diegoazh/gmap-vue/compare/v3.2.0...v3.3.0) (2022-02-16)


### Features

* **gmap-vue:** add dynamic loading for google maps api ([7825dba](https://github.com/diegoazh/gmap-vue/commit/7825dbabd16cbe6181d2a6f33fc04d4830d3c4fb)), closes [#239](https://github.com/diegoazh/gmap-vue/issues/239)

# [3.2.0](https://github.com/diegoazh/gmap-vue/compare/v3.1.0...v3.2.0) (2022-02-15)


### Features

* **gmap-vue:** auto detect when google maps api is loaded ([93a9ecc](https://github.com/diegoazh/gmap-vue/commit/93a9eccbe4729e26d83d773805bc11c59e91891b))

# [3.1.0](https://github.com/diegoazh/gmap-vue/compare/v3.0.0...v3.1.0) (2022-02-15)


### Features

* **gmap-vue:** emit update:position event on markers ([6a34bb7](https://github.com/diegoazh/gmap-vue/commit/6a34bb765d76822e7b5ada2875955a8ce48cf923)), closes [#14](https://github.com/diegoazh/gmap-vue/issues/14)

# [3.0.0](https://github.com/diegoazh/gmap-vue/compare/v2.0.4...v3.0.0) (2022-02-13)


### Features

* **gmap-vue:** add custom callback option to config ([b8409e3](https://github.com/diegoazh/gmap-vue/commit/b8409e39702114e6b1b4f18923ca6840ee3a2207)), closes [#143](https://github.com/diegoazh/gmap-vue/issues/143)


### BREAKING CHANGES

* **gmap-vue:** reuse existing google maps api and rename functions

## [2.0.4](https://github.com/diegoazh/gmap-vue/compare/v2.0.3...v2.0.4) (2022-02-11)


### Bug Fixes

* **gmap-vue:** fix fields error on autocomplete component ([a6b8712](https://github.com/diegoazh/gmap-vue/commit/a6b8712097b863894a7839ab17f1640abc993f85)), closes [#118](https://github.com/diegoazh/gmap-vue/issues/118)

## [2.0.3](https://github.com/diegoazh/gmap-vue/compare/v2.0.2...v2.0.3) (2022-02-09)


### Bug Fixes

* **gmap-vue:** fix error loading cluster ([a2cb9ba](https://github.com/diegoazh/gmap-vue/commit/a2cb9badf2e1e155b4622dd0e2273abe6d5852e3)), closes [#234](https://github.com/diegoazh/gmap-vue/issues/234)

## [2.0.2](https://github.com/diegoazh/gmap-vue/compare/v2.0.1...v2.0.2) (2021-11-27)


### Bug Fixes

* **docs:** fix documentation issues with webpack config and build ([1dfed13](https://github.com/diegoazh/gmap-vue/commit/1dfed1377becab61e547a0586f6437ee43cad1e8))
* **docs:** fix vuepress alert on main readme ([ad57f64](https://github.com/diegoazh/gmap-vue/commit/ad57f6422be91e0b89b5a8e08a03af23688a2e7a))

# Change Log

## [2.0.1](https://github.com/diegoazh/gmap-vue/compare/v2.0.0...v2.0.1) (2021-11-27)


### Bug Fixes

* **docs:** update documentation with the last changes ([1caf43f](https://github.com/diegoazh/gmap-vue/commit/1caf43f2cea081ab7c7f56fc8737fd331acb2412))
* **gmap-vue:** fix build errors on the plugin ([dc70306](https://github.com/diegoazh/gmap-vue/commit/dc70306a6d871abbeccec9346e73a5d21b01a035)), closes [#226](https://github.com/diegoazh/gmap-vue/issues/226)
* **gmap-vue:** remove semantic-release-monorepo ([854ebd2](https://github.com/diegoazh/gmap-vue/commit/854ebd2bb108fc97b81a239b51d0f06fd2523e79))

# [2.0.0](https://github.com/diegoazh/gmap-vue/compare/v1.2.2...v2.0.0) (2021-11-24) [**DEPRECATED**]


### Bug Fixes

* **all:** split build process in two steps and remove lerna ([6d7f779](https://github.com/diegoazh/gmap-vue/commit/6d7f779e483a5737a4b5d34260ed82e7420bf4ba))
* **all:** update vuejs version to the latest one ([e22b276](https://github.com/diegoazh/gmap-vue/commit/e22b2764a2a1ee4052288f520e74c2ae84516e7b))
* **docs:** add exact webpack 4 to docs to avoid vuepress build errors ([797d92e](https://github.com/diegoazh/gmap-vue/commit/797d92ee2f65ed6a08bf99b8c56b872c822fc701))
* **docs:** add webpack 4 to documentation to solve vuepress build errors ([0ade630](https://github.com/diegoazh/gmap-vue/commit/0ade630bf37ce708b105d1dea9efb09dc37ae5ae))
* **docs:** wip on documentation and gmap vue ([eb777dc](https://github.com/diegoazh/gmap-vue/commit/eb777dcbb57a395220285857ff74d04b6407a3a0))
* **documentation:** add to way events for circle component ([774f287](https://github.com/diegoazh/gmap-vue/commit/774f287bfd0bd695c4fae964af0d5973503df1f6))
* **documentation:** change guide menu order ([6e2bbfb](https://github.com/diegoazh/gmap-vue/commit/6e2bbfbd06cefd8607e517ef84cdd8fcb29e4059))
* **documentation:** fix documentation for autocomplete and circle ([a289c12](https://github.com/diegoazh/gmap-vue/commit/a289c12f4a21038d4f99698642285779f684bbdc))
* **documentation:** remove unused file ([d15ebd8](https://github.com/diegoazh/gmap-vue/commit/d15ebd8166b6b2692790a2a8e036f2e8ebc3d839))
* **documentation:** update documentation for GmapCircle component ([405abd6](https://github.com/diegoazh/gmap-vue/commit/405abd677728539cfcd9a596be46a0dadfc186a4))
* **documentation:** update documentation of GmapCluster ([b06464c](https://github.com/diegoazh/gmap-vue/commit/b06464c689d453183fb013460ee5296a5a725c14))
* **documentation:** upgrade snyk from 1.370.1 to 1.372.0 ([#85](https://github.com/diegoazh/gmap-vue/issues/85)) ([916cb2b](https://github.com/diegoazh/gmap-vue/commit/916cb2bb7f08d1487d665fd255ac74954cfe3f77))
* **documentation:** upgrade vuepress from 1.5.4 to 1.6.0 ([#108](https://github.com/diegoazh/gmap-vue/issues/108)) ([dac60ad](https://github.com/diegoazh/gmap-vue/commit/dac60ada3e1e8321f92f6e6ee01b746b2b5e16ed))
* **gmap-vue:** add core-js and regenerator-runtime to use new features ([fd59848](https://github.com/diegoazh/gmap-vue/commit/fd59848e4305efe4e1d04c8df7f59a581a34a914))
* **gmap-vue:** add description for props ([63e18f4](https://github.com/diegoazh/gmap-vue/commit/63e18f4b0d238ea906e39be5c510f12c281d741d))
* **gmap-vue:** fix linter errors ([640000a](https://github.com/diegoazh/gmap-vue/commit/640000acbc61997bed689de0d3970e8b0e81b02e))
* **gmap-vue:** fix linter errors on test and examples folder ([4479404](https://github.com/diegoazh/gmap-vue/commit/44794042d45db51d797c706b911b271305cd7de8))
* **gmap-vue:** fix ref conflict on autocomplete component ([#101](https://github.com/diegoazh/gmap-vue/issues/101)) ([0471e32](https://github.com/diegoazh/gmap-vue/commit/0471e329f9c0be4d0a9e8866579dd3c50f615adc))
* **gmap-vue:** fix some code styles and linter rules ([03540f7](https://github.com/diegoazh/gmap-vue/commit/03540f743def3f83b37ff295bdbfacc9f6ce51f5))
* **gmap-vue:** fix tests and styles ([b06aa81](https://github.com/diegoazh/gmap-vue/commit/b06aa81360877132ed9f47a12c15c62d4983965c))
* **gmap-vue:** remove independen helper function files ([c08cbb8](https://github.com/diegoazh/gmap-vue/commit/c08cbb8b51a286cf39602a44ff239834bb4802fb))
* **gmap-vue:** remove unnecesary async/await ([1fba907](https://github.com/diegoazh/gmap-vue/commit/1fba907dd4f1e3b6f9943d9ee6736b31261f6e59))
* **gmap-vue:** remove unnecesary style block ([3b2b87a](https://github.com/diegoazh/gmap-vue/commit/3b2b87aeffb35e91e076a3e49b64793856481531))
* **gmap-vue:** replace deprecated uglyfy plugin for terser plugin ([ac74777](https://github.com/diegoazh/gmap-vue/commit/ac7477711d095b95d6c2d5f23ae8d5068ea9227f))
* **gmap-vue:** update link to source code ([f4c3dce](https://github.com/diegoazh/gmap-vue/commit/f4c3dce7cb3c3d6778ea37d01d56edfe35aa0116))
* **gmap-vue:** update mappedProps name ([f439eab](https://github.com/diegoazh/gmap-vue/commit/f439eab9773f5cfa4ce9e763b07e11e722b4840b))
* **gmap-vue:** use async instead promise ([af5da48](https://github.com/diegoazh/gmap-vue/commit/af5da48f27c82199c8969e86e59cb3b3e14167e4))
* packages/documentation/package.json & packages/documentation/package-lock.json to reduce vulnerabilities ([c2a8b0a](https://github.com/diegoazh/gmap-vue/commit/c2a8b0ac291fa84a76f58c817ae4978d27a3b183))
* **root:** add content for need helps and vulnerability issue templates ([aed11bc](https://github.com/diegoazh/gmap-vue/commit/aed11bcd948721791f443489481a514684b568ea))
* **root:** moving to semantic-release instead of using lerna version ([9dae26f](https://github.com/diegoazh/gmap-vue/commit/9dae26f11738201dce82e4a73238f2e82891eddc))
* **tmp:** add incomplete work to the branch ([db4d4b0](https://github.com/diegoazh/gmap-vue/commit/db4d4b0e387adba14e4ff05866c141369fc6af93))
* upgrade @google/markerclustererplus from 5.1.0 to 5.1.3 ([909eca9](https://github.com/diegoazh/gmap-vue/commit/909eca95dd2205e6b55a900b03156d4c4798b3de))
* upgrade snyk from 1.372.0 to 1.373.1 ([#87](https://github.com/diegoazh/gmap-vue/issues/87)) ([0431d1b](https://github.com/diegoazh/gmap-vue/commit/0431d1b1facb118aa73a3f2f17195b72e0695226))
* upgrade snyk from 1.373.1 to 1.401.0 ([deb8c72](https://github.com/diegoazh/gmap-vue/commit/deb8c7249849adf3140e35d7b245d8466522483a))
* upgrade vuepress from 1.5.3 to 1.5.4 ([#91](https://github.com/diegoazh/gmap-vue/issues/91)) ([0125598](https://github.com/diegoazh/gmap-vue/commit/0125598bc8009a210d43dc9cc6708ce5729de26e))


* fix(gmap-vue)!: change to use default slot and fallback content ([d53cbbe](https://github.com/diegoazh/gmap-vue/commit/d53cbbe5406507df106566da8fac82de8ef285fe))


### Features

* **all:** remove unnecesary files and upgrade dependcies ([1efc34e](https://github.com/diegoazh/gmap-vue/commit/1efc34edbc01973579785a692fb4949c90f019be))
* **all:** update marker component and its documentation ([4ee095c](https://github.com/diegoazh/gmap-vue/commit/4ee095c67052d82dda611ea05980efe2dbd5367a))
* **docs:** add link to github repo in the header menu ([d906345](https://github.com/diegoazh/gmap-vue/commit/d906345a11b18a2a06b41f9c779f108f66d6979b))
* **docs:** update and improve documentation ([f3f999d](https://github.com/diegoazh/gmap-vue/commit/f3f999dec678542791b28752d25369d0d5c081bc))
* **documentation:** add documentation for circle component ([01986fa](https://github.com/diegoazh/gmap-vue/commit/01986fa65f2610ffb2b25589d1c6c2a8b4696fc9))
* **documentation:** add documentation for cluster component ([c6b93ab](https://github.com/diegoazh/gmap-vue/commit/c6b93ab65dce2e53b4666402260e6715583c9ce8))
* **documentation:** update and unify docs for autocomplete component ([41702bd](https://github.com/diegoazh/gmap-vue/commit/41702bd8615a4e174cc0b143748c81dfda182e49))
* **gmap-vue:** add cluster.vue component and remove cluster.js ([3398d5f](https://github.com/diegoazh/gmap-vue/commit/3398d5f28448ce3150b2d9fe4e3fefc13dc0c8f1))
* **gmap-vue:** move drawing-manager,heatmap and info-window to vue files ([66d8064](https://github.com/diegoazh/gmap-vue/commit/66d80643dfae26e1284f693f8b8949407e0ef495))
* **gmap-vue:** rename all components to follow vue linter rules ([c2df328](https://github.com/diegoazh/gmap-vue/commit/c2df328acf8c3b4653feeab8a3ca6246d9969f7d))
* **gmap-vue:** update kml-layer component to a vue file ([ca4056a](https://github.com/diegoazh/gmap-vue/commit/ca4056af1b1f8b55012afd8854c1fab1a5f81f4b))
* **gmap-vue:** upgrade map.vue ([38fe7c4](https://github.com/diegoazh/gmap-vue/commit/38fe7c48602e7ae1dbb2367738220c63155e4ed8))
* **gmap-vue:** upgrade markerclustererplus ([e2aebb3](https://github.com/diegoazh/gmap-vue/commit/e2aebb31977857489e04b82001820ffee5640d52))
* **gmap-vue:** upgrade markerclustererplus ([e64eafa](https://github.com/diegoazh/gmap-vue/commit/e64eafad74dd3c250cbb376250a669901f78fad6))


### BREAKING CHANGES

* we remove the slot input and use the default one

## [1.5.0](https://github.com/diegoazh/gmap-vue/compare/gmap-vue@1.4.1...gmap-vue@1.5.0) (2020-10-31)

## [1.4.1](https://github.com/diegoazh/gmap-vue/compare/gmap-vue@1.4.0...gmap-vue@1.4.1) (2020-10-30)

**Note:** Version bump only for package gmap-vue





# 1.4.0 (2020-08-09)


### Bug Fixes

* **all:** update vuejs version to the latest one ([e22b276](https://github.com/diegoazh/gmap-vue/commit/e22b2764a2a1ee4052288f520e74c2ae84516e7b))
* **gmap-vue:** fix hit and drawer map components and examples ([#56](https://github.com/diegoazh/gmap-vue/issues/56)) ([#57](https://github.com/diegoazh/gmap-vue/issues/57)) ([778a927](https://github.com/diegoazh/gmap-vue/commit/778a927318ca27373d64abd33f1675ed7fa0cee8)), closes [#44](https://github.com/diegoazh/gmap-vue/issues/44) [#44](https://github.com/diegoazh/gmap-vue/issues/44)
* **gmap-vue:** fix tests and styles ([b06aa81](https://github.com/diegoazh/gmap-vue/commit/b06aa81360877132ed9f47a12c15c62d4983965c))



## 1.2.1 (2020-08-03)



# 1.2.0 (2020-08-03)


### Features

* **gmap-vue:** add a drawing manager component ([#19](https://github.com/diegoazh/gmap-vue/issues/19)) ([d7afa94](https://github.com/diegoazh/gmap-vue/commit/d7afa940ca1f81e4241c058e99c5abb154170840))
* **gmap-vue:** add a heatmap layer component  ([#8](https://github.com/diegoazh/gmap-vue/issues/8)) ([5d7d9c0](https://github.com/diegoazh/gmap-vue/commit/5d7d9c0885e430948af7510ade9607577a5bac73))





# 1.3.0 (2020-08-08)


### Bug Fixes

* **all:** update vuejs version to the latest one ([50ffde7](https://github.com/diegoazh/gmap-vue/commit/50ffde7f8794cfe4c04462edb817f832f801c173))
* **gmap-vue:** fix hit and drawer map components and examples ([#56](https://github.com/diegoazh/gmap-vue/issues/56)) ([#57](https://github.com/diegoazh/gmap-vue/issues/57)) ([778a927](https://github.com/diegoazh/gmap-vue/commit/778a927318ca27373d64abd33f1675ed7fa0cee8)), closes [#44](https://github.com/diegoazh/gmap-vue/issues/44) [#44](https://github.com/diegoazh/gmap-vue/issues/44)
* **gmap-vue:** fix tests and styles ([d014f18](https://github.com/diegoazh/gmap-vue/commit/d014f189f1ba7ec7183a36710463f16acf574106))



## 1.2.1 (2020-08-03)



# 1.2.0 (2020-08-03)


### Features

* **gmap-vue:** add a drawing manager component ([#19](https://github.com/diegoazh/gmap-vue/issues/19)) ([d7afa94](https://github.com/diegoazh/gmap-vue/commit/d7afa940ca1f81e4241c058e99c5abb154170840))
* **gmap-vue:** add a heatmap layer component  ([#8](https://github.com/diegoazh/gmap-vue/issues/8)) ([5d7d9c0](https://github.com/diegoazh/gmap-vue/commit/5d7d9c0885e430948af7510ade9607577a5bac73))
