/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "gantt-chart"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/gantt-chart/');
    browser.wait(EC.urlContains(browser.params.serverURL + '/gantt-chart/'), browser.params.waitElementLoad,
      'Предоставленный УРЛ не совпадает с образцом ' + browser.params.serverURL + '/gantt-chart/');
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('page-header'))), browser.params.waitElementLoad,
      'Не отображается объект page-header');
    browser.wait(EC.visibilityOf(element(by.id('content'))), browser.params.waitElementLoad,
      'Не отображается объект content');
  });
});