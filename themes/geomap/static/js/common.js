'use strict';

$(function () {
  window.sidebarSplitter && sidebarSplitter.initMobile();
});

// HELPER

window.Helper = {

  common: {
    getRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    getUid: function () {
      return Helper.common.getRandom(1, 9999999).toString() + (new Date).getTime();
    },
  },

  array: {
    each: function (items, method) {
      for (var i = 0; i < items.length; ++i) {
        if (typeof method === 'function') {
          method(items[i], i, Array.prototype.slice.call(arguments, 2));
        } else {
          items[i][method].apply(items[i], Array.prototype.slice.call(arguments, 2));
        }
      }
    },
    isEqual: function (a1, a2) {
      if (a1.length !== a2.length) {
        return false;
      }
      for (var i = 0; i < a1.length; ++i) {
        if (a2.indexOf(a1[i]) < 0) {
          return false;
        }
      }
      return true;
    }
  },

  object: {
    getValues: function (obj) {
      var values = [];
      for (var id in obj) {
        if (obj.hasOwnProperty(id)) {
          values.push(obj[id]);
        }
      }
      return values;
    },
    getKeyByValue: function (obj, value) {
      for (var id in obj) {
        if (obj.hasOwnProperty(id) && obj[id] === value) {
          return id;
        }
      }
      return null;
    },
    each: function (obj, method) {
      Helper.array.each(Helper.object.getValues(obj), method);
    }
  }
};

// IMODAL

(function () {
  var EVENT_PREFIX = 'imodal:';
  var $overlay = $('#global-overlay');
  var $frame = $('#imodal-frame');
  var $side = $frame.parent();
  var $sideToggle = $side.find('.imodal-side-toggle');
  var $imodal = $('#imodal');
  var params = {};
  var imodalWindow = null;
  var toggleTimer = null;

  $sideToggle.click(function () {
    toggleSide();
  });

  $imodal.find('.imodal-close').click(function () {
    parent.imodal.close();
  });

  function setHistory () {
    imodalWindow.history.pushState(null, imodalWindow.document.title, imodalWindow.location.href + '#imodal');
    $(imodalWindow).off('popstate').on('popstate', function (event) {
      imodal.forceClose();
    });
  }

  function toggleSide (state) {
    $side.toggleClass('active', state);
    $(window).resize();
  }

  window.imodal = {

    getParams: function (key) {
      return key ? params[key] : params;
    },

    setParams: function (key, value) {
      params[key] = value;
    },

    getWindow: function () {
      return imodalWindow;
    },

    getEventId: function (name) {
      return EVENT_PREFIX + name;
    },

    init: function (params) {
      imodal.trigger('init', params);
    },

    load: function (url, data, cb) {
      cb = typeof data === 'function' ? data : cb;
      url = imodal.getDataUrl(data, url);
      toggleSide(true);
      $frame.removeClass('loaded').addClass('active');
      setTimeout(function () {
        $frame.detach().attr('src', url);
        $side.append($frame);
        $frame.off('load').load(function () {
          imodalWindow = $frame.addClass('loaded').get(0).contentWindow;
          setHistory();
          if (typeof cb === 'function') {
            cb(imodalWindow);
          }
        });
      }, 500);
    },

    close: function () {
      var event = imodal.createEvent('beforeClose');
      $frame.trigger(event);
      if (event.isPropagationStopped()) {
        return false;
      } else {
        imodalWindow.history.back();
        imodal.forceClose();
        return true;
      }
    },

    forceClose: function () {
      if (imodalWindow) {
        setTimeout(function () {
          $frame.trigger(imodal.getEventId('close'));
          $frame.off('load').removeClass('active loaded').detach().attr('src', $frame.data('blank'));
          toggleSide(false);
          $side.append($frame);
          imodalWindow = null;
          params = {};
        }, 0);
      }
    },

    createEvent: function (name) {
      return $.Event(imodal.getEventId(name));
    },

    on: function (name, handler) {
      $frame.on(imodal.getEventId(name), handler);
    },

    off: function (name, handler) {
      $frame.off(imodal.getEventId(name), handler);
    },

    getDataUrl: function (data, url) {
      data = typeof data !== 'object' ? {} : data;
      data = $.param(data);
      return data ? (url + (url.indexOf('?') > 0 ? '&' : '?') + data) : url;
    }
  };
})();

// ASIDE NAV

(function () {
  var $nav = $('#sideNav');
  $nav.find('.menu-link-data').click(function (event) {
    event.preventDefault();
  });
})();

// TOP MENU

$('#top-menu').each(function () {
  var $menu = $(this);
  var $items = $menu.children('.top-menu-item');
  var $more = $items.filter('.more-menu-item').hide();
  var $moreMenu = $more.children('.dropdown-menu');
  var $header = $('#header');
  var $siblings = $menu.nextAll();

  $items = $items.not($more);

  function align() {
    $more.show();
    $more.before($moreMenu.children());
    var maxWidth = getMaxMenuWidth();
    var moreWidth = $more.width();
    var sizes = getSizes(), total = 0, visible = 0;

    for (var i = 0; i < sizes.length; ++i) {
      if (total + sizes[i] > maxWidth) {
        if (total + moreWidth > maxWidth) {
          visible -= 1;
        }
        break;
      }
      total += sizes[i];
      visible += 1;
    }
    var $hidden = visible < 0 ? $items : $items.slice(visible);
    if ($hidden.length) {
      $moreMenu.append($hidden);
    } else {
      $more.hide();
    }
  }

  function getMaxMenuWidth() {
    var width = 10;
    $siblings.each(function () {
      width += $(this).outerWidth();
    });
    return $header.width() - $menu.offset().left - width;
  }

  function getSizes() {
    var sizes = [];
    $items.each(function () {
      sizes.push($(this).width());
    });
    return sizes;
  }

  $menu.show();
  align();

  $(window).on("resize", align);

  $menu.on('click', '.top-menu-section', function (event) {
    event.preventDefault();
    $items.filter('.active').removeClass('active');
    $(this).parent().addClass('active');
  });
});
