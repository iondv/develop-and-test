'use strict';

(function () {

  Map.NavFilter = function (nav, data) {
    Map.BaseFilter.call(this, nav.map);
    this.nav = nav;
    this.data = data;
    this.uid = Helper.common.getUid();
    this.active = false;
    this.groups = [];
    this.fields = [];
    this.init();
  };

  $.extend(Map.NavFilter.prototype, Map.BaseFilter.prototype, {
    constructor: Map.NavFilter,

    init: function () {
      if (this.data instanceof Array) {
        for (var i = 0; i < this.data.length; ++i) {
          var group = new Map.FilterGroup(this, this.data[i]);
          this.groups.push(group);
          this.fields = this.fields.concat(group.fields);
        }
      }
    },

    filter: function (geoObject) {
      if (this.active) {
        for (var i = 0; i < this.fields.length; ++i) {
          if (!this.fields[i].filter(geoObject.properties.item)) {
            return false;
          }
        }
      }
      return true;
    },

    reset: function () {
      for (var i = 0; i < this.fields.length; ++i) {
        this.fields[i].value = null;
      }
      this.active = false;
    },

    getFieldByUid: function (uid) {
      for (var i = 0; i < this.fields.length; ++i) {
        if (this.fields[i].uid === uid) {
          return this.fields[i];
        }
      }
      return null;
    }

  });
})();


