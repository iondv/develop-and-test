const assert = require('assert');
const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

describe('Проверяем сервис token', function() {
  let giventoken;
  let headersgiventoken;
  let genwsgiventoken;
  describe('# baseAuth authorization with admin rights', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: adminUsername, password: adminPassword}
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
    it('проверяем ответ на соответствие токену', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.strictEqual(res.body.length, 40, 'длина токена не равна 40');
      giventoken = res.body;
    });
  });
  describe('# baseAuth authorization using a non existent user', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: '123nouser321', password: adminPassword}
      };
    });
    it('statusCode has to be 403', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 403);
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# baseAuth authorization using a wrong password', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: adminUsername, password: '1234'}
      };
    });
    it('statusCode has to be 500 (Internal Server Error)', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 500);
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# authorization with admin rights using header parameters', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
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
    it('проверяем ответ на соответствие токену', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.strictEqual(res.body.length, 40, 'длина токена не равна 40');
      headersgiventoken = res.body;
    });
  });
  describe('# authorization using header parameters with non existent user', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': '123nouser321', 'auth-pwd': adminPassword}
      };
    });
    it('statusCode has to be 403', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 403);
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# authorization using header parameters with a wrong password', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': adminUsername, 'auth-pwd': '1234'}
      };
    });
    it('statusCode has to be 500 (Internal Server Error)', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 500);
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# getting a token with regular rights (without the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: anyUsername, password: anyPassword}
      };
    });
    it('statusCode has to be 403', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 403, 'Если прав на ws::gen-ws-token, то должен выдавать код 403');
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# getting a token with regular rights (with the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: genwsUsername, password: genwsPassword}
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
    it('проверяем ответ на соответствие токену', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.strictEqual(res.body.length, 40, 'длина токена не равна 40');
      genwsgiventoken = res.body;
    });
  });
  describe('# try to get a token with no authorization', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`
      };
    });
    it('statusCode has to be 401 (Unauthorized)', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 401);
    });
    it('no token should be returned', async function() {
      assert.ok(res.body, 'ожидаем атрибут body');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1, 'есть другие символы кроме нижнего регистра и цифр');
      assert.notEqual(res.body.length, 40, 'длина токена не равна 40');
    });
  });
  describe('# check if the generated token is valid (baseAuth) (using echo-token)', function() {
    let reqOptions;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'},
        url: `${serverURL}/rest/echo-token`,
        headers: {'auth-token': giventoken},
        json: true
      };
    });
    it('authorization by token is passed', async function() {
        const res = await request(reqOptions)
          .catch();
        assert.strictEqual(res.echo, 'peekaboo');
    });
  });
  describe('# check if the generated token is valid (header parameters auth) (using echo-token)', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'},
        url: `${serverURL}/rest/echo-token`,
        headers: {'auth-token': headersgiventoken},
        json: true
      };
    });
    it('authorization by token is passed', async function() {
        const res = await request(reqOptions)
          .catch();
        assert.strictEqual(res.echo, 'peekaboo');
    });
  });
  describe('# check if the generated token is valid (genws use rights) (using echo-token)', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'},
        url: `${serverURL}/rest/echo-token`,
        headers: {'auth-token': genwsgiventoken},
        json: true
      };
    });
    it('authorization by token is passed', async function() {
    const res = await request(reqOptions)
        .catch();
      assert.strictEqual(res.echo, 'peekaboo');
    });
  });
  describe('# check if a random token is not passing the authorization (using echo-token)', function() {
    let reqOptions;
    let res;
    before(function() {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'},
        url: `${serverURL}/rest/echo-token`,
        headers: {'auth-token': '123hi1uifhdiuoisjo1sijnsdfhh342456jieopq'},
        json: true
      };
    });
    it('statusCode has to be 403', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 403);
    });
  });
});