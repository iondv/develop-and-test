/**
 * Created by YouTHFooL on 14.10.2016.
 */
// Page object теста проверки обработки поля меты представления "required"
'use strict';
/* Параметры jshint */
/* globals browser.params. expect, protractor */

var crypto = require('crypto');
let serverURL = browser.params.serverURL + browser.params.path.modulePrefix;
let EC = protractor.ExpectedConditions;
let requiredPath = browser.params.requiredAttribute.path;
let requiredTitle = browser.params.requiredAttribute.title;
let formErrorMessage = browser.params.requiredAttribute.formErrorMessage;
let attrErrorMessage = browser.params.requiredAttribute.attrErrorMessage;
let randomString = crypto.randomBytes(14).toString('hex');
let randomReal = (Math.pow(-1, Math.floor(Math.random() * 2)) * Math.floor(Math.random() * 1000000) / 1000).toString();
let createdElementId;

module.exports = function () {
};

module.exports.prototype = {
  /**
   * Функция проверки открытия страницы списка объектов меты представления "required"
   */
  objectListOpen: function () {
    browser.get(serverURL + requiredPath);
    expect(browser.getCurrentUrl()).to.eventually.equal(serverURL + requiredPath,
      'Адрес страницы не соответствует искомой');
    expect(browser.getTitle()).to.eventually.equal(browser.params.title.startPage,
      'Заголовок страницы не соответствует искомой');
    expect(element(by.css('#page-header h1')).getText()).to.eventually.contain(requiredTitle,
      'Заголовок центрального блока страницы не соответствует странице списка объектов');
    expect(element.all(by.css('#content div.dataTables_scrollBody tr')).count()).to.eventually.not.equal(0,
      'Список объектов пуст');
  },
  /**
   * Функция проверки нажатия кнопки создания нового объекта
   */
  createButtonClick: function () {
    element(by.css('#content div.list-tools button.create')).click().then(function () {
      browser.wait(EC.visibilityOf(element(by.id('imodal-frame'))), browser.params.waitElementLoad);
      expect(element(by.id('imodal-frame')).getAttribute('src')).to.eventually.contain(serverURL +
        requiredPath + '/new', 'Открытый фрейм не является фреймом, для создания объекта');
      browser.switchTo().frame('imodal');
      expect(element(by.css('#imodal h3')).getText()).to.eventually.contain(requiredTitle,
        'Заголовок фрейма создания объекта неверный');
    });
  },
  /**
   * Функция проверки нажатия кнопки сохранения нового объекта
   */
  saveButtonClick: function () {
    expect(element(by.css('#imodal .panel-heading .SAVE')).isPresent()).to.eventually.equal(true,
      'Не отображается кнопка сохранения после открытия фрейма объекта');
    element(by.css('#imodal .panel-heading .SAVE')).click();
  },
  /**
   * Функция проверки отображения ошибок заполнения полей, обязательных к заполнению
   * @param {Array} attrList - массив со списком полей, обязательных к заполнению, у которых ожидается появление ошибки
   */
  checkErrorMessageShown: function (attrList) {
    expect(element(by.id('message-callout')).isDisplayed()).to.eventually.equal(true,
      'Сообщение об ошибке не отображается');
    expect(element(by.css('#message-callout p')).getText()).to.eventually.equal(formErrorMessage,
      'Неверное сообщение об ошибке');
    checkRequiredAttrError(attrList);
  },
  /**
   * Функция проверки заполнения поля типа Строка
   */
  stringAttrFill: function () {
    fillAttrField('a_develop-and-test_required_required_string', randomString);
  },
  /**
   * Функция проверки нажатия кнопки Сохранить и закрыть
   */
  saveAndCloseButtonClick: function () {
    expect(element(by.css('#imodal .panel-heading .SAVE')).isPresent()).to.eventually.equal(true,
      'Не отображается кнопка сохранения после открытия фрейма объекта');
    element(by.css('#imodal .panel-heading .SAVEANDCLOSE')).click();
  },
  /**
   * Функция проверки заполнения поля типа Действительное
   */
  realAttrFill: function () {
    fillAttrField('a_develop-and-test_required_required_real', randomReal);
  },
  /**
   * Функция заполнения поля типа Дата-время
   */
  dateTimeAttrFill: function () {
    fillAttrField('a_develop-and-test_required_required_datatime', '');
  },
  /**
   * Функция проверки отсутствия сообщений об ошибке
   */
  checkErrorMessageHide: function () {
    browser.switchTo().defaultContent();
    browser.switchTo().frame('imodal');
    browser.wait(EC.invisibilityOf(element(by.id('message-callout'))), browser.params.waitElementLoad,
      'Сообщение об ошибке отображается');
    checkRequiredAttrError([]);
    browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_required_id'))), browser.params.waitElementLoad,
      'Поле идентификатора не отображается на странице');
    element(by.id('a_develop-and-test_required_id')).getAttribute('value').then(function (idText) {
      createdElementId = idText;
      expect(idText.length).to.not.equal(0, 'Поле идентификатора не заполнено');
    });
  },
  /**
   * Функция проверки нажатия кнопки закрытия фрейма создания объекта
   */
  closeButtonClick: function () {
    expect(element(by.buttonText('Закрыть')).isPresent()).to.eventually.equal(true,
      'Не отображается кнопка закрытия фрейма объекта');
    element(by.buttonText('Закрыть')).click();
    browser.switchTo().defaultContent();
  },
  /**
   * Функция проверки выбора из списка объекта, созданного в процессе тестирования
   */
  selectCreatedObject: function () {
    element.all(by.css('#content div.dataTables_scrollBody tbody tr')).all(by.css('td')).getText()
      .filter(function (tdElement, index) {
        return element.all(by.css('#content div.dataTables_scrollBody tbody tr')).get(0).all(by.css('td')).count()
          .then(function (tdCountInTr) {
            return index % tdCountInTr === 0;
          });
      }).map(function (elem) {
      return elem.getText();
    }).then(function (objectList) {
      expect(objectList.indexOf(createdElementId)).to.not.equal(-1, 'Созданного элемента нет в списке');
      element.all(by.css('#content div.dataTables_scrollBody tbody tr')).get(objectList.indexOf(createdElementId))
        .click().then(function () {
        element.all(by.css('#content div.dataTables_scrollBody tbody tr')).each(function (tr, index) {
          if (index === objectList.indexOf(createdElementId)) {
            expect(tr.getAttribute('class')).to.eventually.contain('selected', 'Не выбран верный элемент №' + index);
          } else {
            expect(tr.getAttribute('class')).to.eventually.not.contain('selected', 'Выбран неверный элемент №' + index);
          }
        });
      });
    });
  },
  /**
   * Функция проверки нажатия кнопки удаления объекта
   */
  deleteButtonClick: function () {
    expect(element(by.buttonText('Удалить')).isDisplayed()).to.eventually.equal(true,
      'Кнопка "Удалить" не отображается после выбора элемента');
    element(by.buttonText('Удалить')).click().then(function () {
      browser.wait(EC.alertIsPresent(), browser.params.waitElementLoad);
      browser.switchTo().alert().accept();
      browser.switchTo().defaultContent();
    });
  },
  /**
   * Функция проверки отсутствия в списке объекта, созданного в процессе тестирования
   */
  checkObjectNotInList: function () {
    browser.switchTo().defaultContent();
    browser.wait(EC.visibilityOf(element(by.css('tbody'))), browser.params.waitElementLoad,
      'Не удалось загрузить список объектов');
    element.all(by.css('#content div.dataTables_scrollBody tbody tr')).all(by.css('td')).getText()
      .filter(function (tdElement, index) {
        return element.all(by.css('#content div.dataTables_scrollBody tbody tr')).get(0).all(by.css('td')).count()
          .then(function (tdCountInTr) {
            return index % tdCountInTr === 0;
          });
      }).map(function (elem) {
      return elem.getText();
    }).then(function (objectList) {
      expect(objectList.indexOf(createdElementId)).to.equal(-1, 'Созданный элемент есть в списке после удаления');
    });
  }
};

