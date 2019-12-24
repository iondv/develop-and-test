const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;

describe('Проверяем сервис echo-oauth', function() {
  let cookie = ['ololo'];
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
    describe('# Requesting echo-oauth GET', function () {
      describe('check if the request can be made using the oauth cookie', function () {
        let resRequest;
        before(async function () {
          try {
            resRequest = await request({
              method: 'GET',
              uri: `${serverURL}/rest/echo-oauth`,
              resolveWithFullResponse: true,
              json: true,
              headers: {cookie: cookie}
            });
          } catch (e) {
            resRequest = e.response;
          }
        });

        it('ожидаем отказ в доступе', function () {
          assert.strictEqual(resRequest.statusCode, 403);
        });

        /*

         TODO: Не очень понятно почему вы тут ожидаете ответ, если не выполняете аутентификацию по OAuth в первом запросе
         TODO: И вообще при чем тут куки? :)

         it('ожидаем тип объект у результата запроса', function() {
         assert.strictEqual(typeof resRequest.body, 'object');
         });
         it('ожидаем значение свойства echo "peekaboo"', function() {
         assert.strictEqual(resRequest.body.echo, 'peekaboo');
         });
         */
      });
    });
    describe('# Requesting echo-oauth GET with the modified cookie', function () {
      describe('# check if the request can be made using the oauth cookie with a wrong sid', function () {
        let resRequest;
        cookie[0] = cookie[0].slice(0, 15) + cryptoRandom(5).toString('hex') + cookie[0].slice(25);
        before(async function () {
          try {
            resRequest = await request({
              method: 'GET',
              uri: `${serverURL}/rest/echo-oauth`,
              resolveWithFullResponse: true,
              json: true,
              headers: {Cookie: cookie}
            });
          } catch (e) {
            resRequest = e.response;
          }
        });
        it('statusCode expected to be 403 (Access denied)', function () {
          assert.strictEqual(resRequest.statusCode, 403);
        });
        it('the response should not contain echo "peekaboo"', function () {
          assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
        });
      });
    });
  });
  describe('# Requesting echo-oauth GET without the cookie', function() {
    describe('check if the request can be made without a cookie', function () {
      let resRequest;
      before(async function () {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-oauth`,
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('statusCode expected to be 403 (Access denied)', function () {
        assert.strictEqual(resRequest.statusCode, 403);
      });
      it('the response should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      });
    });
  });
});