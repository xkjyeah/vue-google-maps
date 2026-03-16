<template>
  <div style="background-color: #040404; display: flex; position: absolute; padding: 8px">
    <div><button @click="$emit('drawingmode_changed', 'rectangle')">Rectangle</button></div>
    <div><button @click="$emit('drawingmode_changed', 'circle')">Circle</button></div>
    <div><button @click="$emit('drawingmode_changed', 'polyline')">Line</button></div>
    <div><button @click="$emit('drawingmode_changed', 'polygon')">Polygon</button></div>
    <div><button @click="$emit('delete_selection')">Delete</button></div>
    <div><button @click="$emit('save')">Save</button></div>
  </div>
</template>
