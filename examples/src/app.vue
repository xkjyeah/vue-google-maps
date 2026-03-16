/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
<template>
<div class="app-panel">
  <div class="settings-panel">
    <h1>Map information</h1> Map center latitude:
    <input type="number" v-model.number="reportedCenter.lat" @change="updateMapCenter" />
    <br> Map center longitude:
    <input type="number" v-model.number="reportedCenter.lng" @change="updateMapCenter" />
    <br> Map bounds: {{mapBounds | json}}
    <br> Map zoom: <input type="number" v-model.number.lazy="zoom" >
    <br> Dragged {{drag}} times
    <br> Left clicked {{mapClickedCount}} times
    <br> Map type:
    <select id="" name="" v-model="mapType">
      <option value="roadmap">roadmap</option>
      <option value="hybrid">hybrid</option>
      <option value="satellite">satellite</option>
      <option value="terrain">terrain</option>
    </select>
    <br> Map style: <select id="" name="" v-model="mapStyle">
    <option value="red">red</option>
    <option value="green">green</option>
    <option value="normal">normal</option>
  </select>
    <br> Enable scrollwheel zooming on the map: <input type="checkbox" v-model="scrollwheel">
    <br>
    <button @click="addMarker"> Add a new Marker</button> (or right click on the map :) )
    <h1>Clusters</h1> enabled: <input type="checkbox" v-model="clustering">
    </br>
    Grid size: <input type="number" v-model.number="gridSize">
    <br>
    <h1>Polyline</h1> Editable: <input type="checkbox" v-model="pleditable">
    <button @click="resetPlPath">Reset path</button>
    <br> Visible: <input type="checkbox" number v-model="plvisible">
    <br>
    <h1>Polygon</h1> Visible: <input type="checkbox" v-model="pgvisible"> <br>
    <button @click="pgPath = opgPath">Reset Polygon to pentagon</button><br>
    <button @click="pgPath = originalPlPath">Reset Polygon to a simple polygon</button><br> Path: {{pgPath | json}}
    <br>
    <h1>Circle</h1> Visible: <input type="checkbox" v-model="displayCircle"><br> {{circleBounds | json}}
    <br>
    <h1>Rectangle</h1> Visible: <input type="checkbox" v-model="displayRectangle"><br> {{rectangleBounds | json}}
    <br>
    <h1>PlaceInput</h1>
    <gmap-place-input label="Add a marker at this place" :select-first-on-enter="true" @place_changed="updatePlace($event)"></gmap-place-input>
    <br>
    <h1> Standalone infoWindow </h1> modal 1 : <input type="checkbox" number v-model="ifw"><br> modal 2: <input type="checkbox" number v-model="ifw2"> <input type="text" v-model="ifw2text">
    <h1>Markers</h1> Display only markers with even ID (to test filters) <input type="checkbox" number v-model="markersEven"><br>
    <table>
      <tr>
        <th>lat</th>
        <th>lng</th>
        <th>opacity</th>
        <th>enabled</th>
        <th>draggable</th>
        <th>clicked</th>
        <th>right clicked</th>
        <th>Drag-ended</th>
        <th>Open info window</th>
        <th>infoWIndow text</th>
        <th>Delete me</th>
      </tr>
      <tr v-for="(m, index) in markers" :key="index">
        <td>
          <input type="number" v-model.number="m.position.lat">
        </td>
        <td>
          <input type="number" v-model.number="m.position.lng">
        </td>
        <td>
          <input type="number" v-model.number="m.opacity">
        </td>
        <td>
          <input type="checkbox" v-model="m.enabled">
        </td>
        <td>
          <input type="checkbox" v-model="m.draggable">
        </td>
        <td>{{m.clicked}}</td>
        <td>{{m.rightClicked}}</td>
        <td>{{m.dragended}}</td>
        <td>
          <input type="checkbox" v-model="m.ifw" number>
        </td>
        <td>
          <input type="text" v-model="m.ifw2text">
        </td>
        <td><button @click="markers.splice(markers.indexOf(m), 1)">Delete me </button></td>
      </tr>
    </table>
  </div>
  <gmap-map :center="center" :zoom="zoom" :map-type-id="mapType" :options="{styles: mapStyles, scrollwheel: scrollwheel}" @rightclick="mapRclicked" @drag="drag++" @click="mapClickedCount++" class="map-panel" @zoom_changed="update('zoom', $event)" @center_changed="update('reportedCenter', $event)"
      @maptypeid_changed="update('mapType', $event)" @bounds_changed="update('bounds', $event)">
    <gmap-cluster :grid-size="gridSize" v-if="clustering">
      <gmap-marker v-if="m.enabled" :position="m.position" :opacity="m.opacity" :draggable="m.draggable" @click="m.clicked++" @rightclick="m.rightClicked++" @dragend="m.dragended++" @position_changed="updateChild(m, 'position', $event)" v-for="m in activeMarkers"
          :key="m.id">
        <gmap-info-window :opened="m.ifw">{{m.ifw2text}}</gmap-info-window>
      </gmap-marker>
    </gmap-cluster>
    <div v-if="!clustering">
      <gmap-marker v-if="m.enabled" :position="m.position" :opacity="m.opacity" :draggable="m.draggable" @click="m.clicked++" @rightclick="m.rightClicked++" @dragend="m.dragended++" @position_changed="updateChild(m, 'position', $event)" v-for="m in activeMarkers"
          :key="m.id">
        <gmap-info-window :opened="m.ifw">{{m.ifw2text}}</gmap-info-window>
      </gmap-marker>
    </div>

    <gmap-info-window :position="reportedCenter" :opened="ifw">
      To show you the bindings are working I will stay on the center of the screen whatever you do :)
      <br/> To show you that even my content is bound to vue here is the number of time you clicked on the map
      <b>{{mapClickedCount}}</b>
    </gmap-info-window>

    <gmap-info-window :position="reportedCenter" :opened="ifw2">{{ifw2text}}</gmap-info-window>

    <gmap-polyline v-if="plvisible" :path="plPath" :editable="pleditable" :draggable="true" :options="{geodesic:true, strokeColor:'#FF0000'}" @path_changed="updatePolylinePath($event)">
    </gmap-polyline>
    <gmap-polygon v-if="pgvisible" :paths="pgPath" :editable="true" :options="{geodesic:true, strokeColor:'#FF0000', fillColor:'#000000'}" @paths_changed="updatePolygonPaths($event)">
    </gmap-polygon>
    <gmap-circle v-if="displayCircle" :bounds="circleBounds" :center="reportedCenter" :radius="100000" :options="{editable: true}" @radius_changed="updateCircle('radius', $event)" @bounds_changed="updateCircle('bounds', $event)"></gmap-circle>
    <gmap-rectangle v-if="displayRectangle" :bounds="rectangleBounds" :options="{editable: true}" @bounds_changed="updateRectangle('bounds', $event)"></gmap-rectangle>
  </gmap-map>
