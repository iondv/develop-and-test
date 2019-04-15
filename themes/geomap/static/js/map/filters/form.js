'use strict';

(function () {

  Map.FilterForm = function (map, $modal) {
    this.map = map;
    this.$modal = $modal;
    this.$body = $modal.find('.modal-body').empty();
    this.filters = [];
    this.init();
  };

  Map.FilterForm.prototype = {
    constructor: Map.FilterForm,

    init: function () {
      this.createTools();
      this.$modal.on('hide.bs.modal', function () {
        if (this.checkChanges()) {
          this.map.execFilter();
        }
        this.updateTools();
      }.bind(this));
      this.$body.on('click', '.modal-form-group-head', function () {
        $(this).closest('.modal-form-group').toggleClass('active');
      });
    },

    createTools: function () {
      this.filterBtn = new ymaps.control.Button({
        data: {
          content: 'Фильтр'
        },
        options: {
          selectOnClick: false,
          maxWidth: 100
        }
      });
      this.resetBtn = Map.BaseFilter.createResetBtn('Сбросить фильтр');
      this.filterBtn.events.add('click', this.show, this);
      this.resetBtn.events.add('click', this.reset, this);
      this.map.ymap.controls.add(this.filterBtn, { position: { left: 140, top: 10}});
      this.map.ymap.controls.add(this.resetBtn, { position: { left: 214, top: 10}});
    },

    updateTools: function () {
      this.filterBtn.state.set('selected', this.isActive());
    },

    show: function () {
      this.openActiveGroups();
      this.$modal.modal();
    },

    openActiveGroups: function () {
      var $groups = this.$body.find('.modal-form-group');
      if (!$groups.filter('.active').length) {
        $groups.eq(0).addClass('active');
      }
    },

    reset: function () {
      if (this.isActive()) {
        this.$body.empty();
        for (var i = 0; i < this.filters.length; ++i) {
          var filter = this.filters[i];
          filter.reset();
          this.appendHtml(this.buildFilter(filter), filter);
          this.updateTools();
        }
        this.map.execFilter();
      }
    },

    isActive: function () {
      for (var i = 0; i < this.filters.length; ++i) {
        if (this.filters[i].active) {
          return true;
        }
      }
      return false;
    },

    hasFilter: function (filter) {
      return this.filters.indexOf(filter) > -1;
    },

    attach: function (filter) {
      if (!this.hasFilter(filter)) {
        this.filters.push(filter);
        this.appendHtml(this.buildFilter(filter), filter);
      }
    },

    detach: function (filter) {
      var index = this.filters.indexOf(filter);
      if (index > -1) {
        this.$body.find('#'+ filter.uid).remove();
        this.filters.splice(index, 1);
        this.updateTools();
      }
    },

    appendHtml: function (html, filter) {
      this.$body.append(html);
      this.$body.find('#'+ filter.uid).find('.form-select2').select2({
        width: '100%',
        language: 'ru'
      });
    },

    //

    checkChanges: function () {
      var self = this;
      var changed = false;
      for (var i = 0; i < this.filters.length; ++i) {
        var filter = this.filters[i];
        filter.active = false;
        this.$body.find('#'+filter.uid).find('.field-value').each(function () {
          var $elem = $(this);
          var field = filter.getFieldByUid($elem.data('uid'));
          var value = field.getInputValue($elem);
          if (value instanceof Array && field.value instanceof Array) {
            if (!Helper.array.isEqual(value, field.value)) {
              changed = true;
            }
          } else if (field.value !== value) {
            changed = true;
          }
          if (value !== null) {
            filter.active = true;
          }
          field.value = value;
        });
      }
      return changed;
    },

    buildFilter: function (filter) {
      var result = '<div class="modal-form-filter" id="'+ filter.uid +'">';
      for (var i = 0; i < filter.groups.length; ++i) {
        result += filter.groups[i].build();
      }
      return result +'</div>';
    }

  };
})();
