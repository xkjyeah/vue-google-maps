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
    circleObj:{
        type: Object,
        required: true,
        validator: function (value) {
            return (typeof value.center === 'object');
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
    'radius_changed',
    'rightclick'
]

export default MapComponent.extend({
    mixins: [getPropsValuesMixin],
    props: props,
    version: 2,
    computed:{
        center:{
            get(){
                return this.circleObj.center;
            },
            set(value){
                this.circleObj.center = value;
            }
        },
        radius:{
            get(){
                return this.circleObj.radius;
            },
            set(value){
                this.circleObj.radius = value;
            }
        },
        bounds:{
            get(){
                return this.circleObj.bounds;
            },
            set(value){
                this.circleObj.bounds = value;
            }
        },
        draggable:{
            get(){
                return this.circleObj.draggable;
            },
            set(value){
                this.circleObj.draggable = value;
            }
        },
        editable:{
            get(){
                return this.circleObj.editable;
            },
            set(value){
                this.circleObj.editable = value;
            }
        },
        options:{
            get(){
                return this.circleObj.options;
            },
            set(value){
                this.circleObj.options = value;
            }
        }
    },
    created(){
        this.circleObj.center = (typeof this.circleObj.center === 'undefined')?null:this.circleObj.center;
        this.circleObj.radius = (typeof this.circleObj.radius === 'undefined')?1000:this.circleObj.radius;
        this.circleObj.bounds = (typeof this.circleObj.bounds === 'undefined')?null:this.circleObj.bounds;
        this.circleObj.draggable = (typeof this.circleObj.draggable === 'undefined')?false:this.circleObj.draggable;
        this.circleObj.editable = (typeof this.circleObj.editable === 'undefined')?false:this.circleObj.editable;
        this.circleObj.options = (typeof this.circleObj.options === 'undefined')?{}:this.circleObj.options;
    },
    deferredReady() {
        if (this.destroyed)
              return;
        const options = _.clone(this.circleObj);
        options.map = this.$map;
        delete options.bounds;
        this.createCircle(options, this.$map);
    },

    methods: {
        createCircle (options, map) {
            this.$circleObject = new google.maps.Circle(options);
            // we cant bind bounds because there is no `setBounds` method
            // on the Circle object
            const boundProps = _.clone(circleProps);
            delete boundProps.bounds;
            propsBinder(this, this.$circleObject, boundProps);
            eventBinder(this, this.$circleObject, events);

            const updateBounds = () => {
                this.bounds = this.$circleObject.getBounds();
            }

            this.$watch('radius', updateBounds);
            // because center is an object and we need to be warned even if only the lat or lng change. not the whole reference
            this.$watch('center', updateBounds, {deep: true});
            updateBounds();
        }
    },

    destroyed () {
      if (this.$circleObject) {
        this.$circleObject.setMap(null);
      }
    },
});
</script>
