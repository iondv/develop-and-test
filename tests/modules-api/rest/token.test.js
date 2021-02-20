const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

describe('Checking token service', function() {
  let giventoken;
  let headersgiventoken;
  let genwsgiventoken;

  describe('# basicAuth authorization with admin rights', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(200);
    });
    it('check if the response indeed contains a token', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).toEqual(40);
    });

    describe('# check if the generated token is valid (basicAuth) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET',
          url: `${serverURL}/rest/echo-token`,
          headers: {
            'Accept': 'application/json',
            'auth-token': giventoken
          },
          json: true
        };
        const res = await request(reqOptions);
        expect(res.echo).toEqual('peekaboo');
      });
    });
  });

  describe('# basicAuth authorization using a non existent user', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(403);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# basicAuth authorization using a wrong password', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(401);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# authorization with admin rights using header parameters', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(200);
    });
    it('check if the response indeed contains a token', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).toEqual(40);
    });
    describe('# check if the generated token is valid (header parameters auth) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET',
          url: `${serverURL}/rest/echo-token`,
          headers: {
            'Accept': 'application/json',
            'auth-token': headersgiventoken
          },
          json: true
        };
        const res = await request(reqOptions);
        expect(res.echo).toEqual('peekaboo');
      });
    });
  });

  describe('# authorization using header parameters with a non existent user', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(403);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# authorization using header parameters with a wrong password', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(401);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# getting a token with regular rights (without the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(403);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# getting a token with regular rights (with the right to use ws::gen-ws-token)', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(200);
    });
    it('check if the response indeed contains a token', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).toEqual(40);
    });
    describe('# check if the generated token is valid (genws use rights) (using echo-token)', function () {
      it('authorization by token is passed', async function () {
        const reqOptions = {
          method: 'GET',
          url: `${serverURL}/rest/echo-token`,
          headers: {
            'Accept': 'application/json',
            'auth-token': genwsgiventoken
          },
          json: true
        };
        const res = await request(reqOptions);
        expect(res.echo).toEqual('peekaboo');
      });
    });
  });

  describe('# try to get a token with no authorization', function() {
    let reqOptions;
    let res;
    beforeAll(async function () {
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
      expect(res.statusCode).toEqual(401);
    });
    it('no token should be returned', function () {
      expect(res.body).toBeTruthy();
      expect(res.body).toMatch(/^[a-z0-9]*$/);
      expect(res.body.length).not.toEqual(40);
    });
  });

  describe('# check if auth is not passed with a random token (using echo-token)', function() {
    it('statusCode has to be 403', async function () {
      const reqOptions = {
        method: 'GET',
        url: `${serverURL}/rest/echo-token`,
        headers: {
          'Accept': 'application/json',
          'auth-token': '123hi1uifhdiuoisjo1sijnsdfhh342456jieopq'
        },
        json: true
      };
      let res;
      try {
        res = await request(reqOptions);
      } catch (e) {
        res = e.response;
      }
      expect(res.statusCode).toEqual(403);
    });
  });
  describe('# checking echo-token service', function() {
    describe('## check if auth is not passed using basicAuth when token authMode is defined', function () {
      it('statusCode has to be 401 for header auth request', async function () {
        const reqOptions = {
          method: 'GET',
          url: `${serverURL}/rest/echo-token`,
          headers: {
            'Accept': 'application/json',
            'auth-user': adminUsername, 'auth-pwd': adminPassword
          },
          json: true
        };
        let res;
        try {
          res = await request(reqOptions);
        } catch (e) {
          res = e.response;
        }
        expect(res.echo).not.toEqual('peekaboo');
        expect(res.statusCode).toEqual(401);
      });
      it('statusCode has to be 401 for basicAuth request', async function () {
        const reqOptions = {
          method: 'GET',
          url: `${serverURL}/rest/echo-token`,
          headers: {'Accept': 'application/json'},
          auth: {username: adminUsername, password: adminPassword},
          json: true
        };
        let res;
        try {
          res = await request(reqOptions);
        } catch (e) {
          res = e.response;
        }
        expect(res.echo).not.toEqual('peekaboo');
        expect(res.statusCode).toEqual(401);
      });
    });
  });
});