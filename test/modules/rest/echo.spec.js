const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js')
const request = require('request-promise-native');

const reqOptions = {
  method: 'GET',
  url: `${serverURL}/rest/echo`,
  headers: {
    'Accept': 'application/json'
  },
  json: true
};


describe('Проверяем сервис echo', function() {
  describe('# отработка правильных параметров запроса', function() {
    let resRequest;
    it('проверка что осуществляется запрос без авторизации', async function() {
      resRequest = await request(reqOptions)
        .catch();
    });
    it('ожидаем тип объект у результата запроса', function() {
      assert.strictEqual(typeof resRequest, 'object');
    });
    it('ожидаем значение свойства echo "peekaboo"', function() {
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
  });
  describe('# отработка ошибочных параметров запроса ', function() {
    it('проверка что осуществляется запрос с авторизацией', async function() {
      reqOptions.auth = {username: 'login', password: 'pswd'};
      const resRequest = await request(reqOptions)
        .catch();
      delete reqOptions.auth;
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
    it('проверка что осуществляется запрос с accept = plain/text', async function() {
      reqOptions.headers['Accept'] = 'plain/text';
      const resRequest = await request(reqOptions)
        .catch();
      reqOptions.headers['Accept'] = 'application/json';
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
  });
  describe.skip('# отработка злонамеренных параметров запроса ', function() {
  });
});