</div>
</template>

<style>
.app-panel {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
}

.map-panel {
  flex: 4 1 80%;
}

.settings-panel {
  overflow-y: scroll;
  flex: 1 0 500px;
}

gmap-map {
  width: 100%;
  height: 600px;
  display: block;
}
</style>

<script>
import _ from 'lodash'
import GmapCluster from '../../src/components/cluster.js';

export default {
  components: {GmapCluster},
  data: function data() {
    return {
      lastId: 1,
      center: {
        lat: 48.8538302,
        lng: 2.2982161
      },
      reportedCenter: {
        lat: 48.8538302,
        lng: 2.2982161
      },
      mapBounds: {},
      clustering: true,
      zoom: 7,
      gridSize: 50,
      mapType: 'terrain',
      markers: [],
      markersEven: false,
      drag: 0,
      mapClickedCount: 0,
      ifw: true,
      ifw2: false,
      ifw2text: 'You can also use the content prop to set your modal',
      mapStyle: 'green',
      circleBounds: {},
      displayCircle: false,
      displayRectangle: false,
      rectangleBounds: {
        north: 33.685,
        south: 50.671,
        east: -70.234,
        west: -116.251
      },
      originalPlPath: [{
        lat: 37.772,
        lng: -122.214
      }, {
        lat: 21.291,
        lng: -157.821
      }, {
        lat: -18.142,
        lng: 178.431
      }, {
        lat: -27.467,
        lng: 153.027
      }],
      plPath: [{
        lat: 37.772,
        lng: -122.214
      }, {
        lat: 21.291,
        lng: -157.821
      }, {
        lat: -18.142,
        lng: 178.431
      }, {
        lat: -27.467,
        lng: 153.027
      }],
      pleditable: true,
      plvisible: false,
      pgvisible: false,
      pgPath: [
        [{
          lat: 38.872886,
          lng: -77.054720
        }, {
          lat: 38.872602,
          lng: -77.058046
        }, {
          lat: 38.870080,
          lng: -77.058604
        }, {
          lat: 38.868894,
          lng: -77.055664
        }, {
          lat: 38.870598,
          lng: -77.053346
        }],
        [{
          lat: 38.871684,
          lng: -77.056780
        }, {
          lat: 38.871867,
          lng: -77.055449
        }, {
          lat: 38.870915,
          lng: -77.054891
        }, {
          lat: 38.870113,
          lng: -77.055836
        }, {
          lat: 38.870581,
          lng: -77.057037
        }]
      ],
      opgPath: [
        [{
          lat: 38.872886,
          lng: -77.054720
        }, {
          lat: 38.872602,
          lng: -77.058046
        }, {
          lat: 38.870080,
          lng: -77.058604
        }, {
          lat: 38.868894,
          lng: -77.055664
        }, {
          lat: 38.870598,
          lng: -77.053346
        }],
        [{
          lat: 38.871684,
          lng: -77.056780
        }, {
          lat: 38.871867,
          lng: -77.055449
        }, {
          lat: 38.870915,
          lng: -77.054891
        }, {
          lat: 38.870113,
          lng: -77.055836
        }, {
          lat: 38.870581,
          lng: -77.057037
        }]
      ],
      scrollwheel: true
    };
  },

  computed: {
    activeMarkers() {
      if (this.markersEven) {
        return this.markers.filter(
          (v, k) => k % 2 == 0
        );
      } else {
        return this.markers;
      }
    },
    mapStyles() {
      switch (this.mapStyle) {
      case 'normal':
        return [];
      case 'red':
        return [{
          stylers: [{
            hue: '#890000'
          }, {
            visibility: 'simplified'
          }, {
            gamma: 0.5
          }, {
            weight: 0.5
          }]
        }, {
          elementType: 'labels',
          stylers: [{
            visibility: 'off'
          }]
        }, {
          featureType: 'water',
          stylers: [{
            color: '#890000'
          }]
        }];
      default:
        return [{
          stylers: [{
            hue: '#899999'
          }, {
            visibility: 'on'
          }, {
            gamma: 0.5
          }, {
            weight: 0.5
          }]
        }, {
          featureType: 'road',
          stylers: [{
            visibility: 'off'
          }]
        }, {
          featureType: 'transit.line',
          stylers: [{
            color: '#FF0000'
          }]
        }, {
          featureType: 'poi',
          elementType: 'labels.icon',
          stylers: [{
            visibility: 'on'
          }, {
            weight: 10
          }]
        }, {
          featureType: 'water',
          stylers: [{
            color: '#8900FF'
          }, {
            weight: 9999900000
          }, ]
        }];
      }
    }
  },

  methods: {
    updateMapCenter(which, value) { // eslint-disable-line no-unused-vars
      this.center = _.clone(this.reportedCenter);
    },
    mapClicked(mouseArgs) {
      console.log('map clicked', mouseArgs); // eslint-disable-line no-console
    },
    mapRclicked(mouseArgs) {
      const createdMarker = this.addMarker();
      createdMarker.position.lat = mouseArgs.latLng.lat();
      createdMarker.position.lng = mouseArgs.latLng.lng();
    },
    addMarker: function addMarker() {
      this.lastId++;

      this.markers.push({
        id: this.lastId,
        position: {
          lat: 48.8538302,
          lng: 2.2982161
        },
        opacity: 1,
        draggable: true,
        enabled: true,
        clicked: 0,
        rightClicked: 0,
        dragended: 0,
        ifw: true,
        ifw2text: 'This text is bad please change me :( '
      });
      return this.markers[this.markers.length - 1];
    },
    resetPlPath() {
      this.plPath = this.originalPlPath;
    },

    update(field, event) {
      if (field === 'reportedCenter') {
        // N.B. It is dangerous to update this.center
        // Because the center reported by Google Maps is not exactly
        // the same as the center you pass it.
        // Instead we update this.center only when the input field is changed.

        this.reportedCenter = {
          lat: event.lat(),
          lng: event.lng(),
        };

        // If you wish to test the problem out for yourself, uncomment the following
        // and see how your browser begins to hang:
        // this.center = _.clone(this.reportedCenter)
      } else if (field === 'bounds') {
        this.mapBounds = event;
      } else {
        this.$set(this, field, event);
      }
    },

    updateChild(object, field, event) {
      if (field === 'position') {
        object.position = {
          lat: event.lat(),
          lng: event.lng(),
        };
      }
    },

    updatePolygonPaths(paths) { //eslint-disable-line no-unused-vars
      // TODO
    },

    updatePolylinePath(paths) { //eslint-disable-line no-unused-vars
      // TODO:
    },

    updateCircle(prop, value) {
      if (prop === 'radius') {
        this.radius = value;
      } else if (prop === 'bounds') {
        this.circleBounds = value;
      }
    },

    updateRectangle(prop, value) {
      if (prop === 'bounds') {
        this.rectangleBounds = value;
      }
    },

    updatePlace(place) {
      if (place && place.geometry && place.geometry.location) {
        var marker = this.addMarker();
        marker.position.lat = place.geometry.location.lat();
        marker.position.lng = place.geometry.location.lng();
      }
    }

  },
};
</script>
