/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "graph"', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/graph/rome_empire');
    browser.wait(EC.urlIs(browser.params.serverURL + '/graph/rome_empire'), browser.params.waitElementLoad);
  });
  it('Проверка наличия простейшего объекта', function () {
    browser.wait(EC.visibilityOf(element(by.id('graph'))),
      browser.params.waitElementLoad,
      'Не отображается объект редактирования профиля');
  });
});