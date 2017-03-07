import _ from "lodash";
import propsBinder from "../utils/propsBinder.js";
import eventsBinder from "../utils/eventsBinder.js";
import MapElementMixin from "./mapElementMixin";
import generatePropsToBind from "../utils/generatePropsToBind"

const twoWayProps = ["position","zIndex"];
const excludedProps = ["opened"];
const props = {
  options: {
    type: Object,
    default() {
      return {}
    }
  },
  content: {
    default: null
  },
  opened: {
    type: Boolean,
    default: true
  },
  position: {
    type: Object
  },
  zIndex: {
    type: Number
  }
}

const events = [
  'domready',
  'closeclick',
  'content_changed'
]

export default {
  mixins: [MapElementMixin],
  replace: false,
  props: props,
  data(){
    return {
      infoWindowObj: {
        opened: true,
        position: {}
      }
    }
  },
  computed: {
    local_opened: {
      get(){
        return (typeof this.$options.propsData['opened'] !== 'undefined') ? this.opened : this.infoWindowObj.opened;
      },
      set(value){
        this.infoWindowObj.opened = value;
        this.$emit('opened_changed', value);
        this.$nextTick(function () {
          if (this.infoWindowObj.opened == this.local_opened)
            return;
          this.infoWindowObj.opened = this.local_opened;
          this.openInfoWindow();
        });
      }
    },
    local_position: {
      get(){
        return (typeof this.$options.propsData['position'] !== 'undefined') ? this.position : this.infoWindowObj.position;
      },
      set(value){
        this.infoWindowObj.position = value;
        this.$emit('position-changed', value);
      }
    },
  },
  beforeCreate(){
    this.$parentAcceptInfoWindow = null;
    this.$markerObject = null;
  },
  mounted() {
    const el = this.$refs.flyaway;
    el.parentNode.removeChild(el);
  },

  deferredReady() {
    this.$parentAcceptInfoWindow = this.$findAncestor(
      ans => ans.$acceptInfoWindow
    );
    if (this.$parentAcceptInfoWindow) {
      this.$parentAcceptInfoWindow.$emit('register-info-window', this);
    }
    this.createInfoWindow(this.$map);
  },

  destroyed () {
    if (this.$parentAcceptInfoWindow) {
      this.$parentAcceptInfoWindow.$emit('unregister-info-window', this);
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
  },

  methods: {
    openInfoWindow () {
      if (this.local_opened) {
        if (this.$markerObject !== null) {
          this.$infoWindow.open(this.$map, this.$markerObject);
        }
        else {
          this.$infoWindow.open(this.$map);
        }
      }
      else {
        this.$infoWindow.close();
      }
    },
    createInfoWindowObject(options){
      return new google.maps.InfoWindow(options);
    },
    createInfoWindow(map) {
      // setting options
      const options = _.clone(this.options);
      options.content = this.$refs.flyaway;

      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.local_position;
      }

      this.$infoWindow = this.createInfoWindowObject(options);

      // Binding
      propsBinder(this, this.$infoWindow, generatePropsToBind(props,twoWayProps,excludedProps));
      eventsBinder(this, this.$infoWindow, events);

      // watching
      this.$on('closeclick', function (ev) {
        this.local_opened = false;
      });

      this.$watch('local_opened', () => {
        this.openInfoWindow();
      });

      this.openInfoWindow();
    }
  }
}