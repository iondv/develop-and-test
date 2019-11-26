/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 24.01.2018.
 */
/* globals browser, expect, protractor, element, by */
const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
let firstCollection = ['Австрийская империя', 'Арагон', 'Кастилия', 'Неаполь'];
let secondCollection = ['Испанская империя', 'Венгрия', 'Австрия', 'Богемия'];
let firstId = [];
let secondId = [];

describe('Проверка коллецкии с обратными ссылками', function (){
  describe('Создание объектов класса 1', function () {
    it('Переход на страницу класса 1 (Австрийская империя испанские субъекты)', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.backcoll.collBackcollColl');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classColl.backcoll.collBackcollColl'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(browser.getTitle()).to.eventually.equal(browser.params.title.startPage,
        'Заголовок страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Коллекция с обратной коллекцией: Класс ' +
        'коллекции с обратной коллекцией', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
      expect(element.all(by.css('#content div.dataTables_scrollBody tr')).count()).to.eventually.not.equal(0,
        'Список объектов пуст');
    });
    for(let i = 0; i< firstCollection.length; i++) {
      it('Создание объекта ' + firstCollection[i], async function () {
        var idid = 'a_develop-and-test_coll_backcoll_coll_id';
        await you.pressCreate();
        await you.enterTextInField(firstCollection[i], 'a_develop-and-test_coll_backcoll_coll_backcoll_data');
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
  describe('Создание и проверка связей объектов класса 2', function () {
    let table = element(by.id('DataTables_Table_0_wrapper'));
    it('Переход на страницу класса 2 (Испанская империя австрийские субъекты)', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.backcoll.collBackcollBackcoll');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classColl.backcoll.collBackcollBackcoll'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    it('Создание объекта ' + secondCollection[0], async function () {
      var idid = 'a_develop-and-test_coll_backcoll_backcoll_id';
      await you.pressCreate();
      await you.enterTextInField(secondCollection[0], 'a_develop-and-test_coll_backcoll_backcoll_coll_data');
      await you.pressModalSave();
      await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
        'Не получается загрузить id');
      let id = await element(by.id(idid)).getAttribute('value');
      expect(id.length).to.be.above(0, 'Id не появился');
      secondId.push(id);
    });
    it('Добавление связей', async function () {
      for(let j = 1; j< firstId.length; j++) {
        await you.tableAdd(0);
        await you.filter(firstId[j], 0);
        await you.pressModalSelect(0);
      }
    });
    it('Проверка наличия связей', async function(){
      let chsnDict = await table.element(by.tagName('tbody'))
        .all(by.tagName('tr')).getText();
      let objects = firstId.slice(1, 3);
      let objectsCheck = [];
      for(let i =0; i< objects.length; i++){
        objectsCheck.push(
          expect( chsnDict.filter((item)=>{
              return item.indexOf(objects[i]) !== -1
            })
          ).to.have.length.above(0, 'На найден объект ' + objects[i])
        );
      }
      return Promise.all(objectsCheck);
    });
    it('Сохранение результата и переход к следующему', async function(){
      await you.pressModalSave();
      await you.pressModalClose();
    });
    for(let i = 1; i< secondCollection.length; i++) {
      it('Создание объекта ' + secondCollection[i], async function () {
        var idid = 'a_develop-and-test_coll_backcoll_backcoll_id';
        await you.pressCreate();
        await you.enterTextInField(secondCollection[i], 'a_develop-and-test_coll_backcoll_backcoll_coll_data');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
          'Не получается загрузить id');
        let id = await element(by.id(idid)).getAttribute('value');
        expect(id.length).to.be.above(0, 'Id не появился');
        secondId.push(id);
      });
      it('Добавление связей', async function () {
        await you.tableAdd(0);
        await you.filter(firstId[0], 0);
        await you.pressModalSelect(0);
      });
      it('Проверка наличия связей', async function(){
        let chsnDict = await table.element(by.tagName('tbody'))
          .all(by.tagName('tr')).getText();
        await expect( chsnDict.filter((item)=>{
            return item.indexOf(firstId[0]) !== -1
          })
        ).to.have.length.above(0, 'На найден объект ' + firstCollection[0]);
      });
      it('Сохранение результата и переход к следующему', async function(){
        await you.pressModalSave();
        await you.pressModalClose();
      });
    }
  });
  describe('Проверка объектов класса 1', function () {
    let table = element(by.id('DataTables_Table_0_wrapper'));
    it('Переход на страницу класса 1 (Австрийская империя испанские субъекты)', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.backcoll.collBackcollColl');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classColl.backcoll.collBackcollColl'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    it('Открытие объекта ' + firstCollection[0], async function () {
      await you.filter(firstId[0], 0);
      await you.edit(0);
    });
    it('Проверка наличия связей', async function(){
      await browser.wait(EC.presenceOf(table), browser.params.waitElementLoad, 'Кнопка "Закрыть" не загружена');
      await browser.wait(EC.visibilityOf(table), browser.params.waitElementLoad, 'Кнопка "Закрыть" не отображается');
      let chsnDict = await table.element(by.tagName('tbody'))
        .all(by.tagName('tr')).getText();
      let objects = secondId.slice(1, 3);
      let objectsCheck = [];
      for(let i =0; i< objects.length; i++){
        objectsCheck.push(
          expect( chsnDict.filter((item)=>{
              return item.indexOf(objects[i]) !== -1
            })
          ).to.have.length.above(0, 'На найден объект ' + secondCollection[i + 1])
        );
      }
      return Promise.all(objectsCheck);
    });
    it('Переход к следующему', async function(){
      await you.pressModalClose();
      await browser.refresh();
    });
    for(let i = 1; i< firstCollection.length; i++) {
      it('Открытие объекта ' + firstCollection[i], async function () {
        let res = await you.filter(firstId[i], 0);
        expect(res.length).to.be.above(0, 'Объект ' + firstCollection[i] + ' не найден');
        await you.edit(0);
      });
      it('Проверка наличия связей', async function(){
        await browser.wait(EC.presenceOf(table), browser.params.waitElementLoad, 'Таблица со связями не загружена');
        await browser.wait(EC.visibilityOf(table), browser.params.waitElementLoad, 'Таблица со связями не отображается');
        let chsnDict = await table.element(by.tagName('tbody'))
          .all(by.tagName('tr')).getText();
        await expect( chsnDict.filter((item)=>{
            return item.indexOf(secondId[0]) !== -1
          })
        ).to.have.length.above(0, 'На найден объект ' + secondCollection[0]);
      });
      it('Переход к следующему', async function () {
        await you.pressModalClose();
        await browser.refresh();
      });
    }
  });
  describe('Удаление объектов класса 1', function () {
    for(let i = 0; i< firstCollection.length; i++) {
      it('Открытие объекта ' + firstCollection[i], async function () {
        let res = await you.filter(firstId[i], 0);
        expect(res.length).to.be.above(0, 'Объект ' + firstCollection[i] + ' не найден');
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
  });
  describe('Удаление объектов класса 2', function () {
    it('Переход на страницу класса 2 (Испанская империя австрийские субъекты)', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.backcoll.collBackcollBackcoll');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classColl.backcoll.collBackcollBackcoll'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    for(let i = 0; i< secondCollection.length; i++) {
      it('Открытие объекта ' + secondCollection[i], async function () {
        let res = await you.filter(secondId[i], 0);
        expect(res.length).to.be.above(0, 'Объект ' + secondCollection[i] + ' не найден');
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
  });
});

