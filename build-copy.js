/* copies the components to the dist directory */
require('shelljs/global')

cp('src/components/info-window.vue', 'dist/components/')
cp('src/components/map.vue', 'dist/components/')
cp('src/components/place-input.vue', 'dist/components/')
cp('src/components/autocomplete.vue', 'dist/components/')
cp('src/components/street-view-panorama.vue', 'dist/components/')
