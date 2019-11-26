'use strict';

(function () {

  Map.FilterField = function (group, data) {
    this.group = group;
    this.data = data;
    this.targetProp = data.targetProp.split('.');
    this.uid = Helper.common.getUid();
    this.value = null;
  };

  Map.FilterField.prototype = {
    constructor: Map.FilterField,

    build (content) {
      return '<div class="modal-form-field"><label>'+ this.data.caption +'</label>'+ content +'</div>';
    },

    getInputValue: function ($elem) {
      var value = $elem.val().trim();
      return value === '' ? null : value;
    },

    filter: function (item) {
      if (this.value === null || item.className !== this.data.filteredClass) {
        return true;
      }
      var value = this.getTargetValue(item);
      if (value instanceof Array) {
        if (this.value instanceof Array) {
          for (var i = 0; i < this.value.length; ++i) {
            if (value.indexOf(this.value[i]) > -1) {
              return true;
            }
          }
        } else if (value.indexOf(this.value) > -1) {
          return true;
        }
      } else if (this.value instanceof Array) {
        if (this.value.indexOf(value) > -1) {
          return true;
        }
      } else if (value == this.value) {
        return true;
      }
      return false;
    },

    getTargetValue: function (item) {
      var value = item;
      for (var i = 0; i < this.targetProp.length; ++i) {
        if (value instanceof Array) {
          var result = [];
          for (var j = 0; j < value.length; ++j) {
            var val = value[j][this.targetProp[i]];
            if (val instanceof Array) {
              result = result.concat(val);
            } else if (val !== undefined && val !== null) {
              result.push(val);
            }
          }
          value = result;
        } else {
          value = value[this.targetProp[i]];
          if (value === undefined || value === null) {
            return false;
          }
        }
      }
      return value;
    }
  };
})();


