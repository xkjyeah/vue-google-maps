<template>
    <label>
        <span v-text="label"></span>
        <input type="text" ref="input" :placeholder="placeholder" :class="className"/>
    </label>
</template>

<script>
  import _ from 'lodash';
  import eventBinder from '../utils/eventsBinder.js';
  import propsBinder from '../utils/propsBinder.js';
  import MapComponent from './mapComponent';
  import downArrowSimulator from '../utils/simulateArrowDown.js';
  import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';
  import {loaded} from '../manager.js';

  const placeInputProps = {
      bounds: {
          type: Object,
          twoWay: true
      },
      place: {
          type: Object,
          twoWay: true
      },
      componentRestrictions: {
          type: Object
      },
      types: {
          type: Array
      },
      placeholder: {
        type: String
      },
      className: {
          type: String
      },
      label: {
          type: String
      },
      selectFirstOnEnter: {
        type: Boolean
      },
      autoFitOnUpdatePlace: {
        type: Boolean
      },
      mapEmbedded: {
        type: Boolean
      }
  }

  const props = {
    placeInputObj:{
      type: Object,
      required: true
    }
  }
  const events = [
    'place_changed'
  ];

  export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    computed:{
      bounds:{
        get(){
          return this.placeInputObj.bounds;
        },
        set(value){
          this.placeInputObj.bounds = value;
        }
      },
      place:{
        get(){
          return this.placeInputObj.place;
        },
        set(value){
          this.placeInputObj.place = value;
        }
      },
      componentRestrictions:{
        get(){
          return this.placeInputObj.componentRestrictions;
        },
        set(value){
          this.placeInputObj.componentRestrictions = value;
        }
      },
      types:{
        get(){
          return this.placeInputObj.types;
        },
        set(value){
          this.placeInputObj.types = value;
        }
      },
      placeholder:{
        get(){
          return this.placeInputObj.placeholder;
        },
        set(value){
          this.placeInputObj.placeholder = value;
        }
      },
      className:{
        get(){
          return this.placeInputObj.className;
        },
        set(value){
          this.placeInputObj.className = value;
        }
      },
      label:{
        get(){
          return this.placeInputObj.label;
        },
        set(value){
          this.placeInputObj.label = value;
        }
      },
      selectFirstOnEnter:{
        get(){
          return this.placeInputObj.selectFirstOnEnter;
        },
        set(value){
          this.placeInputObj.selectFirstOnEnter = value;
        }
      },
      autoFitOnUpdatePlace:{
        get(){
          return this.placeInputObj.autoFitOnUpdatePlace;
        },
        set(value){
          this.placeInputObj.autoFitOnUpdatePlace = value;
        }
      },
      mapEmbedded:{
        get(){
          return this.placeInputObj.mapEmbedded;
        },
        set(value){
          this.placeInputObj.mapEmbedded = value;
        }
      }
    },
    created(){
        this.$on('g-place_changed',this.placeChanged);
        this.placeInputObj.bounds = (typeof this.placeInputObj.bounds === 'undefined')?null:this.placeInputObj.bounds;
        this.placeInputObj.place = {
            name: ''
        };
        this.placeInputObj.place = (typeof this.placeInputObj.place === 'undefined')?this.placeInputObj.place:this.placeInputObj.place;
        this.placeInputObj.componentRestrictions = (typeof this.placeInputObj.componentRestrictions === 'undefined')?null:this.placeInputObj.componentRestrictions;
        this.placeInputObj.types = (typeof this.placeInputObj.types === 'undefined')?[]:this.placeInputObj.types;
        this.placeInputObj.placeholder = (typeof this.placeInputObj.placeholder === 'undefined')?null:this.placeInputObj.placeholder;
        this.placeInputObj.className = (typeof this.placeInputObj.className === 'undefined')?null:this.placeInputObj.className;
        this.placeInputObj.label = (typeof this.placeInputObj.label === 'undefined')?null:this.placeInputObj.label;
        this.placeInputObj.selectFirstOnEnter = (typeof this.placeInputObj.selectFirstOnEnter === 'undefined')?false:this.placeInputObj.selectFirstOnEnter;
        this.placeInputObj.autoFitOnUpdatePlace = (typeof this.placeInputObj.autoFitOnUpdatePlace === 'undefined')?false:this.placeInputObj.autoFitOnUpdatePlace;
        this.placeInputObj.mapEmbedded = (typeof this.placeInputObj.mapEmbedded === 'undefined')?false:this.placeInputObj.mapEmbedded;
        this.$registerComponent = this.placeInputObj.mapEmbedded;
    },
    mounted () {
    },
    deferredReady() {
      if (this.destroyed)
        return;
      const input = this.$refs.input;
      input.value = this.place.name;
      if (this.placeInputObj.mapEmbedded){
        if (this.$map) {
          this.$map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        }
      }
      loaded.then(() => {
        window.i = input;
        const options = _.clone(this.placeInputObj);
        if (this.selectFirstOnEnter) {
          downArrowSimulator(this.$refs.input);
        }
        this.autoCompleter = new google.maps.places.Autocomplete(this.$refs.input, options);
        eventBinder(this, this.autoCompleter, events);
        const propsToBind = _.clone(placeInputProps);
        delete propsToBind.placeholder;
        delete propsToBind.place;
        delete propsToBind.selectFirstOnEnter;
        delete propsToBind.autoFitOnUpdatePlace;
        delete propsToBind.mapEmbedded;
        propsBinder(this, this.autoCompleter, propsToBind);
      }).catch(() => {
        setTimeout(() => {
          throw new Error("Impossible to load the Autocomplete Class from the google places api, did you loaded it ?");
        }, 0);
      });
    },
    destroyed(){
      this.$off('g-place_changed',this.placeChanged);
    },
    methods: {
      autoFitPlace(place){
        if (typeof this.$map === 'undefined' || typeof place.geometry === 'undefined')
          return;
        this.$map.fitBounds(place.geometry.viewport);
      },
      placeChanged() {
        this.place = this.autoCompleter.getPlace();
        if (this.autoFitOnUpdatePlace)
            this.autoFitPlace(this.place);
      }
    }
  });
</script>
