'use strict';

(function () {

  Map.StrokeFilter = function () {
    Map.BaseFilter.apply(this, arguments);
    this.$area = $('#map-stroke');
    this.$canvas = this.$area.find('canvas');
    this.createToggle();
    this.init();
  };

  $.extend(Map.StrokeFilter.prototype, Map.BaseFilter.prototype, {
    constructor: Map.StrokeFilter,

    getDefaultParams: function () {
      return {
        path: {
          strokeColor: '#f0000',
          strokeWidth: 6,
          opacity: 0.8
        },
        polygon: {
          fillColor: '#00f0ff',
          fillOpacity: 0.1,
          strokeColor: '#0000ff',
          strokeOpacity: 0.9,
          strokeWidth: 3
        }
      };
    },

    createToggle: function () {
      this.toggleBtn = new ymaps.control.Button({
        data: {
          content: 'Обводка',
          //title: 'Обвести регион'
        },
        options: {maxWidth: 100}
      });
      this.toggleBtn.events.add('select', this.enable, this);
      this.toggleBtn.events.add('deselect', this.disable, this);
      this.resetBtn = Map.BaseFilter.createResetBtn('Сбросить обводку');
      this.resetBtn.events.add('click', this.reset, this);
      this.ymap.controls.add(this.toggleBtn, { position: {left:640, top:10}});
      this.ymap.controls.add(this.resetBtn, { position: {left:722, top:10}});
    },

    init: function () {
      this.$canvas.attr('width', this.$area.width());
      this.$canvas.attr('height', this.$area.height());
      paper.setup(this.$canvas.get(0));
      var tool = new paper.Tool();
      tool.onMouseDown = function (event) {
        this.path ? this.stopDraw(event) : this.startDraw(event);
      }.bind(this);
      tool.onMouseDrag = this.draw.bind(this);
      $(window).mouseup(this.stopDraw.bind(this));
    },

    enable: function () {
      this.toggleBtn.state.set('selected', true);
      if (this.polygon) {
        this.active = true;
        this.ymap.geoObjects.add(this.polygon);
        this.ymap.setBounds(this.polygon.geometry.getBounds()).then(this.update.bind(this));
      } else {
        this.$area.show();
      }
    },

    disable: function () {
      this.toggleBtn.state.set('selected', false);
      if (this.active) {
        this.active = false;
        this.polygon && this.polygon.setParent(null);
        this.update();
      }
    },

    reset: function () {
      this.disable();
      this.polygon = null;
    },

    filter: function (geoObject) {
      if (this.active && this.polygon) {
        return this.polygon.geometry.contains(geoObject.geometry.coordinates);
      }
      return true;
    },

    // DRAW

    startDraw: function (event) {
      $(document.body).addClass('unselectable');
      this.path = new paper.Path($.extend({}, this.params.path, {
        strokeCap: 'round'
      }));
      this.path.add(event.point);
    },

    draw: function (event) {
      if (this.path && this.isDistancePoint(event.point)) {
        var cross = this.getCrossLocation(event.point);
        if (cross) {
          var path = this.path.splitAt(cross);
          this.path.remove();
          this.path = path;
          this.stopDraw();
        } else {
          this.path.add(event.point);
        }
      }
    },

    stopDraw: function () {
      $(document.body).removeClass('unselectable');
      if (this.path) {
        //this.path.closed = true;
        //console.log(this.path.segments.length);
        //this.path.simplify();
        //console.log(this.path.segments.length);
        this.createPolygon();
        this.path.remove();
        this.path = null;
        this.$area.hide();
        this.polygon ? this.enable() : this.disable();
      }
    },

    isDistancePoint: function (point) {
      var last = this.path.lastSegment.point;
      return Math.abs(point.x - last.x) > 8 || Math.abs(point.y - last.y) > 8;
    },

    getCrossLocation: function (point) {
      if (this.path.segments.length > 2) {
        this.path.add(point);
        var locations = this.path.getCrossings();
        if (locations && locations.length) {
          this.path.removeSegments(this.path.segments.length - 1);
          return locations[0];
        }
      }
      return null;
    },

    createPolygon: function () {
      this.polygon = null;
      if (this.path && this.path.segments.length > 2) {
        var offset = this.$area.offset();
        var projection = this.ymap.options.get('projection');
        var points = [];
        for (var i = 0; i < this.path.segments.length; ++i) {
          var point = [
            this.path.segments[i].point.x + offset.left,
            this.path.segments[i].point.y + offset.top
          ];
          point = projection.fromGlobalPixels(this.ymap.converter.pageToGlobal(point), this.ymap.getZoom());
          points.push(point);
        }
        this.polygon = new ymaps.Polygon([points], {}, $.extend({}, this.params.polygon, {
          interactivityModel: 'default#transparent'
        }));
        console.log('StrokeFilter: Num points:', points.length);
      }
    }
  });
})();
