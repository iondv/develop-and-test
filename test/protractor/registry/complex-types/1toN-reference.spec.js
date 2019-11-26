/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 03.03.2018.
 */
/* globals browser, expect, protractor, element, by */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'),
  require('../../util/iterance'));
let firstCollection = ['Санаторий "Изумрудный"'];
let secondCollection = ['Иванов', 'Петров', 'Сидоров'];
let firstId = [];
let secondId = [];

describe('Проверка поведения ссылки 1 к 1', function (){
  describe('Создание объектов класса 1', function () {
    it('Переход на страницу класса 1', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classRef.backcoll.refBackcollBackcoll');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classRef.backcoll.refBackcollBackcoll'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Обратная коллекция для ссылки: ' +
        'Класс обратной коллекции для ссылки', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < firstCollection.length; i++) {
      it('Создание объекта ' + firstCollection[i], async function () {
        var idid = 'a_develop-and-test_ref_backcoll_backcoll_id';
        await you.pressCreate();
        await you.enterTextInField(firstCollection[i], 'a_develop-and-test_ref_backcoll_backcoll_ref_data');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
          'Не получается загрузить id');
        let id = await element(by.id(idid)).getAttribute('value');
        expect(id.length).to.be.above(0, 'Id не появился');
        firstId.push(id);
        await you.pressModalClose();
      });
    }
  });
  describe('Создание объектов класса 2', function () {
    it('Переход на страницу класса 2', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classRef.backcoll.refBeckcollRef');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classRef.backcoll.refBeckcollRef'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Ссылка с обратной коллекцией: ' +
        'Класс ссылки с обратной коллекцией', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < secondCollection.length; i++) {
      it('Создание объекта ' + secondCollection[i], async function () {
        var idid = 'a_develop-and-test_ref_backcoll_ref_id';
        await you.pressCreate();
        await you.enterTextInField(secondCollection[i], 'a_develop-and-test_ref_backcoll_ref_backcoll_data');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
          'Не получается загрузить id');
        let id = await element(by.id(idid)).getAttribute('value');
        expect(id.length).to.be.above(0, 'Id не появился');
        secondId.push(id);
      });
      it('Привязываем элемент ' + firstCollection[i], async function () {
        await you.tableChoose();
        await you.filter(firstId[0], 0);
        await you.pressModalSelect(0);
        await you.pressModalSave();
        let refVal = element(by.id('a_develop-and-test_ref_backcoll_ref_ref_backcoll_ref'));
        await browser.wait(EC.presenceOf(refVal), browser.params.waitElementLoad, 'Поле со ссылкой не загрузилось');
        expect(refVal.getAttribute('value')).to.be.eventually.equal(firstId[0],
          'Элемент ' + firstCollection[0] + ' не привязался');
      });
      it('Переходим к следующему объекту', async function () {
        await you.pressModalClose();
      });
    }
  });
  describe('Проверка объектов класса 1', function () {
    let table = element(by.id('DataTables_Table_0_wrapper'));
    it('Переход на страницу класса 1', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classRef.backcoll.refBackcollBackcoll');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classRef.backcoll.refBackcollBackcoll'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Обратная коллекция для ссылки: ' +
        'Класс обратной коллекции для ссылки', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    it('Открытие объекта ' + firstCollection[0], async function () {
      await you.filter(firstId[0], 0);
      await you.edit(0);
    });
    it('Проверка наличия связей', async function () {
      let chsnDict = await table.element(by.tagName('tbody'))
        .all(by.tagName('tr')).getText();
      let objects = secondId.slice(1, 3);
      let objectsCheck = [];
      for (let i = 0; i < objects.length; i++) {
        objectsCheck.push(
          expect(chsnDict.filter((item)=> {
              return item.indexOf(objects[i]) !== -1
            })
          ).to.have.length.above(0, 'На найден объект ' + secondCollection[i + 1])
        );
      }
      return Promise.all(objectsCheck);
    });
    it('Закрытие объекта ' + firstCollection[0], async function () {
      await you.pressModalClose();
      await you.pressFilter(0);
    });
  });
  describe('Удаляем созданные объекты', function () {
    for (let i = 0; i < firstCollection.length; i++) {
      it('Удаление объекта ' + firstCollection[i], async function () {
        await you.filter(firstId[i], 0);
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
    it('Переход на страницу класса 2', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classRef.backcoll.refBeckcollRef');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classRef.backcoll.refBeckcollRef'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Ссылка с обратной коллекцией: ' +
        'Класс ссылки с обратной коллекцией', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < secondCollection.length; i++) {
      it('Удаление объекта ' + secondCollection[i], async function () {
        await you.filter(secondId[i], 0);
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
  });
});
