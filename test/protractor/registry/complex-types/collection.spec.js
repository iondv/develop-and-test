/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 16.02.2018.
 */
const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'),
  require('../../util/iterance'));
let CREATED_ELEMENT_ID = '';

let edited = false;
let objects = ['Кант', 'Гегель', 'Платон'];
let objectsId = [];
let objectsNew = ['Чехов', 'Гегель', 'Платон'];

describe('Переход на страницу класса', function () {
  describe('Переход на страницу класса', function () {
    it('Открытие списка объектов класса', async function () {
      await browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl');
      await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      await expect(browser.getTitle()).to.eventually.equal(browser.params.title.startPage,
        'Заголовок страницы не соответствует искомой');
      await expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Режимы отображения типа Коллекция: ' +
        'Класс "Коллекция [14]"', 'Заголовок центрального блока страницы не соответствует странице списка объектов');
    });
  });
  describe('Шаг 1. Проверка создания объекта класса без атрибутов', function () {
    it('Создание пустого объекта и нажатие кнопки "Сохранить"', async function () {
      await you.pressCreate();
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', async function () {
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_classColl_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      CREATED_ELEMENT_ID = await element(by.id('a_develop-and-test_classColl_id')).getAttribute('value');
      console.log('ID созданного элемента ', CREATED_ELEMENT_ID);
      await expect(CREATED_ELEMENT_ID).to.have.length.above(0, 'ИД созданного элемента нулевой');
    });
  });
  describe('Шаг 2. Проверка представления "Таблица"', function(){
    describe('Шаг 2.1 Проверка создания объекта класса по ссылкам', function () {
      before(async ()=>{
        await expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
        await expect(CREATED_ELEMENT_ID).to.have.length.above(0, 'ИД созданного элемента нулевой');
        await you.leavePageUnclosed();
        await browser.get(browser.params.serverURL + '/registry/develop-and-test@catalog');
        await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@catalog'),
          browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      });
      for(let i =0; i< objects.length; i++){
        describe('Добавление объекта "' + objects[i] + '" в ', ()=>{
          it('Нажимаем кнопку "Создать"', async function(){
            await you.pressCreate();
          });
          it('Вводим значение и нажимаем сохранить', async function(){
            await you.enterTextInField(objects[i], 'a_develop-and-test_collRefCatalog_collRefCatalog');
            await you.pressModalSave();
          });
          it('Проверка появления id нового элемента', async function () {
            await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_collRefCatalog_id'))),
              browser.params.waitElementLoad, 'Не получается загрузить id');
            let id = await expect(element(by.id('a_develop-and-test_collRefCatalog_id')).getAttribute('value'))
              .to.eventually.have.length.above(0);
            objectsId.push(id);
            console.log(objects[i], ' ', objectsId[i]);
          });
          it('Закрыть фрейм', async function () {
            await you.pressModalClose();
          });
        });
      }

      describe('Проверка наличия в справочнике созданных обектов', ()=>{
        for(let i =0; i< objects.length; i++){
          it('Поиск объекта ' + objects[i], async function () {
            expect(await you.filter(objects[i], 1)).to.have.length.above(0, 'Не найдено объектов ' + objects[i]);
          });
          it('Сброс поиска', async ()=> {
            await you.pressFilter(1);
          })
        }
      });
      describe('Создаём представление "Таблица"', function() {
        it('Переход на страницу созданного объекта', async ()=> {
          await browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl');
          await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl'),
            browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
        });
        it('Открытие объекта', async ()=> {
          expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
          await you.edit(0, 0);
        });
      });
      describe('Выбор созданных объектов в справочнике', ()=>{
        beforeEach(async ()=>{
          await you.tableAdd(2);
        });
        for(let i =0; i< objects.length; i++){
          it('Выбор элемента ', async function(){
            console.log(objects[i]);
            await expect(await you.filter(objects[i], 1)).to.have.length.above(0, 'Не найдено объектов класса');
            await you.pressModalSelect(0);
          });
        }
      });

      describe('Проверка наличия в полях объектов выбранных из справочника значений', function () {
        it('Проверка наличия объектов', async function(){
          let tableObject = await you.workWithTable(2);
          await expect(tableObject.element(by.tagName('tbody')).all(by.className('dataTables_empty')).count()).to.be
            .eventually.equal(0, 'Нет элементов в выбранной таблице');
          let chsnDict = await tableObject.element(by.tagName('tbody'))
            .all(by.tagName('tr')).getText();
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
      });
      describe('Завершение создания', function () {
        it('Нажатие кнопки сохранения', async function () {
          await you.pressModalSave();
        });
        it('Закрытие объекта класса', async function () {
          await you.pressModalClose();
        });
        it('Поиск объекта класса', async function () {
          await you.pressFilter(0);
          expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
        });
      });
      after(async ()=>{
        await browser.refresh();
        await you.leavePageUnclosed();
      });
    });
    describe('Шаг 2.2 Проверка редактирования объекта класса', function () {
      before(async ()=>{
        expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
        expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
      });
      it('Открываем объект для редактирования', async function () {
        await you.edit(0);
        await you.edit(0, 2);
      });
      it('Вводим значение и нажимаем сохранить', async function(){
        await you.enterTextInField('Чехов', 'a_develop-and-test_collRefCatalog_collRefCatalog');
        await you.pressModalSave();
        edited = true;
      });
      it('Проверка появления id нового элемента', function () {
        var id = 'a_develop-and-test_collRefCatalog_id';
        browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_collRefCatalog_id'))),
          browser.params.waitElementLoad, 'Не получается загрузить id');
        expect(element(by.id('a_develop-and-test_collRefCatalog_id')).getAttribute('value'))
          .to.eventually.have.length.above(0);
      });
      it('Закрыть фрейм', async function () {
        await you.pressModalClose();
      });
      it('Нажатие кнопки сохранения объекта', async function () {
        await you.pressModalSave();
      });
      it('Проверка наличия в полях объекта отредактированного в справочнике значения', async function () {
        let tableObject = await you.workWithTable(2);
        await browser.wait(EC.visibilityOf(tableObject), browser.params.waitElementLoad,
          'Таблица с ссылочными атрибутами не отображается');
        let tableText = await tableObject.element(by.tagName('tbody')).all(by.tagName('tr')).getText();
        let filtered = await tableText.filter((item)=>{
          return (item.indexOf('Чехов') !== -1)
        });
        await expect(filtered.length > 0).to.be.equal(true, 'Не найден созданный элемент ' + 'Чехов среди атрибутов ' +
          tableText);
      });
      it('Закрытие объекта класса', async function () {
        await you.pressModalClose();
      });
      it('Поиск объекта класса', async function () {
        await you.pressFilter(0);
        expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
      });
      after(async ()=>{
        await browser.refresh();
        await you.leavePageUnclosed();
      });
    });
    describe('Шаг 2.3 Проверка отвязки объекта класса от ссылок из справочника', function () {
      before(async ()=>{
        expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
        expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
      });
      it('Нажатие кнопки изменения объекта', async function () {
        await you.edit(0);
      });
      it('Проверка удаления', async function(){
        let tableObject = await you.workWithTable(2);
        let tableAll = tableObject.element(by.tagName('tbody')).all(by.tagName('tr'));
        let tableFirstRow = tableObject.element(by.tagName('tbody')).all(by.tagName('tr')).get(0);
        await browser.wait(EC.visibilityOf(tableObject), browser.params.waitElementLoad,
          'Таблица с элементами не отображается');
        let deleting = await tableFirstRow.getText();
        expect(deleting).to.have.length.above(0, 'Нет первого элемента в таблице привязанных значений. Нечего удалять.');
        await you.remove(0, 2);
        let values = await tableAll.getText();
        expect(values.indexOf(deleting)).to.be.equal(-1, 'Элемент не удалился');
      });
      it('Нажатие кнопки сохранения объекта', async function () {
        await you.pressModalSave();
      });
      it('Закрытие объекта класса', async function () {
        await you.pressModalClose();
      });
      it('Поиск объекта класса', async function () {
        await you.pressFilter(0);
        expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
        await you.pressFilter(0);
      });
    });
  });
  describe('Шаг 3. Проверка представления "Облако тегов"', function(){
    describe('Шаг 3.1 Проверка создания объекта класса по ссылкам', function () {
      before(async ()=>{
        await expect(edited).to.be.equal(true, 'Редактирование не было завершено');
        await expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
        await you.leavePageUnclosed();
        await browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl');
        await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl'),
          browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
        await expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов класса');
      });
      describe('Создаём представление "Облако тегов"', function() {
        it('Нажатие кнопки правки объекта', async function () {
          you.edit(0);
        });
      });
      for(let i =0; i< objects.length; i++){
        describe('Добавление объекта "' + objectsNew[i] + '" в ', ()=>{
          it('Вводим значение и нажимаем сохранить', async function(){
            await browser.wait(EC.visibilityOf(element(by.className('select2-selection select2-selection--multiple'))),
              browser.params.waitElementLoad, 'Поле поиска не отобразился');
            await element(by.className('select2-selection select2-selection--multiple')).click();
            await browser.wait(EC.visibilityOf(element(by.id('select2-a_develop-and-test_classColl' +
                '_tags-results'))),
              browser.params.waitElementLoad, 'Поисковая выдача не отобразилась');
            await browser.actions()
              .sendKeys(objectsNew[i])
              .perform();
            let notThis = (i!==0) ? 0 : 1;
            await browser.wait(EC.visibilityOf(element(by.className('select2-results__option--highlighted'))),
              browser.params.waitElementLoad, 'Поисковая выдача не отобразилась');
            await browser.wait(EC.not(EC.textToBePresentInElement(element(by.id('select2-a_develop-and-test_classColl_tags-results')), objects[notThis])),
              browser.params.waitElementLoad, 'Поиск не отобразился');
            await browser.actions()
              .sendKeys(protractor.Key.ENTER)
              .perform();
          });
        });
      }

      describe('Проверка наличия в справочнике созданных обектов', ()=>{
        it('Проверка наличия объектов', async function(){
          let chsnDict = await element(by.className('select2-selection select2-selection--multiple')).getText();
          let objectsCheck = [];
          for(let i =0; i< objects.length; i++){
            objectsCheck.push(
              expect((chsnDict.indexOf(objects[i]) !== -1)
              ).to.be.above(-1, 'На найден объект ' + objects[i])
            );
          }
          return Promise.all(objectsCheck);
        })
      });
      describe('Завершение создания', function () {
        it('Нажатие кнопки сохранения', async function () {
          await you.pressModalSave();
        });
      });
    });
    describe('Шаг 3.2 Проверка редактирования объекта класса', function () {
      before(async ()=>{
        expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
      });
      it('Открытие фрейма правки объеката справочника', async function () {
        await browser.wait(EC.visibilityOf(element(by.className('select2-selection select2-selection--multiple'))),
          browser.params.waitElementLoad, 'Поиск не отобразился');
        await element.all(by.className('select2-selection__choice')).get(0).click();
        you.deepness++;
        await you.reselectFrame();
        await you.pressModalSave();
      });
      it('Закрыть фрейм', async function () {
        await you.pressModalClose();
      });
    });
    describe('Шаг 3.3 Проверка отвязки объекта класса от ссылок из справочника', function () {
      before(async()=> {
        expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
        expect(CREATED_ELEMENT_ID).to.have.length.above(0, 'ИД созданного элемента нулевой');
      });
      it('Проверка удаления', async function(){
        await browser.wait(EC.visibilityOf(element(by.className('select2-selection select2-selection--multiple'))),
          browser.params.waitElementLoad, 'Поиск не отобразился');
        await element(by.className('select2-selection select2-selection--multiple'))
          .all(by.className('select2-selection__choice__remove')).get(0).click();
        let chsnDict = await element(by.className('select2-selection select2-selection--multiple')).getText();
        expect(chsnDict.indexOf('Чехов')).to.be.equal(-1, 'Элемент не удалился');
      });
      it('Нажатие кнопки сохранения объекта', async function () {
        await you.pressModalSave()
      });
      it('Закрытие объекта класса', async function () {
        await you.pressModalClose();
      });
    });
  });
  describe('Шаг 4. Проверка удаления объекта класса', function () {
    before(async ()=>{
      expect(typeof CREATED_ELEMENT_ID).not.to.be.equal('undefined', 'ИД созданного элемента не определён');
      expect(CREATED_ELEMENT_ID).to.have.length.above(0, 'ИД созданного элемента нулевой');
      await you.leavePageUnclosed();
      await browser.get(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl');
      await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@classColl.classColl'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length.above(0, 'Не найдено объектов для удаления');
    });
    it('Нажатие кнопки удаления объекта', async function () {
      await you.erase(0);
    });
    it('Проверка, что объекта нет в списке', async function () {
      await browser.refresh();
      await you.leavePageUnclosed();
      await expect(await you.filter(CREATED_ELEMENT_ID, 0)).to.have.length(0, 'Не найдено объектов для удаления');
    });
  });
  describe('Шаг 5. Проверка удаления объектов справочника', function () {
    before(function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@catalog');
      browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@catalog'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(browser.getTitle()).to.eventually.equal(browser.params.title.startPage,
        'Заголовок страницы не соответствует искомой');
    });
    for(let i =0; i< objectsNew.length; i++){
      it('Удаление объекта', async function () {
        let findRes = await you.filter(objectsId[i], 0);
        await expect(findRes).to.have.length.above(0, 'Не найдено объектов для удаления');
        await you.erase(0);
        await you.pressFilter(0);
        findRes = await you.filter(objectsId[i], 0);
        await expect(findRes).to.have.length(0, 'Oбъект ' + objectsNew[i] + ' в списке');
        console.log(objectsNew[i] + ' id ' + objectsId[i]);
      });
    }
    afterEach(async function () {
      await you.pressFilter(0);
    });
  });
});

