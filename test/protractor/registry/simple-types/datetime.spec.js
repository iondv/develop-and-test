/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
let moment = require('moment');
const createdElement = (function () {
        moment.locale('us');
        var hours = (Math.floor(Math.random() * 23) + 100).toString().slice(1);
        var minutes = (Math.floor(Math.random() * 59) + 100).toString().slice(1);
        return moment((Math.floor(Math.random() * 16 + 2000) * 10000 + Math.floor(Math.random() * 11 + 1) * 100 +
          Math.floor(Math.random() * 11 + 1)).toString(), 'YYYYMMDD').format('DD/MM/YYYY') +
        moment(hours + minutes, 'HHmm').format(' h:mm A');
      })();
const bombImodal = require('../../util/iterance').bombImodal;

describe('Проверка операций над типом 8 "Дата/Время"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_datetime');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_datetime'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_datetime_data_datatime');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      var id = 'a_develop-and-test_class_datetime_id';
      browser.wait(EC.presenceOf(element(by.id(id))), browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id(id)).getAttribute('value')).to.eventually.have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});
