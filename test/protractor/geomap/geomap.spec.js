/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "geomap"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/geomap/');
    browser.wait(EC.urlIs(browser.params.serverURL + '/geomap/'), browser.params.waitElementLoad);
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('ymap'))), browser.params.waitElementLoad,
      'Не отображается объект ymap');
  });
});