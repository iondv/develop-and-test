'use strict';

ymaps.ready(function () {

  ymaps.modules.define('objectManager.component.ReloadOnZoomChangeControllerWithEvents', [
    'util.defineClass',
    'objectManager.component.ReloadOnZoomChangeController'
  ], function (provide, defineClass, ReloadOnZoomChangeController) {

    var ReloadOnZoomChangeControllerWithEvents = function (loadingObjectManager) {
      ReloadOnZoomChangeControllerWithEvents.superclass.constructor.call(this, loadingObjectManager);
    };
    defineClass(ReloadOnZoomChangeControllerWithEvents, ReloadOnZoomChangeController, {
      loadData: function (tilesArray) {
        this.events.fire('dataloadbefore');
        ReloadOnZoomChangeControllerWithEvents.superclass.loadData.call(this, tilesArray);
      },
      onDataLoad: function (tilesArray, data) {
        ReloadOnZoomChangeControllerWithEvents.superclass.onDataLoad.call(this, tilesArray, data);
        this.events.fire('dataloadafter');
      }
    });
    provide(ReloadOnZoomChangeControllerWithEvents);
  });

  ymaps.modules.define('CustomLoadingObjectManager', [
    'util.defineClass',
    'LoadingObjectManager',
    'objectManager.component.ReloadOnZoomChangeControllerWithEvents'
  ], function (provide, defineClass, LoadingObjectManager, ReloadOnZoomChangeControllerWithEvents) {
    var CustomLoadingObjectManager = function (urlTemplate, options) {
      CustomLoadingObjectManager.superclass.constructor.call(this, urlTemplate, options);
    };

    defineClass(CustomLoadingObjectManager, LoadingObjectManager, {
      _setupDataLoadController: function () {
        this._onDataLoadBefore();
        this._dataLoadController = new ReloadOnZoomChangeControllerWithEvents(this);
        this._dataLoadControllerListener = this._dataLoadController.events.group()
          .add('statechange', this._onDataLoadControllerStateChange, this)
          .add('pixelboundschange', this._onDataLoadControllerBoundsChange, this)
          .add('dataloadbefore', this._onDataLoadBefore, this)
          .add('dataloadafter', this._onDataLoadAfter, this);
      },
      _onDataLoadBefore: function () {
        this.events.fire('dataloadbefore');
      },
      _onDataLoadAfter: function () {
        this.events.fire('dataloadafter');
      }
    });
    provide(CustomLoadingObjectManager);
  });
});
