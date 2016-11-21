/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

import _ from "lodash";

export class VueMapObject {
  constructor(settings) {
    this.center = (typeof settings.center === 'undefined') ? null : settings.center;
    this.zoom = (typeof settings.zoom === 'undefined') ? 8 : settings.zoom;
    this.heading = (typeof settings.heading === 'undefined') ? null : settings.heading;
    this.mapTypeId = (typeof settings.mapTypeId === 'undefined') ? 'roadmap' : settings.mapTypeId;
    this.bounds = (typeof settings.bounds === 'undefined') ? null : settings.bounds;
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
  }
}

export class VueMarkerObject {
  constructor(settings) {
    this.animation = (typeof settings.animation === 'undefined') ? null : settings.animation;
    this.attribution = (typeof settings.attribution === 'undefined') ? null : settings.attribution;
    this.clickable = (typeof settings.clickable === 'undefined') ? true : settings.clickable;
    this.cursor = (typeof settings.cursor === 'undefined') ? null : settings.cursor;
    this.draggable = (typeof settings.draggable === 'undefined') ? false : settings.draggable;
    this.icon = (typeof settings.icon === 'undefined') ? null : settings.icon;
    this.label = (typeof settings.label === 'undefined') ? null : settings.label;
    this.opacity = (typeof settings.opacity === 'undefined') ? 1 : settings.opacity;
    this.place = (typeof settings.place === 'undefined') ? null : settings.place;
    this.position = (typeof settings.position === 'undefined') ? null : settings.position;
    this.shape = (typeof settings.shape === 'undefined') ? null : settings.shape;
    this.title = (typeof settings.title === 'undefined') ? null : settings.title;
    this.zIndex = (typeof settings.zIndex === 'undefined') ? null : settings.zIndex;
    this.visible = (typeof settings.visible === 'undefined') ? true : settings.visible;
  }
}

export class VueInfoWindowObject {
  constructor(settings) {
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
    this.content = (typeof settings.content === 'undefined') ? null : settings.content;
    this.opened = (typeof settings.opened === 'undefined') ? true : settings.opened;
    this.position = (typeof settings.position === 'undefined') ? null : settings.position;
    this.zIndex = (typeof settings.zIndex === 'undefined') ? null : settings.zIndex;
  }
}

export class VueMarkerInfoWindowObject extends VueMarkerObject {
  constructor(settings) {
    super(settings);
    this.infoWindowObj = new VueInfoWindowObject(settings.infoWindowObj ? settings.infoWindowObj : {});
    if (this.infoWindowObj.position === null) {
      this.infoWindowObj.position = _.clone(this.position);
    }
  }
}

export class VueCircleObject {
  constructor(settings) {
    this.center = (typeof settings.center === 'undefined') ? null : settings.center;
    this.radius = (typeof settings.radius === 'undefined') ? 1000 : settings.radius;
    this.bounds = (typeof settings.bounds === 'undefined') ? null : settings.bounds;
    this.draggable = (typeof settings.draggable === 'undefined') ? false : settings.draggable;
    this.editable = (typeof settings.editable === 'undefined') ? false : settings.editable;
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
  }
}

export class VueRectangleObject {
  constructor(settings) {
    this.bounds = (typeof settings.bounds === 'undefined') ? null : settings.bounds;
    this.draggable = (typeof settings.draggable === 'undefined') ? false : settings.draggable;
    this.editable = (typeof settings.editable === 'undefined') ? false : settings.editable;
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
  }
}

export class VuePolygonObject {
  constructor(settings) {
    this.path = (typeof settings.path === 'undefined') ? null : settings.path;
    this.paths = (typeof settings.paths === 'undefined') ? null : settings.paths;
    this.draggable = (typeof settings.draggable === 'undefined') ? false : settings.draggable;
    this.editable = (typeof settings.editable === 'undefined') ? false : settings.editable;
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
  }
}

export class VuePolylineObject {
  constructor(settings) {
    this.path = (typeof settings.path === 'undefined') ? null : settings.path;
    this.draggable = (typeof settings.draggable === 'undefined') ? false : settings.draggable;
    this.editable = (typeof settings.editable === 'undefined') ? false : settings.editable;
    this.options = (typeof settings.options === 'undefined') ? {} : settings.options;
  }
}

export class VuePlaceInputObject {
  constructor(settings) {
    this.bounds = (typeof settings.bounds === 'undefined') ? null : settings.bounds;
    this.place = {
      name: ''
    };
    this.place = (typeof settings.place === 'undefined') ? this.place : settings.place;
    this.componentRestrictions = (typeof settings.componentRestrictions === 'undefined') ? null : settings.componentRestrictions;
    this.types = (typeof settings.types === 'undefined') ? [] : settings.types;
    this.placeholder = (typeof settings.placeholder === 'undefined') ? null : settings.placeholder;
    this.className = (typeof settings.className === 'undefined') ? null : settings.className;
    this.label = (typeof settings.label === 'undefined') ? null : settings.label;
    this.selectFirstOnEnter = (typeof settings.selectFirstOnEnter === 'undefined') ? false : settings.selectFirstOnEnter;
    this.autoFitOnUpdatePlace = (typeof settings.autoFitOnUpdatePlace === 'undefined') ? false : settings.autoFitOnUpdatePlace;
    this.mapEmbedded = (typeof settings.mapEmbedded === 'undefined') ? false : settings.mapEmbedded;
  }
}