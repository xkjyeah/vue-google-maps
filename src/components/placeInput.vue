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
      bounds: {
          type: Object
      },
      place: {
          type: Object,
          default: function() {
            return {
              name: ''
            };
          }
      },
      componentRestrictions: {
          type: Object,
          default: null,
      },
      types: {
          type: Array,
          default: function() { return []; }
      },
      placeholder: {
        type: String
      },
      className: {
          type: String
      },
      label: {
          type: String,
          default: null
      },
      selectFirstOnEnter: {
        type: Boolean,
        default: false
      },
      autoFitOnUpdatePlace: {
        type: Boolean,
        default: false
      },
      mapEmbedded: {
        type: Boolean,
        default: false
      }
  }
  const events = [
    'place_changed'
  ];
  const getLocalField = function (self, field){
    return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.placeInputObj[field];
  };
  const setLocalField = function (self, field, value){
    self.placeInputObj[field] = value;
    self.$emit(field.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase()+'_changed', value);
    self.$nextTick(function (){
      self.placeInputObj[field] = getLocalField(self, field);
    });
  };
  export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    data(){
        return {
            placeInputObj:{
                bounds:{},
                place:{},
                componentRestrictions:{},
                types:[],
                placeholder:null,
                className:null,
                label:null,
                selectFirstOnEnter:null,
                autoFitOnUpdatePlace:null,
                mapEmbedded:null
            }
        };
    },
    computed:{
      local_bounds:{
        get(){
            return getLocalField(this, 'bounds');
        },
        set(value){
            setLocalField(this, 'bounds', value);
        }
      },
      local_place:{
        get(){
            return getLocalField(this, 'place');
        },
        set(value){
            setLocalField(this, 'place', value);
        }
      },
      local_componentRestrictions:{
        get(){
            return getLocalField(this, 'componentRestrictions');
        },
        set(value){
            //setLocalField(this, 'componentRestrictions', value);
        }
      },
      local_types:{
        get(){
            return getLocalField(this, 'types');
        },
        set(value){
            //setLocalField(this, 'types', value);
        }
      },
      local_placeholder:{
        get(){
            return getLocalField(this, 'placeholder');
        },
        set(value){
            //setLocalField(this, 'placeholder', value);
        }
      },
      local_className:{
        get(){
            return getLocalField(this, 'className');
        },
        set(value){
            //setLocalField(this, 'className', value);
        }
      },
      local_label:{
        get(){
            return getLocalField(this, 'label');
        },
        set(value){
            //setLocalField(this, 'label', value);
        }
      },
      local_selectFirstOnEnter:{
        get(){
            return getLocalField(this, 'selectFirstOnEnter');
        },
        set(value){
            //setLocalField(this, 'selectFirstOnEnter', value);
        }
      },
      local_autoFitOnUpdatePlace:{
        get(){
            return getLocalField(this, 'autoFitOnUpdatePlace');
        },
        set(value){
            //setLocalField(this, 'autoFitOnUpdatePlace', value);
        }
      },
      local_mapEmbedded:{
        get(){
            return getLocalField(this, 'mapEmbedded');
        },
        set(value){
            //setLocalField(this, 'mapEmbedded', value);
        }
      }
    },
    created(){
        this.$on('g-place_changed',this.placeChanged);
        this.autoCompleter = null;
        this.placeInputObj.bounds = this.bounds;
        this.placeInputObj.place = this.place;
        this.placeInputObj.componentRestrictions = this.componentRestrictions;
        this.placeInputObj.types = this.types;
        this.placeInputObj.placeholder = this.placeholder;
        this.placeInputObj.className = this.className;
        this.placeInputObj.label = this.label;
        this.placeInputObj.selectFirstOnEnter = this.selectFirstOnEnter;
        this.placeInputObj.autoFitOnUpdatePlace = this.autoFitOnUpdatePlace;
        this.placeInputObj.mapEmbedded = this.mapEmbedded;
        this.$registerComponent = this.local_mapEmbedded;
    },
    mounted () {
    },
    deferredReady() {
      const input = this.$refs.input;
      input.value = this.local_place.name;
      if (this.local_mapEmbedded){
        if (this.$map) {
          this.$map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        }
      }
      loaded.then(() => {
        window.i = input;
        const options = _.clone(this.getPropsValues());
        if (this.local_selectFirstOnEnter) {
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
        this.local_place = this.autoCompleter.getPlace();
        if (this.local_autoFitOnUpdatePlace)
            this.autoFitPlace(this.local_place);
      }
    }
  });
</script>
