/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "dashboard"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/registry/dashboard');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/dashboard'), browser.params.waitElementLoad);
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('gridster'))), browser.params.waitElementLoad,
      'Не отображается объект gridster');
  });
});