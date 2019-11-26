/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 19.12.2017.
 */

describe('Проверка вкладки "Безопастность" модуля "ionadmin', function () {
  describe('Проверка страницы "Пользователи"', function () {
    it('Открытие страницы', function () {
      browser.get(browser.params.serverURL + '/ionadmin/security/user');
      browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/security/user'), browser.params.waitElementLoad,
        'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/security/user');
    });
    it('Проверка наличия простейшего объекта', function () {
      browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
        'Не отображается объект content');
      browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
        'Не отображается объект content');
    }); 
  });

  describe('Проверка страницы "Роли пользователей"', function () {
    it('Открытие страницы', function () {
      browser.get(browser.params.serverURL + '/ionadmin/security/role');
      browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/security/role'), browser.params.waitElementLoad,
        'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/security/role');
    });
    it('Проверка наличия простейшего объекта', function () {
      browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
        'Не отображается объект content');
      browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
        'Не отображается объект content');
    });
  });

  describe('Проверка страницы "Ресурсы"', function () {
    it('Открытие страницы', function () {
      browser.get(browser.params.serverURL + '/ionadmin/security/resource');
      browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/security/resource'), browser.params.waitElementLoad,
        'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/security/resource');
    });
    it('Проверка наличия простейшего объекта', function () {
      browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
        'Не отображается объект content');
      browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
        'Не отображается объект content');
    });
  });

  describe('Проверка страницы "Синхронизация"', function () {
    it('Открытие страницы модуля', function () {
      browser.get(browser.params.serverURL + '/ionadmin/security/sync');
      browser.wait(EC.urlIs(browser.params.serverURL + '/ionadmin/security/sync'), browser.params.waitElementLoad,
        'Открытая страница не совпадает с требуемой ' + browser.params.serverURL + '/ionadmin/security/sync');
    });
    it('Проверка наличия простейшего объекта', function () {
      browser.wait(EC.visibilityOf(element(by.className('content-header'))), browser.params.waitElementLoad,
        'Не отображается объект content');
      browser.wait(EC.visibilityOf(element(by.className('content'))), browser.params.waitElementLoad,
        'Не отображается объект content');
    });
  });
});