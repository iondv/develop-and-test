/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 19.12.2017.
 */

describe('Проверка вкладки "Генератор токенов безопасности" модуля "ionadmin', function () {
  it('Открытие страницы', function () {
    browser.get(browser.params.serverURL + '/ionadmin/token');
    browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/token'), browser.params.waitElementLoad,
      'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/token');
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
      'Не отображается объект content');
    browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
      'Не отображается объект content');
  });
});