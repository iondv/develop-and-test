/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 25.01.2018.
 */
/* globals browser, expect, protractor, element, by */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'),
  require('../../util/iterance'));
const crypto = require('crypto');
let deploy = require('../../../../deploy.json');
let listSearchDelay = parseInt(deploy.modules.registry.globals.listSearchDelay) || 0;
let listSearchMinLength = deploy.listSearchMinLength;

function checkResult(result, standard) {
  if(result.length !== standard.length) {
    return false;
  }
  let equal = true;
  let hasValue = false;
  for(let i = 0; i<standard.length; i++){
    for(let j = 0; j<result.length; j++){
      if(result[j].indexOf(standard[i]) !== -1) {
        hasValue = true;
        break;
      }
    }
    equal = equal && hasValue;
    if(!equal) {
      break;
    }
    hasValue = false;
  }
  return equal;
}

let simpleValue = ['spruce', 'carrot'];
let simpleStandard = [
  ['2899e930-2b55-11e8-843b-214e4370463e'],
  ['2e07d580-2b55-11e8-843b-214e4370463e']
];
let simpleAll =   ['2656fe10-2b55-11e8-843b-214e4370463e',
  '2899e930-2b55-11e8-843b-214e4370463e',
  '2e07d580-2b55-11e8-843b-214e4370463e'];
let refValue = ['Pavel', 'Innokenty'];
let refStandard = [['0890c500-2b55-11e8-843b-214e4370463e'],
  ['0c679690-2b55-11e8-843b-214e4370463e']];
let manyValue = ['do', 'do fa', 'do fa sol'];
let manyStandard = [
  [
  'c2ed74c0-2b50-11e8-843b-214e4370463e',
  'c79970a0-2b50-11e8-843b-214e4370463e',
  '3e89e550-2b51-11e8-843b-214e4370463e',
  '89e24460-2b52-11e8-843b-214e4370463e',
  '83ff80c0-2b53-11e8-843b-214e4370463e',
  'a1f26f20-2b53-11e8-843b-214e4370463e'
],
  [ 'c79970a0-2b50-11e8-843b-214e4370463e',
    '3e89e550-2b51-11e8-843b-214e4370463e',
    '89e24460-2b52-11e8-843b-214e4370463e'],
  ['89e24460-2b52-11e8-843b-214e4370463e']
];
let textValue = ['virture', 'drugstore', 'oak'];
let textStandard = [['591317a0-2b58-11e8-843b-214e4370463e'],
  ['4fd5fae0-2b58-11e8-843b-214e4370463e'],
  ['6ee555c0-2b58-11e8-843b-214e4370463e']];

describe('Проверка работы системы поиска', function (){
  describe('Проверка функциональности поиска и проверка объекта "Поиск по обычным полям"', function (){
    before(()=>{
      browser.get(browser.params.serverURL + '/registry/develop-and-test@search_simple');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@search_simple'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    it('Проверяем поиск без нажатия ENTER по истечению времени', async () => {
      await you.enterTextInField(simpleValue[0], 'top-search');
      await browser.sleep(listSearchDelay+1000);
      let result = await you.getTablePage();
      expect(checkResult(result, simpleStandard[0])).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
        'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + simpleStandard[0]);
    });
    it('Проверяем поиск по случайному значению', async () => {
      let value = crypto.randomBytes(8).toString('hex');
      await you.enterTextInField(value, 'top-search');
      await browser.actions()
        .sendKeys(protractor.Key.ENTER)
        .perform();
      let result = await you.getTablePage();
      expect(checkResult(result, [''])).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
        'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + simpleAll.join('\n'));
    });
    it('Проверяем поиск меньшего числа символов, чем указано в deploy', async () => {
      let value = 'ёж';
      await you.enterTextInField(value, 'top-search');
      await browser.actions()
        .sendKeys(protractor.Key.ENTER)
        .perform();
      let result = await you.getTablePage();
      expect(checkResult(result, simpleAll)).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
        'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + simpleAll.join('\n'));
    });
    for (let i = 0; i < simpleValue.length; i++) {
      it('Проверяем поиск вводим значение ' + simpleValue[i], async function() {
        await you.enterTextInField(simpleValue[i], 'top-search');
        await browser.actions()
          .sendKeys(protractor.Key.ENTER)
          .perform();
        let result = await you.getTablePage();
        expect(checkResult(result, simpleStandard[i])).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
          'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + simpleStandard[i].join('\n'));
      });
    }
  });
  //TODO https://ion-dv.atlassian.net/browse/IONCORE-407
  describe('Проверка объекта "Поиск по нескольким полям"', function (){
    before(()=>{
      browser.get(browser.params.serverURL + '/registry/develop-and-test@search_many');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@search_many'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    it('Проверяем поиск, вводим значения', async () => {
      for (let i = 0; i < manyValue.length; i++) {
        await you.enterTextInField(manyValue[i], 'top-search');
        await browser.actions()
          .sendKeys(protractor.Key.ENTER)
          .perform();
        let result = await you.getTablePage();
        expect(checkResult(result, manyStandard[i])).to.be.equal(true, 'Поисковая выдача для значения "'
          + manyValue[i] +'" не совпадает с эталоном.' +
          'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + manyStandard[i].join('\n'));
      }
    });
  });
  describe('Проверка объекта "Поиск по ссылочным атрибутам"', function (){
    before(()=>{
      browser.get(browser.params.serverURL + '/registry/develop-and-test@search_ref');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@search_ref'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    for (let i = 0; i < refValue.length; i++) {
      it('Проверяем поиск вводим значение ' + refValue[i], async () => {
        await you.enterTextInField(refValue[i], 'top-search');
        await browser.actions()
          .sendKeys(protractor.Key.ENTER)
          .perform();
        let result = await you.getTablePage();
        expect(checkResult(result, refStandard[i])).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
          'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + refStandard[i].join('\n'));
      });
    }
  });
  describe('Проверка объекта "Поиск в тексте"', function (){
    before(()=>{
      browser.get(browser.params.serverURL + '/registry/develop-and-test@search_text');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@search_text'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
    });
    for (let i = 0; i < textValue.length; i++) {
      it('Проверяем поиск вводим значение ' + textValue[i], async () => {
        await you.enterTextInField(textValue[i], 'top-search');
        await browser.actions()
          .sendKeys(protractor.Key.ENTER)
          .perform();
        let result = await you.getTablePage();
        expect(checkResult(result, textStandard[i])).to.be.equal(true, 'Поисковая выдача не совпадает с эталоном.' +
          'Найдено \n' + result.join('\n') + '\n должны быть элементы с id  \n' + textStandard[i].join('\n'));
      });
    }
  });
});
