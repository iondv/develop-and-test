'use strict';

(function () {

  Map.Viewer.RightInfo = function (map) {
    Map.Viewer.call(this, map);
    this.$place = $('#map-info-panel');
    this.init();
  };

  $.extend(Map.Viewer.RightInfo.prototype, Map.Viewer.prototype, {
    constructor: Map.Viewer.RightInfo,

    init: function () {

    },

    hide: function (owner) {
      if (this.owner === owner) {
        imodal.forceClose();
      }
    },

    show: function () {

    },

    load: function (owner, url, data, cb) {
      this.owner = owner;
      imodal.off('beforeClose');
      imodal.load(url, data, cb);
    }
  });
})();
