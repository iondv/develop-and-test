const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;

let cookie;

describe('Проверяем сервис echo-oauth', function() {
  describe('# Getting a cookie', function() {
    before(async function() {
      let res;
      try {
      res = await request({
        method: 'POST',
        uri: `${serverURL}/auth`,
        auth: {username: adminUsername, password: adminPassword},
        resolveWithFullResponse: true,
        json: true
      });
    } catch (e) {
        res = e.response;
      }
      cookie = res.headers['set-cookie'];
    });
    it('check if the cookie can be retrieved', function() {
      assert.ok(cookie);
    });
  });
  describe('# Requesting echo-oauth GET', function() {
    let resRequest;
    it('check if the request can be made using the oauth cookie', async function() {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-oauth`,
        resolveWithFullResponse: true,
        json: true,
        headers: {Cookie: cookie}
      })
        .catch();
        resRequest = resRequest.body;
    });
    it('ожидаем тип объект у результата запроса', function() {
      assert.strictEqual(typeof resRequest, 'object');
    });
    it('ожидаем значение свойства echo "peekaboo"', function() {
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
  });
  describe('# Requesting echo-oauth GET with the modified cookie', function() {
    let resRequest;
      it('check if the request can be made using the oauth cookie with a wrong sid', async function() {
      cookie[0] = cookie[0].slice(0, 15) + cryptoRandom(5).toString('hex') + cookie[0].slice(25);
      try {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-oauth`,
        resolveWithFullResponse: true,
        json: true,
        headers: {Cookie: cookie}
      })
        .catch();
      } catch (e) {
          resRequest = e.response;
        }
    });
    it('statusCode expected to be 401 (Unauthorized)', function() {
      assert.strictEqual(resRequest.statusCode,401);
    });
    it('the response should not contain echo "peekaboo"', function() {
      assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
    });
  });
  describe('# Requesting echo-oauth GET without the cookie', function() {
    let resRequest;
      it('check if the request can be made without a cookie', async function() {
      try {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-oauth`,
        resolveWithFullResponse: true,
        json: true
      })
        .catch();
      } catch (e) {
          resRequest = e.response;
        }
    });
    it('statusCode expected to be 401 (Unauthorized)', function() {
      assert.strictEqual(resRequest.statusCode,401);
    });
    it('the response should not contain echo "peekaboo"', function() {
      assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
    });
  });
});