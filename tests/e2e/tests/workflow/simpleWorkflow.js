const {
  waitElementLoad,
  waitPageLoad
} = require('../../test-param.json');

// Утилиты для тестирования регистри
const {
  waitForLoadEvent,
  click,
  clickSave
} = require('ion-e2e-lib');

const config = require('../../../config.js');
const util = require('../../resource/util.js');
const selectors = require('../../resource/registry/selectors.json');
const registryUtil = require('../../resource/registry/util.js');

const createdObjectsId = []; // Массив с ID созданных объектов
const createdObjectsQuantity = ['10', '11', '12'];// Значения quantity передаваемые объектам
let startCheck; // Переменная для хранения результата выполнения теста этапа "Начать приёмку"
let workingFrame = {}; // Переменная для хранения текущего рабочего фрейма
let loadEventPromise;

describe('Checking simple workflow functionality', function() {
  describe('Checking workflow class page', function() {
    let response;
    beforeAll(async function() {
      const bpPage = `${config.serverURL}/registry/develop-and-test@simple_workflow`;
      const response = await util.goto(bpPage);
    });
    it('List of class objects is accessible', async function() {
      // this.timeout(waitPageLoad);
      expect(response.status()).toEqual(config.HTTP_STATUS_OK);
    });
    it('Checking url', async function() {
      expect(page.url()).toEqual(`${config.serverURL}/registry/develop-and-test@simple_workflow`);
    });
    it('Page title contains the name of the class', async function() {
      expect(await page.title()).toMatch(/Simple workflow/);
    });
    it('Form header contains the name of the class', async function() {
      // this.timeout(waitElementLoad);
      const headerPromise = await page.waitForSelector('.middle-title', OPT_ELEMENT_WAIT_VISIBLE);
      await page.waitForSelector(selectors.itemViewHeader, config.elementVisibleOptions);
      const header = await page.$(selectors.itemViewHeader);
      expect(header).toBeTruthy();
      const headerText = await header.evaluate(header => header.innerText.trim());
      expect(headerText).toEqual('Simple workflow');
    });
  });
  describe('Checking WIP stage', function() {
    describe('Trying to create an object with quantity field left empty', function() {
      beforeAll(async function() {
        loadEventPromise = await Promise.all([
          page.waitForNavigation(config.navigationOptions),
          click(page, '#la_develop-and-test_simple_workflow_create')
        ]);
        // workingFrame = loadEventPromise[0];
      });
      it('Object\'s creator and verifier fields can be edited', async function() {
        // this.timeout(waitPageLoad);
        await page.waitForSelector(selectors.itemViewFormField, config.elementVisibleOptions);
        const auditorFieldFound = await registryUtil.editItemField(page, selectors.itemViewFormField, 'Проверяющий', '');
        expect(auditorFieldFound).toBeTruthy();
        const creatorFieldFound = await registryUtil.editItemField(page, selectors.itemViewFormField, 'Автор объекта', '');
        expect(creatorFieldFound).toBeTruthy();
        expect(await registryUtil.isInteractive(page, undefined, 'Проверяющий')).toBeTruthy();
        expect(await registryUtil.isInteractive(page, undefined, 'Автор объекта')).toBeTruthy();
      });
      it('Object saving', async function() {
        // this.timeout(waitPageLoad);
        loadEventPromise = await Promise.all([
          page.waitForNavigation(config.navigationOptions),
          registryUtil.saveItem(page)
        ]);
        const message = await page.$(selectors.itemViewError);
        if (message && (await util.isVisible(message))) {
          const messageText = await util.getText(message);
          console.warn(messageText);
          throw new Error(messageText);
        }
      });
      it('Checking ID', async function() {
        await page.waitForSelector(selectors.itemViewFormField, config.elementVisibleOptions);
        expect(await util.isVisible(page, selectors.itemViewFormField)).toBeTruthy();
        const id = await registryUtil.getFieldValue(page, selectors.itemViewFormField, "Идентификатор");
        expect(id.length).toBeGreaterThan(0);
        createdObjectsId.push(id);
      });
      it('Item\'s author field is not editable', async function() {
        await page.waitForSelector('#a_develop-and-test_workflowBase_creatorDefault', OPT_ELEMENT_WAIT_INVISIBLE)
          .catch(err => {
            expect(err).not.toBeTruthy();
          });
        await page.waitForSelector(selectors.itemViewFormField, config.elementVisibleOptions);
        await page.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
          config.elementVisibleOptions)
          .catch(err => {
            expect(err).not.toBeTruthy();
          });
        let authorOverlay = await page.$x('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
        authorOverlay = authorOverlay.pop();
        const authorField = await workingFrame.$('#a_develop-and-test_workflowBase_creatorDefault');
        const authorOverlayText = await workingFrame.evaluate(overText => overText.innerText, authorOverlay);
        const authorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'), authorField);
        assert(authorOverlayText === authorFieldText, 'Значение поля ввода "Автор Объекта" и заменителя не cовпадают');
      });
      it('Проверка невозможности редактирования поля "Проверяющий"', async function() {
        await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_person', OPT_ELEMENT_WAIT_INVISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Проверяющий');
          });
        await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_person"]/following-sibling::' +
          'div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
          OPT_ELEMENT_WAIT_VISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Заменитель поля ввода "Проверяющий" не отобразился');
          });
        let auditorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
        auditorOverlay = auditorOverlay.pop();
        const auditorField = await workingFrame.$('#a_develop-and-test_workflowBase_person');
        const auditorOverlayText = await workingFrame.evaluate(overText => overText.innerText, auditorOverlay);
        const auditorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'), auditorField);
        assert(auditorOverlayText === auditorFieldText, 'Значение поля ввода "Проверяющий" и заменителя не cовпадают');
      });
      it('Проверка отсутствия поля "Результат"', async function() {
        const resultField = await workingFrame.$('#a_develop-and-test_workflowBase_result');
        assert.equal(resultField, null, 'Поле "Результат" загрузилось');
      });
      it('Проверка поля "Этап" созданного объекта', async function() {
        const stageField = await workingFrame.$('#a_develop-and-test_workflowBase_stage');
        const stageFieldText = await workingFrame.evaluate(stageText => stageText.getAttribute('value'), stageField);
        assert.equal(stageFieldText, 'inwork', 'Этап нового объекта отличается от "В работе"');
      });
    });
  });
  describe('Проверка работы условия (>10) появления перехода "На приёмку"', function() {
    it('Вводим значение меньше необходимого в поле quantaty', async function() {
      const quantity = await workingFrame.$('#a_develop-and-test_workflowBase_quantaty');
      await workingFrame.evaluate(quantityObj => quantityObj.value = '', quantity);
      await workingFrame.type('#a_develop-and-test_workflowBase_quantaty', createdObjectsQuantity[0]);
    });
    it('Сохранение объекта', async function() {
      this.timeout(waitPageLoad);
      loadEventPromise = await Promise.all([waitForLoadEvent(), clickSave(workingFrame)]);
      workingFrame = loadEventPromise[0];
    });
    it('Проверка на наличие сообщений об ошибках', async function() {
      this.timeout(waitPageLoad);
      let message = await workingFrame.$('#message-callout');
      if (message && await isVisible(workingFrame, message)) {
        console.warn(await getText(workingFrame, message));
        throw new Error(message);
      }
    });
    it('Проверяем отсутствие возможности перехода', async function() {
      const startCheckBtn = await workingFrame.$('.startCheck');
      assert.equal(startCheckBtn, null, 'Кнопка "Начать приёмку" загрузлась');
    });
    it('Вводим минимальное необходимое значение в поле quantaty', async function() {
      const quantity = await workingFrame.$('#a_develop-and-test_workflowBase_quantaty');
      await workingFrame.evaluate(quantityObj => quantityObj.value = '', quantity);
      await workingFrame.type('#a_develop-and-test_workflowBase_quantaty', createdObjectsQuantity[FIRST_OR_SINGLE]);
    });
    it('Сохранение объекта', async function() {
      this.timeout(waitPageLoad);
      loadEventPromise = await Promise.all([waitForLoadEvent(), clickSave(workingFrame)]);
      workingFrame = loadEventPromise[0];
    });
    it('Проверка на наличие сообщений об ошибках', async function() {
      this.timeout(waitPageLoad);
      let message = await workingFrame.$('#message-callout');
      if (message && await isVisible(workingFrame, message)) {
        console.warn(await getText(workingFrame, message));
        throw new Error(message);
      }
    });
    it('Проверяем наличие возможности перехода', async function() {
      this.timeout(10000);
      await workingFrame.waitForSelector('.startCheck', OPT_ELEMENT_WAIT_VISIBLE)
        .catch(err => {
          assert.equal(err, null, 'Кнопка "Начать приёмку" не отобразилась');
        });
    });
    it('Проверка перехода на этап "На приёмке"', async function() {
      this.timeout(waitPageLoad);
      loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.startCheck')]);
      workingFrame = loadEventPromise[0];
    });
    it('Проверка текущего этапа', async function() {
      const stageField = await workingFrame.$('#a_develop-and-test_workflowBase_stage');
      const stageFieldText = await workingFrame.evaluate(stageText => stageText.getAttribute('value'), stageField);
      assert.equal(stageFieldText, 'incheck', 'Этап нового объекта отличается от "На приёмке"');
      startCheck = true;
    });
    it('Проверка невозможности редактирования поля "Автор объекта"', async function() {
      await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_creatorDefault', OPT_ELEMENT_WAIT_INVISIBLE)
        .catch(err => {
          assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Автор Объекта');
        });
      await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
        OPT_ELEMENT_WAIT_VISIBLE)
        .catch(err => {
          assert.equal(err, null, 'Заменитель поля ввода "Автор Объекта" не отобразился');
        });
      let authorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
      authorOverlay = authorOverlay.pop();
      const authorField = await workingFrame.$('#a_develop-and-test_workflowBase_creatorDefault');
      const authorOverlayText = await workingFrame.evaluate(overText => overText.innerText, authorOverlay);
      const authorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'), authorField);
      assert(authorOverlayText === authorFieldText, 'Значение поля ввода "Автор Объекта" и заменителя не cовпадают');
    });
    it('Проверка невозможности редактирования поля "Проверяющий"', async function() {
      await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_person', OPT_ELEMENT_WAIT_INVISIBLE)
        .catch(err => {
          assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Проверяющий');
        });
      await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_person"]/following-sibling::' +
        'div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
        OPT_ELEMENT_WAIT_VISIBLE)
        .catch(err => {
          assert.equal(err, null, 'Заменитель поля ввода "Проверяющий" не отобразился');
        });
      let auditorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
        'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
      auditorOverlay = auditorOverlay.pop();
      const auditorField = await workingFrame.$('#a_develop-and-test_workflowBase_person');
      const auditorOverlayText = await workingFrame.evaluate(overText => overText.innerText, auditorOverlay);
      const auditorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'), auditorField);
      assert(auditorOverlayText === auditorFieldText, 'Значение поля ввода "Проверяющий" и заменителя не cовпадают');
    });
    it('Проверка отсутствия поля "Результат"', async function() {
      const resultField = await workingFrame.$('#a_develop-and-test_workflowBase_result');
      assert.equal(resultField, null, 'Поле "Результат" загрузилось');
    });
  });
  describe('Проверка этапа "На приёмке" и конечных этапов', function() {
    before(() => {
      assert.equal(startCheck, true, 'Переход на этап "На приёмке не был совершён, невозможно проверить этот' +
        ' и последующие этапы"');
    });
    describe('Проверка перехода с этапа "На приёмке" на этап "Проверен" с результатом "Завалено"', function() {
      it('Проверка перехода на этап "Проверен" с результатом "Завалено"', async function() {
        this.timeout(waitPageLoad);
        loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.reject')]);
        workingFrame = loadEventPromise[0];
      });
      it('Проверка текущего этапа', async function() {
        const stageField = await workingFrame.$('#a_develop-and-test_workflowBase_stage');
        const stageFieldText = await workingFrame.evaluate(stageText => stageText.getAttribute('value'), stageField);
        assert.equal(stageFieldText, 'checked', 'Этап нового объекта отличается от "Проверен"');
      });
      it('Проверка невозможности редактирования поля "Автор объекта"', async function() {
        await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_creatorDefault',
          OPT_ELEMENT_WAIT_INVISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Автор Объекта');
          });
        await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
          OPT_ELEMENT_WAIT_VISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Заменитель поля ввода "Автор Объекта" не отобразился');
          });
        let authorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
        authorOverlay = authorOverlay.pop();
        const authorField = await workingFrame.$('#a_develop-and-test_workflowBase_creatorDefault');
        const authorOverlayText = await workingFrame.evaluate(overText => overText.innerText, authorOverlay);
        const authorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'), authorField);
        assert(authorOverlayText === authorFieldText, 'Значение поля ввода "Автор Объекта" и заменителя не cовпадают');
      });
      it('Проверка невозможности редактирования поля "Проверяющий"', async function() {
        await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_person', OPT_ELEMENT_WAIT_INVISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Проверяющий');
          });
        await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_person"]/following-sibling::' +
          'div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
          OPT_ELEMENT_WAIT_VISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Заменитель поля ввода "Проверяющий" не отобразился');
          });
        let auditorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
          'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
        auditorOverlay = auditorOverlay.pop();
        const auditorField = await workingFrame.$('#a_develop-and-test_workflowBase_person');
        const auditorOverlayText = await workingFrame.evaluate(overText => overText.innerText, auditorOverlay);
        const auditorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'),
          auditorField);
        assert(auditorOverlayText === auditorFieldText, 'Значение поля ввода "Проверяющий" и заменителя не cовпадают');
      });
      it('Проверка поля "Результат"', async function() {
        await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_result', OPT_ELEMENT_WAIT_INVISIBLE)
          .catch(err => {
            assert.equal(err, null, 'Поле "Результат" не отобразилось');
          });
        const resultField = await workingFrame.$('#a_develop-and-test_workflowBase_result');
        const resultFieldText = await workingFrame.evaluate(overText => overText.getAttribute('value'), resultField);
        assert.equal(resultFieldText, 'Failed', 'Результат отличается от "Failed"');
      });
      after(async function() {
        await click(workingFrame, '#imodal > div.imodal-box.inline-form-relative > ' +
          'div.imodal-box-header > button');
      });
    });
    describe('Проверка перехода с этапа "На приёмке" на этап "Проверен" с результатом "Выполнено"', function() {
      describe('Создание нового объекта на этапе "На приёмке"', function() {
        it('Нажимаем "Создать"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(),
            click(page, '#la_develop-and-test_simple_workflow_create')]);
          workingFrame = loadEventPromise[0];
        });
        it('Вводим минимальное необходимое значение в поле quantaty', async function() {
          this.timeout(waitElementLoad);
          const quantity = await workingFrame.$('#a_develop-and-test_workflowBase_quantaty');
          await workingFrame.evaluate(quantityObj => quantityObj.value = '', quantity);
          await workingFrame.type('#a_develop-and-test_workflowBase_quantaty', createdObjectsQuantity[FIRST_OR_SINGLE]);
        });
        it('Сохранение объекта', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), clickSave(workingFrame)]);
          workingFrame = loadEventPromise[0];
        });
        it('Проверка на наличие сообщений об ошибках', async function() {
          this.timeout(waitPageLoad);
          let message = await workingFrame.$('#message-callout');
          if (message && await isVisible(workingFrame, message)) {
            console.warn(await getText(workingFrame, message));
            throw new Error(message);
          }
        });
        it('Проверяем ID', async function() {
          this.timeout(waitPageLoad);
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_id', OPT_ELEMENT_WAIT_INVISIBLE)
            .catch((err) => {
              throw err;
            });
          const findAuthorOverlay = await workingFrame.$('#a_develop-and-test_workflowBase_id');
          assert.notEqual(findAuthorOverlay, null, 'Не получается загрузить id');
          const val = await workingFrame.evaluate(obj => obj.getAttribute('value'), findAuthorOverlay);
          assert(val.length !== 0, 'Идентификатор имеет длину 0');
          createdObjectsId.push(val);
        });
        it('Переход на этап "На приёмке"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.startCheck')]);
          workingFrame = await loadEventPromise[0];
        });
      });
      describe('Проверка перехода на этап "Выполнено"', function() {
        it('Переход на этап "Выполнено"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.accept')]);
          workingFrame = loadEventPromise[0];
        });
        it('Проверка текущего этапа', async function() {
          const stageField = await workingFrame.$('#a_develop-and-test_workflowBase_stage');
          const stageFieldText = await workingFrame.evaluate(stageText => stageText.getAttribute('value'), stageField);
          assert.equal(stageFieldText, 'checked', 'Этап нового объекта отличается от "Проверен"');
        });
        it('Проверка невозможности редактирования поля "Автор объекта"', async function() {
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_creatorDefault',
            OPT_ELEMENT_WAIT_INVISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Автор Объекта');
            });
          await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
            OPT_ELEMENT_WAIT_VISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Заменитель поля ввода "Автор Объекта" не отобразился');
            });
          let authorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
          authorOverlay = authorOverlay.pop();
          const authorField = await workingFrame.$('#a_develop-and-test_workflowBase_creatorDefault');
          const authorOverlayText = await workingFrame.evaluate(overText => overText.innerText, authorOverlay);
          const authorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'),
            authorField);
          assert(authorOverlayText === authorFieldText, 'Значение поля ввода "Автор Объекта" и заменителя ' +
            'не cовпадают');
        });
        it('Проверка невозможности редактирования поля "Проверяющий"', async function() {
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_person', OPT_ELEMENT_WAIT_INVISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Проверяющий');
            });
          await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
            OPT_ELEMENT_WAIT_VISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Заменитель поля ввода "Проверяющий" не отобразился');
            });
          let auditorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
          auditorOverlay = auditorOverlay.pop();
          const auditorField = await workingFrame.$('#a_develop-and-test_workflowBase_person');
          const auditorOverlayText = await workingFrame.evaluate(overText => overText.innerText, auditorOverlay);
          const auditorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'),
            auditorField);
          assert(auditorOverlayText === auditorFieldText, 'Значение поля ввода "Проверяющий" и заменителя ' +
            'не cовпадают');
        });
        it('Проверка поля "Результат"', async function() {
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_result', OPT_ELEMENT_WAIT_INVISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Поле "Результат" не отобразилось');
            });
          const resultField = await workingFrame.$('#a_develop-and-test_workflowBase_result');
          const resultFieldText = await workingFrame.evaluate(overText => overText.getAttribute('value'), resultField);
          assert.equal(resultFieldText, 'Done', 'Результат отличается от "Done"');
        });
      });
      after(async function() {
        await click(workingFrame, '#imodal > div.imodal-box.inline-form-relative > ' +
          'div.imodal-box-header > button');
      });
    });
    describe('Проверка  перехода с этапа "На приёмке" на этап "В работе"', function() {
      describe('Создание нового объекта на этапе "На приёмке"', function() {
        it('Нажимаем "Создать"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(),
            click(page, '#la_develop-and-test_simple_workflow_create')]);
          workingFrame = loadEventPromise[0];
        });
        it('Вводим минимальное необходимое значение в поле quantaty', async function() {
          const quantity = await workingFrame.$('#a_develop-and-test_workflowBase_quantaty');
          await workingFrame.evaluate(quantityObj => quantityObj.value = '', quantity);
          await workingFrame.type('#a_develop-and-test_workflowBase_quantaty', createdObjectsQuantity[FIRST_OR_SINGLE]);
        });
        it('Сохранение объекта', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), clickSave(workingFrame)]);
          workingFrame = loadEventPromise[0];
        });
        it('Проверка на наличие сообщений об ошибках', async function() {
          this.timeout(waitPageLoad);
          let message = await workingFrame.$('#message-callout');
          if (message && await isVisible(workingFrame, message)) {
            console.warn(await getText(workingFrame, message));
            throw new Error(message);
          }
        });
        it('Проверяем ID', async function() {
          this.timeout(waitPageLoad);
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_id', OPT_ELEMENT_WAIT_INVISIBLE)
            .catch((err) => {
              throw err;
            });
          const findAuthorOverlay = await workingFrame.$('#a_develop-and-test_workflowBase_id');
          assert.notEqual(findAuthorOverlay, null, 'Не получается загрузить id');
          const val = await workingFrame.evaluate(obj => obj.getAttribute('value'), findAuthorOverlay);
          assert(val.length !== 0, 'Идентификатор имеет длину 0');
          createdObjectsId.push(val);
        });
        it('Переход на этап "На приёмке"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.startCheck')]);
          workingFrame = loadEventPromise[0];
        });
      });
      describe('Проверка перехода на этап "В работе"', function() {
        it('Переход на этап "В работе"', async function() {
          this.timeout(waitPageLoad);
          loadEventPromise = await Promise.all([waitForLoadEvent(), click(workingFrame, '.return')]);
          workingFrame = loadEventPromise[0];
        });
        it('Проверка текущего этапа', async function() {
          const stageField = await workingFrame.$('#a_develop-and-test_workflowBase_stage');
          const stageFieldText = await workingFrame.evaluate(stageText => stageText.getAttribute('value'), stageField);
          assert.equal(stageFieldText, 'inwork', 'Этап нового объекта отличается от "В работе"');
        });
        it('Проверка невозможности редактирования поля "Автор объекта"', async function() {
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_creatorDefault',
            OPT_ELEMENT_WAIT_INVISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Автор Объекта');
            });
          await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
            OPT_ELEMENT_WAIT_VISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Заменитель поля ввода "Автор Объекта" не отобразился');
            });
          let authorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_creatorDefault"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
          authorOverlay = authorOverlay.pop();
          const authorField = await workingFrame.$('#a_develop-and-test_workflowBase_creatorDefault');
          const authorOverlayText = await workingFrame.evaluate(overText => overText.innerText, authorOverlay);
          const authorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'),
            authorField);
          assert(authorOverlayText === authorFieldText, 'Значение поля ввода "Автор Объекта" и заменителя не ' +
            'cовпадают');
        });
        it('Проверка невозможности редактирования поля "Проверяющий"', async function() {
          await workingFrame.waitForSelector('#a_develop-and-test_workflowBase_person', OPT_ELEMENT_WAIT_INVISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Не отображается поле ввода для редактирования значения аттрибута Проверяющий');
            });
          await workingFrame.waitForXPath('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]',
            OPT_ELEMENT_WAIT_VISIBLE)
            .catch(err => {
              assert.equal(err, null, 'Заменитель поля ввода "Проверяющий" не отобразился');
            });
          let auditorOverlay = await workingFrame.$x('//input[@id = "a_develop-and-test_workflowBase_person"]/' +
            'following-sibling::div[contains(concat(" ", normalize-space(@class), " "), " form-control-static ")]');
          auditorOverlay = auditorOverlay.pop();
          const auditorField = await workingFrame.$('#a_develop-and-test_workflowBase_person');
          const auditorOverlayText = await workingFrame.evaluate(overText => overText.innerText, auditorOverlay);
          const auditorFieldText = await workingFrame.evaluate(fieldText => fieldText.getAttribute('value'),
            auditorField);
          assert(auditorOverlayText === auditorFieldText, 'Значение поля ввода "Проверяющий" и ' +
            'заменителя не cовпадают');
        });
        it('Проверка отсутствия поля "Результат"', async function() {
          const resultField = await workingFrame.$('#a_develop-and-test_workflowBase_result');
          assert.equal(resultField, null, 'Поле "Результат" загрузилось');
        });
      });
      after(async function() {
        await click(workingFrame, '#imodal > div.imodal-box.inline-form-relative > ' +
          'div.imodal-box-header > button');
      });
    });
  });
});
