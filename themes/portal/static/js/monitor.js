'use strict';

(function () {
  var $selectorContainer = $head.find('.selector-container').show();
  var $selectors = $selectorContainer.find('.selector').hide();
  var $logoSelector = $selectors.filter('.logo-selector').show(); 
  $(document.body).on('click', '.logo-selector .selector-menu-item', function () {
    var $item = $(this);
    activePlace = $item.data('id');
    $monitor.removeClass('sakh kms').addClass(activePlace);
    $activePlace = $places.hide().filter('[data-id="'+ activePlace +'"]').show();
    $activePlace.children().hide().filter('.view-menu').show();
    $viewSelector = $viewSelectors.hide().filter('[data-place="'+ activePlace +'"]');
    $objectSelector.hide();
    SelectorHelper.setEmptyTitle($viewSelector);
    SelectorHelper.toggleEmpty($viewSelector);
    pushHistory(activePlace);
   // $viewSelector.find('.selector-menu-item').eq(0).click();
  });
})();
