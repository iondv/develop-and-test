const assert = require('assert');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const {serverURL, adminUsername, adminPassword} = require('./config.js');

let  giventoken;
let tempId;
let tempTextObj;
let BASE_REQUEST = {
  method: 'GET', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/crud`,
  headers: {}};

modreq = function(props) {
  return Object.assign({},BASE_REQUEST,props)
}

  describe('Checking crud service', function() {
    before(async function() {
      giventoken = (await request({method: 'GET', resolveWithFullResponse: true,
      uri: `${serverURL}/rest/token`,
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
      })).body;
      BASE_REQUEST.headers['auth-token'] = giventoken;
      //console.log(giventoken);
    })
    describe('# check if the response for null parameters is valid', function() {
      it('statusCode has to be 404', async function() {
        try{
          res = await request(BASE_REQUEST)
        }
        catch(e){
          res = e.response;
        };
        assert.strictEqual(res.statusCode, 404);
      })
    });
    describe('# creating an object (POST)', function() {
      let res;
      const tempText = cryptoRandom(24).toString('hex');
      const reqId = cryptoRandom(24).toString('hex');
      let req = modreq({
      method: "POST",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/`,
      body: {
        id: reqId,
        text_text:`${tempText}1`,
        text_multilinetext:`${tempText}2`,
        text_formattext:`${tempText}3`
      }
    });
      req.headers['Content-Type'] = 'application/json';
      it('делаем запрос, статус должен быть 200', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        tempTextObj = res.body.id;
        //console.log(tempTextObj);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains the sent text object', async function(){
        assert.strictEqual(res.body.id,reqId);
        assert.strictEqual(res.body.text_text,`${tempText}1`);
        assert.strictEqual(res.body.text_multilinetext,`${tempText}2`);
        assert.strictEqual(res.body.text_formattext,`${tempText}3`);
      });
    });
    describe('# creating an object with the same ID as the previous (POST)', function() {
      let res;
      const tempText = cryptoRandom(24).toString('hex');
      const reqId = tempTextObj;
      let req = modreq({
      method: "POST",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/`,
      body: {
        id: reqId,
        text_text:`${tempText}1`,
        text_multilinetext:`${tempText}2`,
        text_formattext:`${tempText}3`
      }
    });
      req.headers['Content-Type'] = 'application/json';
      it('делаем запрос, статус должен быть 400', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 400);
      });
    });
    describe('# getting a list of text objects', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/`});
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        //console.log(res.body);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
    });
    describe('# getting a list of text objects, with an offset of 2 and a count of 2', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?_offset=2&_count=2`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
      it.skip('check if the response is indeed offset and count is 2');
    });
    describe('# getting a list of text objects containing text_text of "example1"', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?text_text=example1`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
      it.skip('check if the response only has objects with text_text containing "example1"');
    });
    describe('# getting a list of text objects with eager properties"', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?_eager=text_text`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        tempId = res.body[0].id;
        //console.log(res.body);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
      it.skip('check if the response only has eager properties"');
    });
    describe('# checking if an object is present (HEAD)', function() {
      let res;
      let req = modreq({method: `HEAD`,
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`})
      it('делаем запрос, статус должен быть 200', async function() {
        //console.log(tempId);
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
    });
    describe('# checking if the response is valid on invalid object check (HEAD)', function() {
      let res;
      let req = modreq({method: `HEAD`,
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${cryptoRandom(8).toString('hex')}`})
      it('делаем запрос, статус должен быть 404', async function() {
        try{
          res = await request(req);
        }
        catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 404);
      });
    });
    describe('# checking if the response is valid on invalid auth (HEAD)', function() {
      let res;
      let req = modreq({method: `HEAD`,
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId}`,
      headers: {'auth-token': cryptoRandom(8).toString('hex')}
    })
      it('делаем запрос, статус должен быть 403', async function() {
        try{
          res = await request(req);
        }
        catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 403);
      });
    });
    describe('# getting an object (GET)', function() {
      let res;
      let req = modreq({
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`})
      it('делаем запрос, статус должен быть 200', async function() {
        //console.log(tempId);
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
    });
    describe('# getting an object with eager properties (GET)', function() {
      let res;
      let req = modreq({
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}?_eager=text_text`})
      it('делаем запрос, статус должен быть 200', async function() {
        //console.log(tempId);
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the response contains any text objects');
    });
    describe('# checking if the response is valid on invalid object check (GET)', function() {
      let res;
      let req = modreq({
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${cryptoRandom(8).toString('hex')}`})
      it('делаем запрос, статус должен быть 404', async function() {
        try{
          res = await request(req);
        }
        catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 404);
      });
    });
    describe('# checking if the response is valid on invalid auth (GET)', function() {
      let res;
      let req = modreq({
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
      headers: {'auth-token': cryptoRandom(8).toString('hex')}
    })
      it('делаем запрос, статус должен быть 403', async function() {
        try{
          res = await request(req);
        }
        catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 403);
      });
    });
    describe('# updating an object (PATCH)', function() {
      let res;
      const tempText = cryptoRandom(24).toString('hex');
      const reqId = tempTextObj;
      let req = modreq({
      method: "PATCH",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
      body: {
        id: reqId,
        text_text:`${tempText}1`,
        text_multilinetext:`${tempText}2`,
        text_formattext:`${tempText}3`
      }
    });
      req.headers['Content-Type'] = 'application/json';
      it('делаем запрос, статус должен быть 200', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains the sent text object', async function(){
        assert.strictEqual(res.body.id,reqId);
        assert.strictEqual(res.body.text_text,`${tempText}1`);
        assert.strictEqual(res.body.text_multilinetext,`${tempText}2`);
        assert.strictEqual(res.body.text_formattext,`${tempText}3`);
      });
    });
    describe('# updating an unexistent object (PATCH)', function() {
      let res;
      const tempText = cryptoRandom(24).toString('hex');
      const reqId = cryptoRandom(24).toString('hex');
      let req = modreq({
      method: "PATCH",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${reqId}`,
      body: {
        id: reqId,
        text_text:`${tempText}1`,
        text_multilinetext:`${tempText}2`,
        text_formattext:`${tempText}3`
      }
    });
      req.headers['Content-Type'] = 'application/json';
      it('делаем запрос, статус должен быть 404', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        tempTextObj = res.body.id;
        assert.strictEqual(res.statusCode, 404);
      });
    });
    //TODO переделать, неправильный токен просто не дает авторизоваться, до проверки прав дело не доходит
    describe('# updating an object with invalid auth (PATCH)', function() {
      let res;
      const tempText = cryptoRandom(24).toString('hex');
      const reqId = cryptoRandom(32).toString('hex');
      let req = modreq({
      method: "PATCH",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${reqId}`,
      headers: {
        'Content-Type': 'application/json',
        'auth-token': '123'
      },
      body: {
        id: reqId,
        text_text:`${tempText}1`,
        text_multilinetext:`${tempText}2`,
        text_formattext:`${tempText}3`
      }
    });
      it('делаем запрос, статус должен быть 403', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        tempTextObj = res.body.id;
        assert.strictEqual(res.statusCode, 403);
      });
    });
    describe('# deleting an object (DELETE)', function() {
      let res;
      let req = modreq({
      method: "DELETE",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
    });
      it('делаем запрос, статус должен быть 200', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        //console.log(tempTextObj);
        assert.strictEqual(res.statusCode, 200);
      });
      it.skip('check if the object was indeed deleted', async function(){
      });
    });
    describe('# trying to delete an object for the second time (DELETE)', function() {
      let res;
      let req = modreq({
      method: "DELETE",
      uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
    });
      it('делаем запрос, статус должен быть 404', async function() {
        try{
        res = await request(req)
        .then(resp => {return resp})
        .catch();
        }catch(e){
          res = e.response;
        }
        //console.log(tempTextObj);
        assert.strictEqual(res.statusCode, 404);
      });
    });
  });