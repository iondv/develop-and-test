/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 13.03.2018.
 */
/* globals describe, before, it, browser, expect, protractor, element, by */
const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
let createdObjectsQuantity = ['10', '11', '12'];
let createdObjectsId = [];
let startCheck = false;

describe.skip('Тестирование простого бизнесс процесса', () => {
  describe('Переход на страницу класса', function () {
    it('Открытие списка объектов класса', async function () {
      await browser.get(browser.params.serverURL + '/registry/develop-and-test@simple_workflow');
      await browser.wait(EC.urlContains(browser.params.serverURL + '/registry/develop-and-test@simple_workflow'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      await expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Простой бизнес-процесс: Класс ' +
        'объекта РП', 'Заголовок центрального блока страницы не соответствует странице списка объектов');
    });
  });
  describe('Проверка этапа "В работе"', () => {
    it('Создание объекта с незаполненным полем quantity', async () => {
      await you.pressCreate();
    });
    it('Проверка возможности редактирования полей "Автор объекта" и "Проверяющий" при создании объекта', async () => {
      await browser.wait(EC.visibilityOf(element(by.id('a_develop-and-test_workflowBase_person'))),
        browser.params.waitElementLoad, 'Не отображается поле ввода для редактирования значения аттрибута' +
        ' Проверяющий');
      await browser.wait(EC.visibilityOf(element(by.id('a_develop-and-test_workflowBase_creatorDefault'))),
        browser.params.waitElementLoad, 'Не отображается поле ввода для редактирования значения аттрибута' +
        ' Автор Объекта');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isPresent())
        .to.be.eventually.equal(false, 'Заменитель поля ввода "Проверяющий" отобразился');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isPresent())
        .to.be.eventually.equal(false, 'Заменитель поля ввода "Автор Объекта" отобразился');
    });
    it('Сохранение объекта', async () => {
      await you.pressModalSave();
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      await expect(element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value'))
        .to.eventually.have.length.above(0);
      createdObjectsId.push(await element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value'));
    });
    it('Проверка невозможности редактирования поля "Автор объекта"', async () => {
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_creatorDefault'))),
        browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
        ' Автор Объекта');
      await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).isDisplayed())
        .to.be.eventually.equal(false, 'Поля ввода "Автор Объекта" отобразилось');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isDisplayed())
        .to.be.eventually.equal(true, 'Заменитель поля ввода "Автор Объекта" не отобразился');
      let textCreDefShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).getText();
      await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).getAttribute('value'))
        .to.be.eventually.equal(textCreDefShowed, 'Значение поля ввода "Автор Объекта" и заменителя не овпадают');
    });
    it('Проверка невозможности редактирования поля "Проверяющий"', async () => {
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_person'))),
        browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
        ' Проверяющий');
      await expect(element(by.id('a_develop-and-test_workflowBase_person')).isDisplayed())
        .to.be.eventually.equal(false, 'Поля ввода "Проверяющий" отобразилось');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isDisplayed())
        .to.be.eventually.equal(true, 'Заменитель поля ввода "Проверяющий" не отобразился');
      let textPersonShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).getText();
      await expect(element(by.id('a_develop-and-test_workflowBase_person')).getAttribute('value'))
        .to.be.eventually.equal(textPersonShowed, 'Значение поля ввода "Проверяющий" и заменителя не овпадают');
    });
    it('Проверка отсутствия поля "Результат"', async () => {
      await expect(element(by.id('a_develop-and-test_workflowBase_result')).isPresent())
        .to.be.eventually.equal(false, 'Поля "Результат" загрузилось');
    });
    it('Проверка поля "Этап" созданного объекта', async () => {
      expect(element(by.id('a_develop-and-test_workflowBase_stage')).getAttribute('value')).to.be.eventually
        .equal('inwork', 'Этап нового объекта отличается от "В работе"');
    });
    it('Проверка работы условия появления перехода "На приёмку"', async () => {
      await you.enterTextInField(createdObjectsQuantity[0], 'a_develop-and-test_workflowBase_quantaty');
      await you.pressModalSave();
      await browser.wait(EC.visibilityOf(element(by.id('ffa_develop-and-test_workflowBasesave'))),
        browser.params.waitElementLoad, 'Не получается загрузить боковые кнопки сохранения');
      await expect(element(by.className('startCheck')).isPresent()).to.be.eventually.equal(false,
        'Кнопка "Начать приёмку" отобразилась');
      await you.enterTextInField('11', 'a_develop-and-test_workflowBase_quantaty');
      await you.pressModalSave();
      await browser.wait(EC.visibilityOf(element(by.id('ffa_develop-and-test_workflowBasesave'))),
        browser.params.waitElementLoad, 'Не получается загрузить боковые кнопки сохранения');
      await expect(element(by.className('startCheck')).isDisplayed()).to.be.eventually.equal(true,
        'Кнопка "Начать приёмку" отобразилась');
    });
    it('Проверка перехода на этап "На приёмке"', async () => {
      await element(by.className('startCheck')).click();
      await you.reselectFrame();
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_stage'))),
        browser.params.waitElementLoad, 'Не загрузилось поле "Этап"');
      let stage = await element(by.id('a_develop-and-test_workflowBase_stage')).getAttribute('value');
      await expect(stage).to.be.equal('incheck', 'Этап объекта отличается от "На приёмке"');
      startCheck = true;
    });
    it('Проверка невозможности редактирования поля "Автор объекта"', async () => {
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_creatorDefault'))),
        browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
        ' Автор Объекта');
      await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).isDisplayed())
        .to.be.eventually.equal(false, 'Поля ввода "Автор Объекта" отобразилось');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isDisplayed())
        .to.be.eventually.equal(true, 'Заменитель поля ввода "Автор Объекта" не отобразился');
      let textCreDefShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).getText();
      await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).getAttribute('value'))
        .to.be.eventually.equal(textCreDefShowed, 'Значение поля ввода "Автор Объекта" и заменителя не овпадают');
    });
    it('Проверка невозможности редактирования поля "Проверяющий"', async () => {
      await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_person'))),
        browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
        ' Проверяющий');
      await expect(element(by.id('a_develop-and-test_workflowBase_person')).isDisplayed())
        .to.be.eventually.equal(false, 'Поля ввода "Проверяющий" отобразилось');
      await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).isDisplayed())
        .to.be.eventually.equal(true, 'Заменитель поля ввода "Проверяющий" не отобразился');
      let textPersonShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
        ' " form-control-static ")]')).getText();
      await expect(element(by.id('a_develop-and-test_workflowBase_person')).getAttribute('value'))
        .to.be.eventually.equal(textPersonShowed, 'Значение поля ввода "Проверяющий" и заменителя не овпадают');
   });
    it('Проверка отсутствия поля "Результат"', async () => {
      await expect(element(by.id('a_develop-and-test_workflowBase_result')).isPresent())
        .to.be.eventually.equal(false, 'Поля "Результат" загрузилось');
      });
  });
  describe('Проверка этапа "На приёмке" и конечных этапов', () => {
    before(() => {
      expect(startCheck).to.be.equal(true, 'Переход на этап "На приёмке не был совершён, невозможно проверить этот' +
        ' и последующие этапы"');
    });
    describe('Проверка этапа "Проверен" с результатом "Завалено"', () => {
      it('Проверка перехода на этап "Проверен" с результатом "Завалено"', async () => {
        await browser.wait(EC.visibilityOf(element(by.id('ffa_develop-and-test_workflowBasesave'))),
          browser.params.waitElementLoad, 'Не получается загрузить боковые кнопки сохранения');
        await element(by.className('reject')).click();
        await you.reselectFrame();
      });
      it('Проверка этапа', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_stage'))),
          browser.params.waitElementLoad, 'Не получается загрузить поле "Этап"');
        await expect(element(by.id('a_develop-and-test_workflowBase_stage')).getAttribute('value')).to.be.eventually
          .equal('checked', 'Этап объекта отличается от "Проверен"');
      });
      it('Проверка невозможности редактирования поля "Автор объекта"', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_creatorDefault'))),
          browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
          ' Автор Объекта');
        await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).isDisplayed())
          .to.be.eventually.equal(false, 'Поля ввода "Автор Объекта" отобразилось');
        await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).isDisplayed())
          .to.be.eventually.equal(true, 'Заменитель поля ввода "Автор Объекта" не отобразился');
        let textCreDefShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).getText();
        await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).getAttribute('value'))
          .to.be.eventually.equal(textCreDefShowed, 'Значение поля ввода "Автор Объекта" и заменителя не овпадают');
      });
      it('Проверка невозможности редактирования поля "Проверяющий"', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_person'))),
          browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
          ' Проверяющий');
        await expect(element(by.id('a_develop-and-test_workflowBase_person')).isDisplayed())
          .to.be.eventually.equal(false, 'Поля ввода "Проверяющий" отобразилось');
        await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).isDisplayed())
          .to.be.eventually.equal(true, 'Заменитель поля ввода "Проверяющий" не отобразился');
        let textPersonShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).getText();
        await expect(element(by.id('a_develop-and-test_workflowBase_person')).getAttribute('value'))
          .to.be.eventually.equal(textPersonShowed, 'Значение поля ввода "Проверяющий" и заменителя не овпадают');
      });
      it('Проверка поля "Результат"', async () => {
        await expect(element(by.id('a_develop-and-test_workflowBase_result')).isPresent())
          .to.be.eventually.equal(true, 'Поля "Результат" не загрузилось');
        await expect(element(by.id('a_develop-and-test_workflowBase_result')).getAttribute('value')).to.be.eventually
          .equal('Завалено', 'Результат отличается от "Завалено"');
      });
      after(async () => {
        await you.pressModalClose();
      });
    });
    describe('Проверка этапа "Проверен" с результатом "Выполнено"', () => {
      before(async () => {
        await you.pressCreate();
        await you.enterTextInField(createdObjectsQuantity[1], 'a_develop-and-test_workflowBase_quantaty');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_id'))),
          browser.params.waitElementLoad, 'Не получается загрузить id');
        await expect(element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value'))
          .to.eventually.have.length.above(0);
        let id = await element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value');
        createdObjectsId.push(id);
        await element(by.className('startCheck')).click();
        await you.reselectFrame();
      });
      it('Проверка перехода на этап "Проверен" с результатом "Выполнено"', async () => {
        await browser.wait(EC.visibilityOf(element(by.id('ffa_develop-and-test_workflowBasesave'))),
          browser.params.waitElementLoad, 'Не получается загрузить боковые кнопки сохранения');
        await browser.wait(EC.elementToBeClickable(element(by.className('accept'))),
          browser.params.waitElementLoad, 'Не получается кликнуть на кнопку "Принять"');
        await element(by.className('accept')).click();
        await you.reselectFrame();
      });
      it('Проверка этапа', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_stage'))),
          browser.params.waitElementLoad, 'Не получается загрузить поле "Этап"');
        await expect(element(by.id('a_develop-and-test_workflowBase_stage')).getAttribute('value')).to.be.eventually
          .equal('checked', 'Этап объекта отличается от "Проверен"');
      });
      it('Проверка невозможности редактирования поля "Автор объекта"', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_creatorDefault'))),
          browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
          ' Автор Объекта');
        await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).isDisplayed())
          .to.be.eventually.equal(false, 'Поля ввода "Автор Объекта" отобразилось');
        await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).isDisplayed())
          .to.be.eventually.equal(true, 'Заменитель поля ввода "Автор Объекта" не отобразился');
        let textCreDefShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).getText();
        await expect(element(by.id('a_develop-and-test_workflowBase_creatorDefault')).getAttribute('value'))
          .to.be.eventually.equal(textCreDefShowed, 'Значение поля ввода "Автор Объекта" и заменителя не овпадают');
      });
      it('Проверка невозможности редактирования поля "Проверяющий"', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_person'))),
          browser.params.waitElementLoad, 'Не загрузилось поле ввода для редактирования значения аттрибута' +
          ' Проверяющий');
        await expect(element(by.id('a_develop-and-test_workflowBase_person')).isDisplayed())
          .to.be.eventually.equal(false, 'Поля ввода "Проверяющий" отобразилось');
        await expect(element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).isDisplayed())
          .to.be.eventually.equal(true, 'Заменитель поля ввода "Проверяющий" не отобразился');
        let textPersonShowed = await element(by.xpath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "),' +
          ' " form-control-static ")]')).getText();
        await expect(element(by.id('a_develop-and-test_workflowBase_person')).getAttribute('value'))
          .to.be.eventually.equal(textPersonShowed, 'Значение поля ввода "Проверяющий" и заменителя не овпадают');
      });
      it('Проверка поля "Результат"', async () => {
        await expect(element(by.id('a_develop-and-test_workflowBase_result')).isPresent())
          .to.be.eventually.equal(true, 'Поля "Результат" не загрузилось');
        await expect(element(by.id('a_develop-and-test_workflowBase_result')).getAttribute('value')).to.be.eventually
          .equal('Выполнено', 'Результат отличается от "Выполнено"');
      });
      after(async () => {
        await you.pressModalClose();
      });
    });
    describe('Проверка этапа "Проверен" с результатом "Выполнено"', () => {
      before(async () => {
        await you.pressCreate();
        await you.enterTextInField(createdObjectsQuantity[1], 'a_develop-and-test_workflowBase_quantaty');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_id'))),
          browser.params.waitElementLoad, 'Не получается загрузить id');
        await expect(element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value'))
          .to.eventually.have.length.above(0);
        let id = await element(by.id('a_develop-and-test_workflowBase_id')).getAttribute('value');
        createdObjectsId.push(id);
        await element(by.className('startCheck')).click();
        await you.reselectFrame();
      });
      it('Проверка перехода на этап "В работе"', async () => {
        await browser.wait(EC.visibilityOf(element(by.id('ffa_develop-and-test_workflowBasesave'))),
          browser.params.waitElementLoad, 'Не получается загрузить боковые кнопки сохранения');
        await browser.wait(EC.elementToBeClickable(element(by.className('return'))),
          browser.params.waitElementLoad, 'Не получается кдикнуть на кнопку "Вернуть"');
        await element(by.className('return')).click();
        await you.reselectFrame();
      });
      it('Проверка открывшегося этапа', async () => {
        await browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_workflowBase_stage'))),
          browser.params.waitElementLoad, 'Не получается загрузить поле "Этап"');
        await expect(element(by.id('a_develop-and-test_workflowBase_stage')).getAttribute('value')).to.be.eventually
          .equal('inwork', 'Этап объекта отличается от "На приемке"');
        await expect(element(by.id('a_develop-and-test_workflowBase_quantaty')).getAttribute('value')).to.be.eventually
          .equal('0', 'Поле quantity отличается от 0');
      });
      after(async () => {
        await you.pressModalClose();
      });
    });

  });
  describe('Удаление созданных объектов', () => {
    for(let i = 0; i< createdObjectsQuantity.length; i++) {
      it('Удаление объекта ' + i + ' id ', async () => {
        console.log(createdObjectsId[i]);
        let findRes = await you.filter(createdObjectsId[i], 0);
        await expect(findRes).to.have.length.above(0, 'Не найдено объектов для удаления');
        await you.erase(0);
        await you.pressFilter(0);
        findRes = await you.filter(createdObjectsId[i], 0);
        await expect(findRes).to.have.length(0, 'Oбъект c id' + createdObjectsId[i] + ' в списке');
        await you.pressFilter(0);
      });
    }
  });
});