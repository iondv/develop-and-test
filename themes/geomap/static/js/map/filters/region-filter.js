'use strict';

(function () {

  Map.RegionFilter = function () {
    Map.BaseFilter.apply(this, arguments);
    this.collection = new ymaps.GeoObjectCollection();
    //this.addCollectionEvent('click', 'click');
    this.addCollectionEvent('dblclick', 'dblclick');
    this.createToggle();
    this.init();
  };

  $.extend(Map.RegionFilter.prototype, Map.BaseFilter.prototype, {
    constructor: Map.RegionFilter,

    getDefaultParams: function () {
      return {
        enabled: false,
        url: '/geomap/api/regions',
        osmIds: [],
        activeOsmId: null,
        fillColor: '#AFE2',
        strokeColors: ['#000','#F0F','#00F','#0FF']
      };
    },

    createToggle: function () {
      this.toggleBtn = new ymaps.control.Button({
        data: {
          content: 'Регионы',
          title: 'Фильтр регионов'
        },
        options: {maxWidth: 100}
      });
      this.toggleBtn.events.add('select', this.enable, this);
      this.toggleBtn.events.add('deselect', this.disable, this);
      this.resetBtn = Map.BaseFilter.createResetBtn('Сбросить регионы');
      this.resetBtn.events.add('click', this.reset, this);
    },

    init: function () {
      if (this.params.osmIds) {
        $.get(this.params.url, {
          id: this.params.osmIds
        }).done(function (data) {
          this.parseData(data);
          this.ymap.controls.add(this.toggleBtn, { position: {left:10, top:10}});
          this.ymap.controls.add(this.resetBtn, { position: {left:90, top:10}});
          if (this.params.enabled) {
            if (this.regions[this.params.activeOsmId]) {
              this.show();
              this.setActiveRegion(this.regions[this.params.activeOsmId]);
            } else {
              this.enable();
            }
          }
        }.bind(this));
      }
    },

    parseData: function (data) {
      this.data = data;
      this.collection.removeAll();
      this.maxRegionLevel = data.metaData.levels[data.metaData.levels.length - 1] + 1,
      this.regions = Map.Region.createRegions(this, data, this.params);
      this.regionList = Helper.object.getValues(this.regions);
    },

    show: function () {
      this.active = true;
      this.toggleBtn.state.set('selected', true);
      this.ymap.geoObjects.add(this.collection);
    },

    enable: function (notBound) {
      this.show();
      this.setBounds().then(this.update.bind(this));
    },

    disable: function () {
      this.active = false;
      this.toggleBtn.state.set('selected', false);
      this.collection.setParent(null);
      this.update();
    },

    reset: function () {
      this.disable();
      this.collection.removeAll();
      Helper.array.each(this.regionList, function (region) {
        this.collection.add(region.geoObject);
      }.bind(this));
      this.activeRegion = null;
    },

    filter: function (geoObject) {
      if (this.active && this.activeRegion) {
        return this.activeRegion.geoObject.geometry.contains(geoObject.geometry.coordinates);
      }
      return true;
    },

    // REGIONS

    setActiveRegion: function (region) {
      this.activeRegion = this.activeRegion === region ? region.getParent() || region : region;
      this.collection.removeAll();
      this.addRegionToCollection(this.activeRegion);
      this.setBounds().then(this.update.bind(this));
    },

    // COLLECTION

    setBounds: function () {
      return this.ymap.setBounds(this.collection.getBounds(), {duration: 300});
    },

    addRegionToCollection: function (region) {
      this.collection.add(region.geoObject);
      var items = region.getChildren();
      for (var i = 0; i < items.length; ++i) {
        this.collection.add(items[i].geoObject);
      }
    },

    addCollectionEvent: function (eventName, handler) {
      this.collection.events.add(eventName, function (event) {
        var target = event.get('target');
        var id = target.properties.get('osmId');
        if (typeof handler === 'function') {
          handler(this.regions[id], eventName, event);
        } else {
          this.regions[id][handler](event);
        }
      }.bind(this));
    },

    removeCollectionEvent: function (event) {
      this.collection.events.remove(event);
    }

  });
})();
