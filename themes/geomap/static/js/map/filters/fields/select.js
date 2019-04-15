'use strict';

(function () {

  Map.FilterSelectField = function (group, data) {
    Map.FilterField.apply(this, arguments);
  };

  $.extend(Map.FilterSelectField.prototype, Map.FilterField.prototype, {
    constructor: Map.FilterSelectField,

    getInputValue: function ($elem) {
      if (this.data.multiple) {
        var value = $elem.val();
        if (value instanceof Array) {
          value = value.filter(function (val) {
            return val !== '';
          });
          return value.length ? value : null;
        }
        return value;
      }
      return  Map.FilterField.prototype.getInputValue.call(this, $elem);
    },

    build: function () {
      var result = '<select class="form-control form-select2 field-value" ';
      if (this.data.multiple) {
        result += 'multiple data-uid="'+ this.uid +'">';
      } else {
        result += 'data-uid="' + this.uid + '"><option value=""></option>';
      }
      for (var i = 0; i < this.data.values.length; ++i) {
        result += '<option value="'+ this.data.values[i].value +'">'+ this.data.values[i].label +'</option>';
      }
      result += '</select>';
      return Map.FilterField.prototype.build.call(this, result);
    }

  });
})();


