'use strict';

(function () {

  Map.Layer.assignParamHandlers = function (params, options) {
    params = $.extend({
      // default params
    }, params);
    for (var id in params) {
      if (params.hasOwnProperty(id) && id in HANDLERS) {
        HANDLERS[id](params[id], options, params);
      }
    }
  };

  var HANDLERS = {
    balloonContentLayoutClass: function (params, options) {
      options.geoObjectBalloonContentLayout = ymaps.templateLayoutFactory.createClass(params);
    }
  };
})();

(function () {

  Map.Layer.assignHandlers = function (objectLoader, data) {
    var handlers = $.extend({
      // defaults
    }, data.handlers);
    for (var id in handlers) {
      if (handlers.hasOwnProperty(id) && id in HANDLERS) {
        HANDLERS[id](objectLoader, handlers[id], data);
      }
    }
  };

  var HANDLERS = {
    showBalloonOnHover: function (objectLoader, params) {
      if (params) {
        var delay = params.delay || 300;
        var balloon = objectLoader.objects.balloon;
        var timer = null;
        objectLoader.objects.events.add('mouseenter', function (e) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            balloon.open(e.get('objectId'));
          }, delay);
        });
        objectLoader.objects.events.add('mouseleave', function (e) {
          clearTimeout(timer);
        });
        balloon.events.add('mouseenter', function (e) {
          clearTimeout(timer);
        });
        balloon.events.add('mouseleave', function (e) {
          timer = setTimeout(function () {
            balloon.close();
          }, delay);
        });
      }
    }
  };  
})();