/**
 * Функция проверки наличия ошибки заполнения у пустых полей, обязательных к заполнению, и отсутствия ошибок
 * у заполненных полей и пустых полей не обязательных к заполнению
 * @param {Array} attrList - массив со списком полей, обяательных к заполнению, у которых ожидается появление ошибки
 */
function checkRequiredAttrError(attrList) {
  element.all(by.css('#imodal div.form-group')).each(function (formGroup) {
    formGroup.getAttribute('class').then(function (classText) {
      formGroup.$('label').getText().then(function (attrName) {
        if (classText.indexOf('required') !== -1) {
          formGroup.$('input').getAttribute('id').then(function (property) {
            if (attrList.some(function (item) {
                return property.indexOf('required_' + item) !== -1;
              })) {
              expect(formGroup.$('p.error-block').isDisplayed()).to.eventually.equal(true,
                'Одно из пустых обязательных к заполнению полей ' + attrName + ' не содержит ошибки');
              expect(formGroup.$('p.error-block').getText()).to.eventually.equal(attrErrorMessage,
                'Неверный текст ошибки у одного из аттрибутов ' + attrName + ' обязательных к заполнению');
            } else {
              expect(formGroup.$('p.error-block').isDisplayed()).to.eventually.equal(false,
                'Одно из заполненных обязательных к заполнению полей ' + attrName + ' содержит ошибку');
            }
          });
        } else {
          expect(formGroup.$('p.error-block').isDisplayed()).to.eventually.equal(false,
            'Одно из необязательных к заполнению полей ' + attrName + ' содержит ошибку');
        }
      });
    });
  });
}

/**
 * Функция проверки заполнения поля объекта
 * @param {String} id - id поля, которое нужно заполнить, в структуре вэб страницы
 * @param {String} keys - значение, которое необходимо внести в поле
 */
function fillAttrField(id, keys) {
  browser.actions()
    .mouseMove(element(by.id(id))).click()
    .sendKeys(keys)
    .perform();
}
