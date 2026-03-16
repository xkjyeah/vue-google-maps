---
id: introduction
title: Introduction
sidebar_position: 1
sidebar_label: Introduction
---
## Mapped props

:::warning

We are trying to remove this approach and its possible that in major releases this will disappear.

:::

This are GoogleMapsOptions that we want to have like props in our Vue component.

This properties are in the way that GoogleMaps accept it and with extraneous properties for the VueJs API.
In a previous version of this plugin, to avoid repetition, we created a .js file component with a `mappedProps` key on it and used a variety of helper functions to clean it and bind it to Vue props and watch them, etc.

To day our main goal is write a more intuitive, readable and descriptive API with a better documentation of it, following this goals we move this extraneous properties to an independent file in order to consume it when is needed.

:::tip For developers
You need to remind that you need to create properties in the correspondent Vue component with the same names and the same values for those properties that are not extraneous to Vue.
:::
