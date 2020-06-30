const assert = require('assert');
const {serverURL} = require('./config.js');
const request = require('request-promise-native');

const reqOptions = {
  method: 'GET',
  url: `${serverURL}/rest/echo`,
  headers: {
    'Accept': 'application/json'
  },
  json: true
};


describe('Checking echo service', function() {
  describe('# check if the response is valid on a valid request', function() {
    let resRequest;
    it('check if the request with no auth passes', async function() {
      resRequest = await request(reqOptions)
        .catch();
    });
    it('expecting an object type in the response', function() {
      assert.strictEqual(typeof resRequest, 'object');
    });
    it('expecting field "echo" containing "peekaboo"', function() {
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
  });
  describe('# check if the response is valid on wrong request options ', function() {
    it('check if the request can be made with auth', async function() {
      reqOptions.auth = {username: 'login', password: 'pswd'};
      const resRequest = await request(reqOptions)
        .catch();
      delete reqOptions.auth;
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
    it('check if the request can be made with Accept = plain/text in the headers', async function() {
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

//запросы не json