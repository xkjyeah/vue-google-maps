import mapElementFactory from './mapElementFactory.js'

const props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  },
  path: {
    type: Array,
    twoWay: true,
    noBind: true
  },
  paths: {
    type: Array,
    twoWay: true,
    noBind: true
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

export default mapElementFactory({
  props: {
    deepWatch: {
      type: Boolean,
      default: false
    }
  },
  events,
  mappedProps: props,
  name: 'polygon',
  ctr: () => google.maps.Polygon,

  beforeCreate (options) {
    if (!options.path) delete options.path
    if (!options.paths) delete options.paths
  },

  afterCreate (inst) {
    var clearEvents = () => {}

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    this.$watch('paths', (paths) => {
      if (paths) {
        clearEvents()

        inst.setPaths(paths)

        const updatePaths = () => {
          this.$emit('paths_changed', inst.getPaths())
        }
        const eventListeners = []

        const mvcArray = inst.getPaths()
        for (let i = 0; i < mvcArray.getLength(); i++) {
          let mvcPath = mvcArray.getAt(i)
          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])
        }
        eventListeners.push([mvcArray, mvcArray.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcArray, mvcArray.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) => // eslint-disable-line no-unused-vars
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    })

    this.$watch('path', (path) => {
      if (path) {
        clearEvents()

        inst.setPaths(path)

        const mvcPath = inst.getPath()
        const eventListeners = []

        const updatePaths = () => {
          this.$emit('path_changed', inst.getPath())
        }

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)])
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)])

        clearEvents = () => {
          eventListeners.map(([obj, listenerHandle]) => // eslint-disable-line no-unused-vars
            google.maps.event.removeListener(listenerHandle))
        }
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    })
  }
})
