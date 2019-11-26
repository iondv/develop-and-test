/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "portal"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/portal/strings');
    browser.wait(EC.urlIs(browser.params.serverURL + '/portal/strings'), browser.params.waitElementLoad);
  });
  it.skip('Проверка наличия простейшего объекта', function () { //TODO ошибка 500
    browser.wait(EC.visibilityOf(element(by.id('profile-form'))), browser.params.waitElementLoad,
      'Не отображается объект profile-form');
  });
});