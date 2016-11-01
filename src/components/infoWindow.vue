/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
<div>
  <slot>
  <div class="you-will-never-find-this"></div>
  </slot>
</div>
</template>

<script>

import _ from 'lodash';
import eventHub from '../utils/eventHub';
import propsBinder from '../utils/propsBinder.js';
import eventsBinder from '../utils/eventsBinder.js';
import mutationObserver from '../utils/mutationObserver.js';
import MapComponent from './mapComponent';

const infoWindowProps = {
  options: {
    type: Object,
    twoWay: false,
  },
  content: {
    twoWay: false
  },
  opened: {
    type: Boolean,
    twoWay: true
  },
  position: {
    type: Object,
    twoWay: false
  },
  zIndex: {
    type: Number,
    twoWay:true
  }
}

const props = {
  infoWindowObj: {
    required: true,
    type: Object,
  }
}

const events = [
  'domready',
  'closeclick'
]


export default MapComponent.extend({
  props: props,
  computed:{
    options:{
      get(){
        return this.infoWindowObj.options;
      },
      set(value){
        this.infoWindowObj.options = value?value:{};
      }
    },
    content:{
      get(){
        return this.infoWindowObj.content;
      },
      set(value){
        this.infoWindowObj.content = value;
      }
    },
    opened:{
      get(){
        return this.infoWindowObj.opened;
      },
      set(value){
        this.infoWindowObj.opened = value;
      }
    },
    position:{
      get(){
        return this.infoWindowObj.position;
      },
      set(value){
        this.infoWindowObj.position = value;
      }
    },
    zIndex:{
      get(){
        return this.infoWindowObj.zIndex;
      },
      set(value){
        this.infoWindowObj.zIndex = value;
      }
    },
  },
  created() {
    this.$on('marker-ready',this.markerReady);
    this.$markerObject = null;
    this.infoWindowObj.options = (typeof this.infoWindowObj.options  === 'undefined')?{}:this.infoWindowObj.options;
    this.infoWindowObj.content = (typeof this.infoWindowObj.content  === 'undefined')?null:this.infoWindowObj.content;
    this.infoWindowObj.opened = (typeof this.infoWindowObj.opened  === 'undefined')?true:this.infoWindowObj.opened;
    this.infoWindowObj.position = (typeof this.infoWindowObj.position  === 'undefined')?null:this.infoWindowObj.position;
    this.infoWindowObj.zIndex = (typeof this.infoWindowObj.zIndex  === 'undefined')?null:this.infoWindowObj.zIndex;
  },

  mounted () {
    this.destroyed = false;

    // if the user set the content of the info window by adding children to the 
    // InfoWindow element
    this.$el.style.display='none';
    if (this.$el.getElementsByClassName('you-will-never-find-this').length === 0) {
      const innerChanged = () => {
        this.content = this.$el.innerHTML;
      }
      innerChanged();
      this.disconnect = mutationObserver(this.$el, innerChanged);
    } 
  },

  deferredReady() {
    eventHub.$emit('register-info-window', this);
    this.createInfoWindow(this.$map);
  },

  destroyed () {
    if (this.disconnect) {
      this.disconnect();
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
    this.destroyed = true;
    this.$off('marker-ready',this.markerReady);
  },

  methods: {
    openInfoWindow () {
        if(this.opened) {
          if (this.$markerObject !== null) {
            this.$infoWindow.open(this.$map, this.$markerObject);
          } else {
            this.$infoWindow.open(this.$map);
          }
        } else {
          this.$infoWindow.close();
        }
    },

    createInfoWindow(map) {
      if (this.destroyed) return;

      var el = document.createElement('div');
      el.innerHTML = this.content;

      google.maps.event.addDomListener(el, 'click', (ev) => {
        this.$emit('g-click', ev);
      });

      // setting options
      const options = _.clone(this.options);
      options.content = el;
      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.position;
      }

      this.$infoWindow = new google.maps.InfoWindow(options);

      // Binding
      const propsToBind = _.clone(infoWindowProps);
      delete propsToBind.opened;
      propsBinder(this, this.$infoWindow, propsToBind);
      eventsBinder(this, this.$infoWindow, events);

      // watching
      this.$infoWindow.addListener('closeclick', () => {
        this.opened = false;
      });

      this.$watch('opened', () => {
        this.openInfoWindow();
      });

      // Open if needed
      this.openInfoWindow();
    },
    markerReady(marker, map) {
      this.$markerObject = marker.$markerObject;
      marker.$on('g-click', () => {
        this.opened = !this.opened;
      });
    }
  }
});
</script>

