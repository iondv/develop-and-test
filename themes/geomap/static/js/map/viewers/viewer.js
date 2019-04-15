'use strict';

(function () {

  Map.Viewer = function (map, params) {
    this.map = map;
    this.owner = null;
    this.params = params || {};    
  };

  Map.Viewer.prototype = {
    constructor: Map.Viewer,

    init: function () {

    },
  };
})();
