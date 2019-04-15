/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.11.2017.
 */

describe('Проверка наличия модуля "report', function () {
  it('Открытие страницы модуля', function () {
    browser.get(browser.params.serverURL + '/report');
    browser.wait(EC.urlContains(browser.params.serverURL + '/report'));
  });
  it('Проверка наличия простейшего объекта', function () {
    Promise.all([element(by.className('bi-sheets')).isPresent(), element(by.className('bi-sheets-loader')).isPresent()])
      .then((res) => {
        expect(res[0] || res[1]).to.equal(true,
          'Не отображается объект загрузки или объект исходных данных');
      })
      .catch((err) => {
        throw err;
      });
  });
});
