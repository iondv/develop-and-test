const request = require('request-promise-native');
const {serverURL, adminUsername, adminPassword} = require('../../config.js');

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
  let res;
  beforeAll(async () => {
    const req = Object.assign({}, BASE_REQUEST, {
      uri: BASE_REQUEST.uri + 'token',
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
    });
    res = await request(req);
    authToken = res.body;
    BASE_REQUEST.headers = {'auth-token': authToken}
  });
  describe('# accessing the list of metadata classes: listMeta', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/listMeta');
      try {
        res = await request(req);
      } catch (e) {
        throw e;
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).not.toEqual(0);
    })
  });
  describe('# accessing the list of metadata classes filtering by ancestor: listMeta', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/listMeta?ancestor=basicObj@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        throw e;
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).not.toEqual(0);
    })
  });
  describe('# accessing info about metadata class: getMeta', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getMeta/class_text@develop-and-test?class_text="1"');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(typeof res).toEqual('object');
      expect(res).not.toBeNull();
      expect(res.namespace).toBeDefined();
    })
  });
  describe('# accessing info about class ancestor', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/ancestor/event@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeDefined();
      expect(res.namespace).toBeTruthy();
    })
  });
  describe('# accessing info about meta object properties: propertyMetas', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/propertyMetas/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Array);
      expect(res.length).not.toEqual(0);
    })
  });
  describe('# accessing the list of navigation sections: getNavigationSections', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getNavigationSections');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.classProperties).toBeTruthy();
    })
  });
  describe('# access info about a navigation section: getNavigationSection', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getNavigationSection/develop-and-test@simpleTypes');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.name).toBeTruthy();
    })
  });
  describe('# access info about a navigation node: getNode', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getNode/develop-and-test@semantic');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.code).toBeTruthy();
    })
  });
  describe('# access the list of navigation nodes in a section: getNodes', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getNodes/develop-and-test@simpleTypes');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Array);
      expect(res.length).not.toEqual(0);
    })
  });
  describe('# access meta class list view model: getListViewModel', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getListViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.columns).toBeTruthy();
    })
  });
  describe('# access meta class collection view model: getCollectionViewModel', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getCollectionViewModel/coll_container@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.commands).toBeTruthy();
    })
  });
  describe('# access meta class item view model: getItemViewModel', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getItemViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.tabs).toBeTruthy();
    })
  });
  describe('# access meta class creation view model: getCreationViewModel', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getCreationViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.commands).toBeTruthy();
    })
  });
  describe('# access meta class detail view model: getDetailViewModel', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getDetailViewModel/class_text@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.commands).toBeTruthy();
    })
  });
  describe('# accessing the list of possible workflows for meta class: getWorkflows', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getWorkflows/workflowBase@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Array);
      expect(res.length).not.toEqual(0);
    })
  });
  describe('# access meta class view model in a certain workflow state: getWorkflowView', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getWorkflowView/workflowBase@develop-and-test/simpleWorkflow@develop-and-test/canStart');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.commands).toBeTruthy();
    })
  });
  describe('# access information about workflow: getWorkflow', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getWorkflow/workflowBase@develop-and-test/simpleWorkflow@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
      expect(res.states).toBeTruthy();
    })
  });
  describe('# access information about view mask: getMask', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getMask/inputmask@develop-and-test');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Object);
    })
  });
  describe('# access information about input validators: getValidators', ()=>{
    let res;
    it('making a request', async () => {
      const req = moduri('meta/getValidators');
      try {
        res = await request(req);
      } catch (e) {
        res = e.response.body;
      }
      expect(res.statusCode).toEqual(200);
      res = res.body;
      expect(res).toBeInstanceOf(Array);
      expect(res.length).not.toEqual(0);
    })
  });
})