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
    rectangleObj:{
        type: Object,
        required: true,
        validator: function (value) {
            return (typeof value.bounds === 'object');
        }
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

export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    computed:{
        bounds:{
            get(){
                return this.rectangleObj.bounds;
            },
            set(value){
                this.rectangleObj.bounds = value;
            }
        },
        draggable:{
            get(){
                return this.rectangleObj.draggable;
            },
            set(value){
                this.rectangleObj.draggable = value;
            }
        },
        editable:{
            get(){
                return this.rectangleObj.editable;
            },
            set(value){
                this.rectangleObj.editable = value;
            }
        },
        options:{
            get(){
                return this.rectangleObj.options;
            },
            set(value){
                this.rectangleObj.options = value;
            }
        }
    },
    created(){
        this.rectangleObj.bounds = (typeof this.rectangleObj.bounds === 'undefined')?null:this.rectangleObj.bounds;
        this.rectangleObj.draggable = (typeof this.rectangleObj.draggable === 'undefined')?false:this.rectangleObj.draggable;
        this.rectangleObj.editable = (typeof this.rectangleObj.editable === 'undefined')?false:this.rectangleObj.editable;
        this.rectangleObj.options = (typeof this.rectangleObj.options === 'undefined')?{}:this.rectangleObj.options;
    },
    mounted () {
        this.destroyed = false;
    },
    deferredReady() {
        const options = _.clone(this.rectangleObj);
        options.map = this.$map;
        this.createRectangle(options, this.$map);
    },

    methods: {
        createRectangle (options, map) {
            if (this.destroyed) return;
            this.$rectangleObject = new google.maps.Rectangle(options);
            propsBinder(this, this.$rectangleObject, rectangleProps);
            eventBinder(this, this.$rectangleObject, events);

            const updateBounds = () => {
                this.bounds = this.$rectangleObject.getBounds();
            }

            this.$watch('bounds_changed', updateBounds, {deep: true});
        },

    },
             
    destroyed () {
        if (this.$rectangleObject) {
          this.$rectangleObject.setMap(null);
        }
        this.destroyed = true;
    },
});
</script>
