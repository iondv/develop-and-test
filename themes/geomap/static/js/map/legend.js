'use strict';

(function () {

  Map.Legend = function (map, params) {
    this.map = map;
    this.params = params || {};
    this.$legend = map.$zone.find('.map-legend');
    this.$title = this.$legend.find('.map-legend-title');
    this.$list = this.$legend.find('.map-legend-list');
    this.$toggle = this.$legend.find('.map-legend-toggle');
    this.init();
  };

  Map.Legend.prototype = {
    constructor: Map.Legend,

    init: function () {
      this.$list.empty();
      this.$toggle.click(function () {
        this.$legend.toggleClass('collapsed');
      }.bind(this));
      if (this.params.collapsed) {
        this.$toggle.click();
      }
      $(window).resize(this.render.bind(this));
      this.$legend.show();
    },

    getListWidth: function () {
      return this.$legend.width() - this.$toggle.outerWidth() - this.$title.outerWidth() - 22;
    },

    render: function () {
      var layers = [];
      for (var id in this.map.navs) {
        if (this.map.navs.hasOwnProperty(id) && this.map.navs[id].active) {
          layers = layers.concat(this.map.navs[id].layers);
        }
      }
      var maxWidth = this.getListWidth();
      this.$list.width(maxWidth);
      if (layers.length > 0) {
        maxWidth = parseInt(maxWidth / layers.length) - 40;
      }
      var result = [];
      for (var i = 0; i < layers.length; ++i) {
        result.push(this.createItem(layers[i], maxWidth));
      }
      this.$list.find('.map-legend-icon').tooltip('hide');
      this.$list.html(result.join(''));
      this.$list.find('.map-legend-icon').tooltip({
        container: 'body'
      });
    },

    createItem: function (layer, maxWidth) {
      var data = layer.data.data;
      if (data instanceof Array && data.length && data[0].options) {
        var title = layer.data.hint || layer.data.caption;
        var icon = this.createIcon(data[0].options, title);
        if (icon) {
          maxWidth = maxWidth < 0 ? 0 : maxWidth;
          return '<div class="map-legend-item">'+ icon
            +'<span class="map-legend-label" style="max-width:'+ maxWidth +'px">'+ title +'</span></div>';
        }
      }
      return '';
    },

    createIcon: function (options, title) {
      if (options.geoObjectIconImageHref) {
        return '<i title="'+ title +'" class="map-legend-icon image"><img src="'+ options.geoObjectIconImageHref +'"/></i>'
      }
      var color = this.getColorFromString(options.geoObjectPreset);
      var glyph = options.geoObjectIconGlyph || '';
      if (glyph) {
        return '<i title="'+ title +'" class="map-legend-icon glyph '+ color +'"><span class="glyphicon glyphicon-'+ glyph +'"></span></i>';
      }
      return '<i title="'+ title +'" class="map-legend-icon '+ color +'"></i>';
    },

    getColorFromString: function (str) {
      str = typeof str === 'string' ? str.toLowerCase() : '';
      var colors = ['darkblue', 'darkgreen', 'darkorange', 'blue', 'brown', 'green', 'red', 'pink', 'violet', 'yellow'];
      for (var i = 0; i < colors.length; ++i) {
        if (str.indexOf(colors[i]) > -1) {
          return colors[i];
        }
      }
      return 'default';
    }
  };
})();