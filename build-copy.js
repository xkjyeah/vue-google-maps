/* copies the components to the dist directory */
require('shelljs/global')

cp('src/components/infoWindow.vue', 'dist/components/')
cp('src/components/map.vue', 'dist/components/')
cp('src/components/placeInput.vue', 'dist/components/')
