'use strict';

(function () {

  Map.FilterGroup = function (filter, data) {
    this.filter = filter;
    this.data = data;
    this.fields = [];
    this.init();
  };

  Map.FilterGroup.prototype = {
    constructor: Map.FilterGroup,

    init: function () {
      if (this.data.fields instanceof Array) {
        for (var i = 0; i < this.data.fields.length; ++i) {
          var constructor = Map.FilterField;
          switch (this.data.fields[i].type) {
            case 'select': constructor = Map.FilterSelectField; break;
          }          
          this.fields.push(new constructor(this, this.data.fields[i]));
        }
      }
    },

    build: function () {
      var result = '<div class="modal-form-group"><div class="modal-form-group-head"><h3>'
        + this.data.caption + '</h3></div><div class="modal-form-group-body">';
      for (var i = 0; i < this.fields.length; ++i) {
        result += this.fields[i].build();
      }
      return result +'</div>';
    }

  };
})();


