const assert = require('assert');
const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

describe('Checking token service', function() {
  let giventoken;
  let headersgiventoken;
  let genwsgiventoken;

  describe('# baseAuth authorization with admin rights', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {
        method: 'GET',
        headers: {'Accept': 'application/json'},
        resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: adminUsername, password: adminPassword}
      };
      try {
        res = await request(reqOptions);
        giventoken = res.body;
      } catch (e) {
        res = e.response;
      }
    });
    it('making the request, statusCode has to be 200', function () {
      assert.strictEqual(res.statusCode, 200);
    });
    it('check if the response indeed contains a token', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'there are other symbols except lower case letters and numbers');
      assert.strictEqual(res.body.length, 40, 'the length of the token is not 40');
    });

    describe('# check if the generated token is valid (baseAuth) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET',
          headers: {'Accept': 'application/json'},
          url: `${serverURL}/rest/echo-token`,
          headers: {'auth-token': giventoken},
          json: true
        };
        const res = await request(reqOptions);
        assert.strictEqual(res.echo, 'peekaboo');
      });
    });
  });

  describe('# baseAuth authorization using a non existent user', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {
        method: 'GET',
        headers: {'Accept': 'application/json'},
        resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: '123nouser321', password: adminPassword}
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 401', function () {
      assert.strictEqual(res.statusCode, 403);
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# baseAuth authorization using a wrong password', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {
        method: 'GET',
        headers: {'Accept': 'application/json'},
        resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: adminUsername, password: '1234'}
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 401 (Unauthorized)', function () {
      assert.strictEqual(res.statusCode, 401);
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# authorization with admin rights using header parameters', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
      };
      try {
        res = await request(reqOptions);
        headersgiventoken = res.body;
      } catch (e) {
        res = e.response;
      }
    });
    it('making the request, statusCode has to be 200', function () {
      assert.strictEqual(res.statusCode, 200);
    });
    it('check if the response indeed contains a token', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'there are other symbols except lower case letters and numbers');
      assert.strictEqual(res.body.length, 40, 'the length of the token is not 40');
    });
    describe('# check if the generated token is valid (header parameters auth) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET', headers: {'Accept': 'application/json'},
          url: `${serverURL}/rest/echo-token`,
          headers: {'auth-token': headersgiventoken},
          json: true
        };
        const res = await request(reqOptions);
        assert.strictEqual(res.echo, 'peekaboo');
      });
    });
  });

  describe('# authorization using header parameters with a non existent user', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': '123nouser321', 'auth-pwd': adminPassword}
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 403', function () {
      assert.strictEqual(res.statusCode, 403);
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# authorization using header parameters with a wrong password', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        headers: {'auth-user': adminUsername, 'auth-pwd': '1234'}
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 401 (Unauthorized)', function () {
      assert.strictEqual(res.statusCode, 401);
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# getting a token with regular rights (without the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: anyUsername, password: anyPassword}
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 403', function () {
      assert.strictEqual(res.statusCode, 403, 'if no right to use ws::gen-ws-token the statusCode has to be 403');
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# getting a token with regular rights (with the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`,
        auth: {username: genwsUsername, password: genwsPassword}
      };
      try {
        res = await request(reqOptions);
        genwsgiventoken = res.body;
      } catch (e) {
        res = e.response;
      }
    });
    it('making the request, statusCode has to be 200', function () {
      assert.strictEqual(res.statusCode, 200);
    });
    it('check if the response indeed contains a token', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.strictEqual(res.body.search(/[^a-z0-9]/), -1, 'there are other symbols except lower case letters and numbers');
      assert.strictEqual(res.body.length, 40, 'the length of the token is not 40');
    });
    describe('# check if the generated token is valid (genws use rights) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET', headers: {'Accept': 'application/json'},
          url: `${serverURL}/rest/echo-token`,
          headers: {'auth-token': genwsgiventoken},
          json: true
        };
        const res = await request(reqOptions);
        assert.strictEqual(res.echo, 'peekaboo');
      });
    });
  });

  describe('# try to get a token with no authorization', function() {
    let reqOptions;
    let res;
    before(async function () {
      reqOptions = {method: 'GET', headers: {'Accept': 'application/json'}, resolveWithFullResponse: true,
        url: `${serverURL}/rest/token`
      };
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 401 (Unauthorized)', function () {
      assert.strictEqual(res.statusCode, 401);
    });
    it('no token should be returned', function () {
      assert.ok(res.body, 'awaiting field "body"');
      assert.notEqual(res.body.search(/[^a-z0-9]/), -1);
      assert.notEqual(res.body.length, 40);
    });
  });

  describe('# check if auth is not passed with a random token (using echo-token)', function() {
    it('statusCode has to be 403', async function () {
      const reqOptions = {
        method: 'GET', headers: {'Accept': 'application/json'},
        url: `${serverURL}/rest/echo-token`,
        headers: {'auth-token': '123hi1uifhdiuoisjo1sijnsdfhh342456jieopq'},
        json: true
      };
      let res;
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
      assert.strictEqual(res.statusCode, 403);
    });
  });
});