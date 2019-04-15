/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "ionadmin', function () {
  it('Открытие главной страницы модуля', function () {
    browser.get(browser.params.serverURL + '/ionadmin/');
    browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/'), browser.params.waitElementLoad);
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('gridster'))), browser.params.waitElementLoad,
      'Не отображается объект gridster');
  });
});