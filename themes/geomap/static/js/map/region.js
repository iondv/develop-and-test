'use strict';

(function () {

  Map.Region = function (filter, data) {
    this.filter = filter;
    this.data = data;
    this.id = data.properties.osmId;
    this.geoObject = this.createGeoObject();
    this.init();
  };

  Map.Region.prototype = {
    constructor: Map.Region,

    createGeoObject: function () {
      var level = this.getLevel();
      var diff = this.filter.maxRegionLevel - level;
      return new ymaps.GeoObject(this.data, {
        zIndex: level,
        zIndexHover: level,
        strokeWidth: Math.max(1, level == 2 ? 2 : diff),
        strokeColor: this.filter.params.strokeColors[diff] || '#000',
        fillColor: this.filter.params.fillColor,
        simplificationFixedPoints: this.data.geometry.fixedPoints
      });
    },

    init: function () {
      this.filter.collection.add(this.geoObject);
    },

    getLevel: function () {
      return this.data.properties.level;
    },

    // RELATIONS

    getParent: function () {
      var parents = this.data.properties.parents;
      return parents && parents.length ? this.filter.regions[parents[0].id] : null;
    },

    getChildren: function () {
      var items = [];
      for (var i = 0; i < this.filter.regionList.length; ++i) {
        if (this.filter.regionList[i].getParent() === this) {
          items.push(this.filter.regionList[i]);
        }
      }
      return items;
    },

    hasAncestor: function (ancestor) {
      var parents = this.data.properties.parents;
      if (parents) {
        for (var i = 0; i < parents.length; ++i) {
          if (parents[i].id === ancestor.id) {
            return true;
          }
        }
      }
      return false;
    },

    getDescendants: function () {
      var items = [];
      for (var i = 0; i < this.filter.regionList.length; ++i) {
        if (this.filter.regionList[i].hasAncestor(this)) {
          items.push(this.filter.regionList[i]);
        }
      }
      return items;
    },

    // EVENTS

    dblclick: function (event) {
      event.preventDefault();
      this.filter.setActiveRegion(this);
    },

    click: function (event) {
      //console.log('click');
    }
  };

  // PARSE

  Map.Region.createRegions = function (filter, geoJson, options) {
    options = $.extend({
      latLongOrder: true
    }, options);
    var regions = {};
    for (var i = 0; i < geoJson.features.length; ++i) {
      var line = geoJson.features[i];
      if (line.geometry) {
        var region = new Map.Region(filter, options.latLongOrder ? line : convertCoordinate(line));
        regions[region.id] = region;
      } else {
        console.error('Osm line fail', line);
      }
    }
    return regions;
  };

  function convertCoordinate (feature) {
    return {
      type: "Feature",
      geometry: {
        type: 'Polygon',
        fillRule: feature.geometry.coordinates.length > 1 ? 'evenOdd' : 'nonZero',
        coordinates: flip(feature.geometry.coordinates)
      },
      properties: feature.properties
    };
  }

  function flip (a) {
    var b = [];
    for (var i = 0, l = a.length; i < l; ++i) {
      b[i] = flipa(a[i]);
    }
    return b;
  }

  function flipa (a) {
    var b = [];
    for (var i = 0, l = a.length; i < l; ++i) {
      b[i] = [a[i][1], a[i][0]];
    }
    return b;
  }

})();
