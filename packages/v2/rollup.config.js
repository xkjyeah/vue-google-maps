import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';

export default {
  input: 'src/main.js',
  output: [
    {
      dir: 'dist/esm',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      file: 'dist/main.js',
      format: 'umd',
      name: 'GmapVue',
    },
    {
      file: 'dist/gmap-vue.min.js',
      format: 'umd',
      name: 'GmapVue',
      plugins: [terser()],
    },
    {
      file: 'dist/gmap-vue.iife.js',
      format: 'iife',
      name: 'GmapVue',
      plugins: [terser()],
    },
  ],
  external: {
    vue: 'Vue',
    '@googlemaps/markerclusterer': 'MarkerClusterer',
  },
  plugins: [
    vue({ css: true, compileTemplate: true }),
    css(),
    commonjs(),
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    json(),
    copy({
      targets: [{ src: 'src/components/*', dest: 'dist/components' }],
    }),
  ],
};
