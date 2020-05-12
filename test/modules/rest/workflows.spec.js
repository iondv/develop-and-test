const assert = require('assert');
const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword} = require('./config.js');

let BASE_REQUEST = {
  method: 'GET', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/`,
  headers: {}
};

const moduri = function(newuri) {
  return Object.assign({}, BASE_REQUEST, {
    uri: BASE_REQUEST.uri + newuri
  })
}

let authToken = '';

describe('checking workflows service', () => {
  before(async () => {
    req = Object.assign({}, BASE_REQUEST, {
      uri: BASE_REQUEST.uri + 'token',
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
    });
    res = await request(req);
    authToken = res.body;
    BASE_REQUEST.headers = {'auth-token': authToken}
  });
  describe('# accessing workflow statuses of the object: GET', async () => {
    it('making a request', async () => {
      req = moduri('workflows/workflowBase@develop-and-test/1');
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Object, true);
    })
  });
  describe('# move the object through workflow: PUT, list body', async () => {
    it('making a request', async () => {
      req = moduri('workflows/workflowBase@develop-and-test/1');
      req = Object.assign({}, req, {method: 'PUT', body:
          [
            'simpleWorkflow@develop-and-test.startCheck',
            'simpleWorkflow@develop-and-test.accept'
          ]
        });
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Array, true);
    })
  });
  describe('# move the object through workflow: PUT, object body', async () => {
    it('making a request', async () => {
      req = moduri('workflows/workflowBase@develop-and-test/1');
      req = Object.assign({}, req, {method: 'PUT', body: {
          'simpleWorkflow@develop-and-test': [
            'startCheck',
            'accept'
          ]
        }});
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Array, true);
    })
  });
  describe('# move the object to certain state in a workflow: PATCH', async () => {
    it('making a request', async () => {
      req = moduri('workflows/workflowBase@develop-and-test/1');
      req = Object.assign({}, req, {method: 'PATCH', body: [
          'simpleWorkflow@develop-and-test.canStart'
        ]});
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Array, true);
    })
  });
});