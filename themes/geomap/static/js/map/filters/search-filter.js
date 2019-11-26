'use strict';

(function () {

  Map.SearchFilter = function () {
    Map.BaseFilter.apply(this, arguments);
    this.$filter = this.map.$zone.find('.map-search-filter');
    this.$execute = this.$filter.find('.map-search-filter-execute');
    this.$reset = this.$filter.find('.map-search-filter-reset');
    this.$value = this.$filter.find('.map-search-filter-value');
    this.$list = this.$filter.find('.map-search-filter-list');
    this.xhr = null;
    this.items = [];
    this.$execute.click(this.execute.bind(this));
    this.$reset.click(this.reset.bind(this));
    if (this.params.enabled) {
      this.init();
    }
  };

  $.extend(Map.SearchFilter.prototype, Map.BaseFilter.prototype, {
    constructor: Map.SearchFilter,

    init: function () {
      this.$filter.show();
      $(document.body).mousedown(function (event) {
        if (!$(event.target).closest('.map-search-filter').length) {
          this.close();
        }
      }.bind(this));
      this.$value.focus(function () {
        if (!this.$filter.hasClass('empty')) {
          this.$filter.addClass('opened');
        }
      }.bind(this));
      this.$value.keypress(function (event) {
        if (event.which === 13) {
          this.execute();
        }
      }.bind(this));
      this.$list.on('click', '.map-search-filter-item', function (event) {
        var $item = $(event.target);
        var item = this.items[$item.data('index')];
        this.$list.children('.active').removeClass('active');
        if (item) {
          this.selectItem(item);
          $item.addClass('active');
        }
      }.bind(this));
    },

    show: function () {
      this.$filter.addClass('opened');
    },

    close: function () {
      this.$filter.removeClass('opened');
    },

    empty: function () {
      this.$filter.addClass('empty');
      this.$list.empty();
      this.items = [];
      this.$filter.removeClass('active');
    },

    reset: function () {
      this.$value.val('');
      if (this.xhr) {
        this.xhr.abort();
        this.xhr = null;
      }
      this.empty();
      this.close();
      this.update();
    },

    execute: function () {
      var navs = this.map.getActiveNavs();
      var codes = navs.map(function (nav) {
        return nav.params.code +'@'+ nav.params.ns;
      });
      var value = this.$value.val().trim().toLowerCase();
      if (value.length) {
        if (this.xhr) {
          this.xhr.abort();
        }
        this.empty();
        this.show();
        this.$filter.addClass('loading');
        this.xhr = $.get('geomap/api/search', {value, codes}).always(function () {
          this.$filter.removeClass('loading');
        }.bind(this)).done(function (data) {
          this.items = data;
          var items = this.createItems(data);
          if (items.length) {
            this.$filter.removeClass('empty');
            this.$list.html(items.join('')).scrollTop(0);
            this.close();
            this.$filter.addClass('active');
            this.setBounds(this.items);
          }
        }.bind(this));
        this.$execute.focus();
        this.update();
      }
    },

    createItems: function (data) {
      var items = [];
      data = data instanceof Array ? data : [];
      for (var i = 0; i < data.length; ++i) {
        items.push('<div class="map-search-filter-item" data-index="'+ i +'">'+ data[i].label +'</div>');
      }
      return items;
    },

    selectItem: function (item) {
      this.setBounds(item);
      this.close();
    },

    setBounds: function (items) {
      items = items instanceof Array ? items : items ? [items] : null;
      if (items && items.length) {
        var collection = new ymaps.GeoObjectCollection;
        Helper.array.each(items, function (item) {
          collection.add(new ymaps.GeoObject(item));
        });
        this.ymap.geoObjects.add(collection);
        this.ymap.setBounds(collection.getBounds(), {
          checkZoomRange: true,
          duration: 100
        }).then(function () {
          var zoom = this.ymap.getZoom();
          if (zoom > 13) {
            zoom = 13;
          }
          this.ymap.setZoom(zoom);
        }.bind(this));
        collection.setParent(null);
      }
    },

    filter: function (geoObject) {
      if (this.items.length) {
        for (let item of this.items) {
          if (item.id === geoObject.properties.itemId) {
            return true;
          }
        }
        return false;
      }
      return true;
    }
  });
})();


