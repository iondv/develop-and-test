'use strict';

(function () {

  Map.Nav = function (map, url, params) {
    this.map = map;
    this.url = url;
    this.params = params || {};
    this.active = true;
    this.layers = [];
    this.viewers = [];
    this.navFilter = null;
    this.init();
  };

  Map.Nav.prototype = {
    constructor: Map.Nav,

    init: function () {
      if (this.params.hasFilter) {
        this.loadNavFilter();
      }
      $.getJSON(this.url, {}, function (layers) {
        for (var i = 0; i < layers.length; ++i) {
          this.layers.push(new Map.Layer(this, layers[i]));
        }
        if (this.active) {
          Helper.array.each(this.layers, 'enable');
          this.map.legend && this.map.legend.render();
        }
      }.bind(this));
      this.executeViewers(this.showViewer);
    },

    enable: function () {
      Helper.array.each(this.layers, 'enable');
      this.active = true;
      this.attachFilter();
      this.execFilter();
      this.map.updateLoading();
      this.executeViewers(this.showViewer);
    },

    disable: function () {
      Helper.array.each(this.layers, 'disable');
      this.active = false;
      this.detachFilter();
      this.map.updateLoading();
      this.executeViewers(this.hideViewer);
    },

    isLoading: function () {
      if (this.active) {
        for (var i = 0; i < this.layers.length; ++i) {
          if (this.layers[i].isLoading()) {
            return true;
          }
        }
      }
      return false;
    },

    // FILTER

    loadNavFilter: function () {
      $.get('geomap/api/filter', {
        ns: this.params.ns,
        code: this.params.code
      }).done(function (data) {
        this.navFilter = new Map.NavFilter(this, data);
        this.attachFilter();
      }.bind(this));
    },

    filter: function (geoObject) {
      if (this.map.filter(geoObject)) {
        return this.navFilter ? this.navFilter.filter(geoObject) : true;
      }
      return false;
    },

    execFilter: function () {
      if (this.active) {
        Helper.array.each(this.layers, 'execFilter');
      }
    },

    attachFilter: function () {
      if (this.navFilter && this.active &&  this.map.filterForm) {
        this.map.filterForm.attach(this.navFilter);
      }
    },

    detachFilter: function () {
      if (this.navFilter && this.map.filterForm) {
        this.map.filterForm.detach(this.navFilter);
        this.navFilter.reset();
      }
    },

    // VIEWERS

    executeViewers: function (handler) {
      var params = this.params.viewer;
      if (params) {
        params = params instanceof Array ? params : [params];
        for (var i = 0; i < params.length; ++i) {
          if (this.map.viewers[params[i].id]) {
            handler.call(this, this.map.viewers[params[i].id], params[i]);
          } else {
            console.error('Not found nav viewer:', params[i].id);
          }
        }
      }
    },

    hideViewer: function (viewer, params) {
      viewer.hide(this);
    },

    showViewer: function (viewer, params) {
      switch (params.type) {
        default: this.showUrlViewer(viewer, params);
      }
    },

    showUrlViewer: function (viewer, params) {
      viewer.load(this, params.url);
    }
  };
})();
