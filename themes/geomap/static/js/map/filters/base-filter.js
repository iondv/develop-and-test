'use strict';

(function () {

  Map.BaseFilter = function (map, params) {
    this.map = map;
    this.params = $.extend(true, this.getDefaultParams(), params);
    this.ymap = map.ymap;
    this.active = false;
  };

  Map.BaseFilter.createResetBtn = function (title) {
    return new ymaps.control.Button({
      data: {
        title: title,
        image: '/geomap/img/close.png'
      },
      options: {
        selectOnClick: false
      }
    });
  };

  Map.BaseFilter.prototype = {
    constructor: Map.BaseFilter,

    getDefaultParams: function () {
      return {};
    },

    filter: function (geoObject) {
      // this.active
      return true;
    },

    update: function () {
      this.map.execFilter();
    },

    destroy: function () {
    }

  };
})();
