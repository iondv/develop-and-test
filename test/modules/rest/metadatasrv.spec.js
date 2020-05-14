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

describe('checking metadata service', () => {
  before(async () => {
    req = Object.assign({}, BASE_REQUEST, {
      uri: BASE_REQUEST.uri + 'token',
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
    });
    res = await request(req);
    authToken = res.body;
    BASE_REQUEST.headers = {'auth-token': authToken}
  });
  describe('# accessing the list of metadata classes: listMeta', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/listMeta');
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Array, true);
      assert.notEqual(res.body.length, 0);
    })
  });
  describe('# accessing the list of metadata classes filtering by ancestor: listMeta', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/listMeta?ancestor=basicObj@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        console.log(e);
        throw e;
      }
      assert.equal(res.statusCode, 200);
      assert.equal(res.body instanceof Array, true);
      assert.notEqual(res.body.length, 0);
    })
  });
  describe('# accessing info about metadata class: getMeta', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getMeta/class_text@develop-and-test?class_text="1"');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(typeof res, 'object');
      assert.notEqual(res.namespace, undefined);
    })
  });
  describe('# accessing info about class ancestor', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/ancestor/event@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.notEqual(res, undefined);
      assert.ok(res.namespace);
    })
  });
  describe('# accessing info about meta object properties: propertyMetas', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/propertyMetas/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Array, true);
      assert.notEqual(res.length, 0);
    })
  });
  describe('# accessing the list of navigation sections: getNavigationSections', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getNavigationSections');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.classProperties);
    })
  });
  describe('# access info about a navigation section: getNavigationSection', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getNavigationSection/develop-and-test@simpleTypes');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.name);
    })
  });
  describe('# access info about a navigation node: getNode', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getNode/develop-and-test@semantic');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.code);
    })
  });
  describe('# access the list of navigation nodes in a section: getNodes', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getNodes/develop-and-test@simpleTypes');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Array, true);
      assert.notEqual(res.length, 0);
    })
  });
  describe('# access meta class list view model: getListViewModel', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getListViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.columns);
    })
  });
  describe('# access meta class collection view model: getCollectionViewModel', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getCollectionViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.commands);
    })
  });
  describe('# access meta class item view model: getItemViewModel', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getItemViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.tabs);
    })
  });
  describe('# access meta class creation view model: getCreationViewModel', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getCreationViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.commands);
    })
  });
  describe('# access meta class detail view model: getDetailViewModel', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getDetailViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.commands);
    })
  });
  describe('# accessing the list of possible workflows for meta class: getWorkflows', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getWorkflows/workflowBase@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Array, true);
      assert.notEqual(res.length, 0);
    })
  });
  describe('# access meta class view model in a certain workflow state: getWorkflowView', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getWorkflowView/workflowBase@develop-and-test/simpleWorkflow@develop-and-test/canStart');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.commands);
    })
  });
  describe('# access information about workflow: getWorkflow', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getWorkflow/workflowBase@develop-and-test/simpleWorkflow@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
      assert.ok(res.states);
    })
  });
  describe('# access information about view mask: getMask', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getMask/mask@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Object, true);
    })
  });
  describe('# access information about input validators: getValidators', async ()=>{
    it('making a request', async () => {
      req = moduri('meta/getValidators');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      assert.equal(res.statusCode, 200);
      res = res.body;
      assert.equal(res instanceof Array, true);
      assert.notEqual(res.length, 0);
    })
  });
})