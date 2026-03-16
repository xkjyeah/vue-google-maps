---
id: gmv-map-slots
sidebar_position: 6
sidebar_label: GmvMap Slots
---
# GmvMap Slots

:::note
_This is the MapLayer component_
:::

GmvMap component has **two slots** with a different behavior.
The **default slot** is wrapped in a class that sets `display: none;` so by default any component you add to your map will
be invisible.

This is ok for most of the supplied components that interact directly with the Google map object, but it's not good if
you want to bring up things like toolboxes, etc.

There is a **second slot** named **"visible"** that must be used if you want to display content within the responsive
wrapper for the map, hence that's why you'll see this in the [drawing manager with slot example](/wip). It's actually
not required in the [first example](/wip) because the default toolbox is part of the Google map object.

> Thanks to [@davydnorris](https://github.com/davydnorris) to document this part of the plugin.
