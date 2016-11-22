/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
</template>

<script>

import _ from 'lodash';
import eventBinder from '../utils/eventsBinder.js'
import propsBinder from '../utils/propsBinder.js'
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js'

const circleProps = {
    center: {
        type: Object,
        twoWay: true
    },
    radius: {
        type: Number,
        twoWay: true
    },
    bounds: {
        type: Object,
        twoWay: true
    },
    draggable: {
        type: Boolean
    },
    editable: {
        type: Boolean
    },
    options: {
        type: Object
    }
}

const props = {
    center: {
        type: Object,
        required: true
    },
    radius: {
        type: Number,
        default: 1000,
    },
    bounds: {
        type: Object
    },
    draggable: {
        type: Boolean,
        default: false,
    },
    editable: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Object
    }
}

const events = [
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'radius_changed',
    'rightclick'
]
const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.circleObj[field];
};
const setLocalField = function (self, field, value){
  self.circleObj[field] = value;
  self.$emit(field+'_changed', value);
  self.$nextTick(function (){
    self.circleObj[field] = getLocalField(self, field);
  });
};
export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    data(){
      return {
        circleObj:{
          center:{},
          radius:null,
          bounds:null,
          draggable:null,
          editable:null,
          options:{}
        }
      };
    },
    computed:{
        local_center:{
            get(){
                return getLocalField(this, 'center');
            },
            set(value){
                setLocalField(this, 'center', value);
            }
        },
        local_radius:{
            get(){
                return getLocalField(this, 'radius');
            },
            set(value){
                setLocalField(this, 'radius', value);
            }
        },
        local_bounds:{
            get(){
                return getLocalField(this, 'bounds');
            },
            set(value){
                setLocalField(this, 'bounds', value);
            }
        },
        local_draggable:{
            get(){
                return getLocalField(this, 'draggable');
            },
            set(value){
                setLocalField(this, 'draggable', value);
            }
        },
        local_editable:{
            get(){
                return getLocalField(this, 'editable');
            },
            set(value){
                setLocalField(this, 'editable', value);
            }
        },
        local_options:{
            get(){
                return getLocalField(this, 'options');
            },
            set(value){
                setLocalField(this, 'options', value);
            }
        }
    },
    created(){
        this.circleObj.center = this.center;
        this.circleObj.radius = this.radius;
        this.circleObj.bounds = this.bounds;
        this.circleObj.draggable = this.draggable;
        this.circleObj.editable = this.editable;
        this.circleObj.options = this.options;
    },
    deferredReady() {
        const options = _.clone(this.getPropsValues());
        options.map = this.$map;
        delete options.bounds;
        this.createCircle(options, this.$map);
    },

    methods: {
        createCircle (options, map) {
            this.$circleObject = this.createCircleObject(options);
            // we cant bind bounds because there is no `setBounds` method
            // on the Circle object
            const boundProps = _.clone(circleProps);
            delete boundProps.bounds;
            propsBinder(this, this.$circleObject, boundProps);
            eventBinder(this, this.$circleObject, events);

            const updateBounds = () => {
                this.local_bounds = this.$circleObject.getBounds();
            }

            this.$watch('local_radius', updateBounds);
            // because center is an object and we need to be warned even if only the lat or lng change. not the whole reference
            this.$watch('local_center', updateBounds, {deep: true});
            updateBounds();
        },
        createCircleObject(options){
            return new google.maps.Circle(options)
        }
    },

    destroyed () {
      if (this.$circleObject) {
        this.$circleObject.setMap(null);
      }
    },
});
</script>
