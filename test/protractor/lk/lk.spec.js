/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "Личный кабинет"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/lk/lk-profile');
    browser.wait(EC.urlIs(browser.params.serverURL + '/lk/lk-profile'));
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('profile-form'))), browser.params.waitElementLoad,
      'Не отображается объект profile-form');
  });
});
