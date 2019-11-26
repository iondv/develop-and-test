/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 19.12.2017.
 */

describe('Проверка вкладки "Профилирование" модуля "ionadmin', function () {
  describe('Проверка страницы "Медленные запросы к базе данных"', function () {
    it('Открытие страницы', function () {
      browser.get(browser.params.serverURL + '/ionadmin/profiling/slow-query');
      browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/profiling/slow-query'), browser.params.waitElementLoad,
        'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/profiling/slow-query');
    });
    it('Проверка наличия простейшего объекта', function () {
      browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
        'Не отображается объект content');
      browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
        'Не отображается объект content');
    });
  });
});