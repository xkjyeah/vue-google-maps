/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

<template>
</template>

<script>

import _ from 'lodash';
import eventBinder from '../utils/eventsBinder.js';
import propsBinder from '../utils/propsBinder.js';
import MapComponent from './mapComponent';
import getPropsValuesMixin from '../utils/getPropsValuesMixin.js';

const rectangleProps = {
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
    'rightclick'
]
const getLocalField = function (self, field){
  return (typeof self.$options.propsData[field] !== 'undefined')?self[field]:self.rectangleObj[field];
};
const setLocalField = function (self, field, value){
  self.rectangleObj[field] = value;
  self.$emit(field+'_changed', value);
  self.$nextTick(function (){
    self.rectangleObj[field] = getLocalField(self, field);
  });
};
export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    data(){
        return {
            rectangleObj:{
                bounds:{},
                draggable:null,
                editable:null,
                options:{},
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
        this.rectangleObj.bounds = this.bounds;
        this.rectangleObj.draggable = this.draggable;
        this.rectangleObj.editable = this.editable;
        this.rectangleObj.options = this.options;
    },
    deferredReady() {
        const options = _.clone(this.getPropsValues());
        options.map = this.$map;
        this.createRectangle(options, this.$map);
    },
    methods: {
        createRectangleObject(options){
            return new google.maps.Rectangle(options);
        },
        createRectangle (options, map) {
            this.$rectangleObject = this.createRectangleObject(options);
            propsBinder(this, this.$rectangleObject, rectangleProps);
            eventBinder(this, this.$rectangleObject, events);

            const updateBounds = () => {
                this.local_bounds = this.$rectangleObject.getBounds();
            }

            this.$watch('bounds_changed', updateBounds, {deep: true});
        },
    },
    destroyed () {
        if (this.$rectangleObject) {
          this.$rectangleObject.setMap(null);
        }
    },
});
</script>
