/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 19.12.2017.
 */

describe('Проверка вкладки "Журнал изменений" модуля "ionadmin', function () {
  it('Открытие страницы', function () {
    browser.get(browser.params.serverURL + '/ionadmin/changelog');
    browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/changelog'), browser.params.waitElementLoad,
      'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/changelog');
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
      'Не отображается объект content');
    browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
      'Не отображается объект content');
  });
});