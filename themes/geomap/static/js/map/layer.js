'use strict';

(function () {

  Map.Layer = function (nav, data) {
    this.nav = nav;
    this.map = nav.map;
    this.ymap = nav.map.ymap;
    this.data = data;
    this.active = false;
    this.objectLoaders = [];
    this.init();
  };

  Map.Layer.prototype = {
    constructor: Map.Layer,

    init: function () {
      this.createObjectLoaders();
    },

    // OBJECT LOADER

    removeObjectLoaders: function () {
      Helper.array.each(this.objectLoaders, 'setParent', null);
      this.objectLoaders = [];
    },

    createObjectLoaders: function () {
      this.removeObjectLoaders();
      for (var i = 0; i < this.data.data.length; ++i) {
        this.objectLoaders.push(this.createObjectLoader(this.data.data[i], i));
      }
    },

    createObjectLoader: function (data, index) {
      var options = $.extend({
        splitRequests: false,
        clusterize: data.type == 'Point',
        clusterBalloonContentLayout: "cluster#balloonCarousel",
        url: '/'+ this.map.zoneParams.module +'/'+ (this.data.namespace ? this.data.namespace +'/' : '')
          + this.data.code +'/objects/' + index + '?bbox=%b'
      }, data.options);
      Map.Layer.assignParamHandlers(data.params, options);
      var loader = new this.map.CustomLoadingObjectManager(options.url, options);
      loader.options.set('loading', 0);

      loader.events.add('dataloadbefore', function () {
        loader.options.set('loading', true);
        this.map.updateLoading();
      }.bind(this));

      loader.events.add('dataloadafter', function () {
        loader.options.set('loading', false);
        this.map.updateLoading();
      }.bind(this));

      if (options.clusterPreset) {
        loader.clusters.options.set('preset', options.clusterPreset);
      } else if (options.customCluster) {
        loader.clusters.options.set(options.customCluster);
      }
      if (options.geoObjectPreset) {
        loader.objects.options.set('preset', options.geoObjectPreset);
      } else if (options.customGeoObject) {
        loader.objects.options.set(options.customGeoObject);
      }
      Map.Layer.assignHandlers(loader, data);
      loader.setFilter(this.nav.filter.bind(this.nav));
      return loader;
    },

    enable: function () {
      this.createObjectLoaders();
      for (var i = 0; i < this.objectLoaders.length; ++i) {
        this.ymap.geoObjects.add(this.objectLoaders[i]);
      }
      this.active = true;
    },

    disable: function () {
      this.removeObjectLoaders();
      this.active = false;
    },

    isLoading: function () {
      for (var i = 0; i < this.objectLoaders.length; ++i) {
        if (this.objectLoaders[i].options.get('loading')) {
          return true;
        }
      }
      return false;
    },

    // FILTER

    filter: function (geoObject) {
      if (this.nav.filter(geoObject)) {
        return this.layerFilter ? this.layerFilter.filter(geoObject) : true;
      }
      return false;
    },

    execFilter: function () {
      //this.createObjectLoaders();
      if (this.active) {
        Helper.array.each(this.objectLoaders, 'reloadData');
        //this.enable();
      }
    },
  };
})();
