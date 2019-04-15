'use strict';

(function () {

  window.Map = function (ymaps) {
    this.ymaps = ymaps;
    this.$map = $('#ymap');
    this.params = this.$map.data('params');
    this.$zone = this.$map.closest('.map-zone');
    this.zoneParams = this.$zone.data('params');
    this.$sideNav = $('#sideNav');
    this.$sideNav.find('.menu-link-data').click(this.clickNav.bind(this));
    this.$imodal = $('#imodal-frame');
    this.$map.on('click', '.map-modal-link', this.clickModalLink.bind(this));
    this.navs = {};
    this.loadingCount = -1;
    this.filters = {};
    this.init();
  };

  Map.prototype = {
    constructor: Map,

    init: function () {
      ymaps.modules.require(['CustomLoadingObjectManager'], function (CustomLoadingObjectManager) {
        this.CustomLoadingObjectManager = CustomLoadingObjectManager;
        this.ymap = new ymaps.Map(this.$map.get(0), {
          center: this.params.start,
          zoom: this.params.zoom,
          controls: [] // 'fullscreenControl'
        }, {
          suppressMapOpenBlock: true
        });
        this.ymap.controls.add('zoomControl', {position: {left: 10, top: 120}});
        this.ymap.controls.add('rulerControl');
        //this.ymap.controls.add('typeSelector', {float: 'right'});
        this.initDefaultNav();
        if (this.params.search) {
          this.filters.search = new Map.SearchFilter(this, this.params.search);
        }
        if (this.params.regions) {
          this.filters.region = new Map.RegionFilter(this, this.params.regions);
        }
        if (this.params.stroke) {
          this.filters.stroke = new Map.StrokeFilter(this, this.params.stroke);
        }
        this.filterForm = new Map.FilterForm(this, $('#map-filter-form'));
        this.legend = new Map.Legend(this);
      }.bind(this));

      var toggleTimer = null;
      $(window).resize(function (event, data) {
        var $side = $('#imodal-side');
        var active = $side.hasClass('active');
        var width = 0;
        if (active) {
          width = this.$zone.width() - $side.width();
          if (width < 200) {
            width = this.$zone.width();
          }
        }
        this.$map.css('width', active ? (width +'px') : '100%');
        clearTimeout(toggleTimer);
        toggleTimer = setTimeout(function () {
          this.ymap.container.fitToViewport();
        }.bind(this), active ? 350 : 10);
      }.bind(this));

      this.viewers = {
        rightInfo: new Map.Viewer.RightInfo(this)
      };
    },

    // LOADING MARKER

    updateLoading: function () {
      var loading = false;
      for (var id in this.navs) {
        if (this.navs.hasOwnProperty(id) && this.navs[id].isLoading()) {
          return this.toggleLoading(true);
        }
      }
      this.toggleLoading(false);
    },

    toggleLoading: function (state) {
      this.$zone.toggleClass('loading', state);
    },

    // FILTER

    filter: function (geoObject) {
      for (var id in this.filters) {
        if (this.filters.hasOwnProperty(id) && !this.filters[id].filter(geoObject)) {
          return false;
        }
      }
      return true;
    },

    execFilter: function () {
      Helper.object.each(this.navs, 'execFilter');
    },

    // NAV

    initDefaultNav: function () {
      var id = 'n_' + this.$sideNav.data('default');
      id = id.replace(/\./g, '_');
      var def = document.getElementById(id);
      if (def) {
        $(def).click().parents('.treeview').addClass('menu-open');
      } else {
        this.$sideNav.find('.treeview').eq(0).find('>a .toggler').click();
      }
    },

    getActiveNavs: function () {
      var navs = [];
      Helper.object.each(this.navs, function (nav) {
        if (nav.active) {
          navs.push(nav);
        }
      });
      return navs;
    },

    clickNav: function (event) {
      var $a = $(event.target);
      var url = $a.attr('href');
      if (url) {
        if (this.filters.search) {
          this.filters.search.reset();
        }
        if (event.ctrlKey) {
          $a.toggleClass('active');
        } else {
          this.$sideNav.find('.active').removeClass('active');
          this.hideNavs();
          $a.addClass('active');
        }
        if ($a.hasClass('active')) {
          if (this.navs[url]) {
            this.navs[url].enable();
          } else {
            this.navs[url] = new Map.Nav(this, url, $a.data('params'));
          }
        } else if (this.navs[url]) {
            this.navs[url].disable();
        }
        this.renderHeader();
        this.legend && this.legend.render();
      }
    },

    hideNavs: function () {
      for (var id in this.navs) {
        if (this.navs.hasOwnProperty(id)) {
          this.navs[id].disable();
        }
      }
    },

    renderHeader: function () {
      var title = [];
      this.$sideNav.find('.active').each(function () {
        title.push($(this).find('span').html());
      });
      $('#page-header').find('h1').html(title.length ? title.join(', ') : 'Гео-карта');
    },

    // MODAL LINK

    clickModalLink: function (event) {
      event.preventDefault();
      var $link = $(event.target);
      var type = $link.data('type') || 'url';
      if (type in this.modalLinkHandlers) {
        this.modalLinkHandlers[type]($link);
      }
    },

    modalLinkHandlers: {
      url: function ($link) {
        imodal.off('beforeClose');
        imodal.load($link.data('url') || $link.attr('href'));
      }
    }
  };
})();
