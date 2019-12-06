const assert = require('assert');
const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

describe('Проверяем сервис acceptor', function() {
  let giventoken;
  let headersgiventoken;
  let genwsgiventoken;
  describe('# baseAuth authorization with admin rights', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'POST', headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword, 'Content-Type': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/acceptor`,
//        auth: {username: adminUsername, password: adminPassword},
        _id: `10101010-5583-11e6-aef7-cf50314f026b`,
        _class: `class_string@develop-and-test`,
        _classVer: null,
        string_text: "Example10",
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      };
    });
    it('делаем запрос, статус должен быть 200', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 200);
    });
//    it('проверяем ответ на соответствие токену', async function() {
//      assert.ok(res.body, 'ожидаем атрибут body');
//      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
//      assert.strictEqual(res.body.length, 40, 'длина токена не равна 40');
//      giventoken = res.body;
//    });
  });
});