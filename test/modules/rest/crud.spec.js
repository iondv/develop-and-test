const assert = require('assert');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const {serverURL, adminUsername, adminPassword} = require('./config.js');

let  giventoken;
let tempId;
let tempId1;
let tempId2;
let tempId3;
let tempTextObj;
let tempList;
let tempText_text;
let BASE_REQUEST = {
  method: 'GET', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/crud`,
  headers: {}};

const modreq = function(props) {
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
        text_text: tempText_text = `${tempText}1`,
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
      before(async function() {
        try{
        await request(modreq({
          method: 'POST', resolveWithFullResponse: true, json: true,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json'},
          auth: {username: adminUsername, password: adminPassword},
          body: {
            _id: cryptoRandom(32).toString('hex'),
            text_text: cryptoRandom(8).toString('hex') + "55",
            text_miltilinetext: "Example10",
            text_formattext: "Example10"
          }
        }));
        await request(modreq({
          method: 'POST', resolveWithFullResponse: true, json: true,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json'},
          auth: {username: adminUsername, password: adminPassword},
          body: {
            id: cryptoRandom(32).toString('hex'),
            text_text: cryptoRandom(8).toString('hex') + "66",
            text_miltilinetext: "Example10",
            text_formattext: "Example10"
          }
        }));
        await request(modreq({
          method: 'POST', resolveWithFullResponse: true, json: true,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json'},
          auth: {username: adminUsername, password: adminPassword},
          body: {
            _id: cryptoRandom(32).toString('hex'),
            text_text: cryptoRandom(8).toString('hex') + "77",
            text_miltilinetext: "Example10",
            text_formattext: "Example10"
          }
        }));
      } catch (e) {};
      });
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/`});
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains any text objects', function() {
        tempList = res.body;
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].__class, 'class_text@develop-and-test');
      });
    });
    describe('# getting a list of text objects, with an offset of 1 and a count of 2', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?_offset=1&_count=2`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains any text objects', function() {
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].__class, 'class_text@develop-and-test');
      });
      it('check if the response is indeed offset by 1 and count is 2',function() {
        assert.deepEqual(res.body[0],tempList[1]);
        assert.strictEqual(res.body.length,2);
      });
    });
    describe('# getting a list of text objects containing a specific string', function() {
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?text_text=${tempText_text}`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains any text objects', function() {
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].__class, 'class_text@develop-and-test');
      });
      it('check if the response only has objects containing the requested text_text',function() {
        res.body.forEach((item) => {
          assert.notStrictEqual(item.text_text.indexOf(tempText_text),-1);
        });
      });
    });
    describe('# getting a list of collections with the eager loading of the "table" property', function() {
      before(async function() {
          await request(modreq({
            method: 'POST', resolveWithFullResponse: true, json: true,
            uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
            headers: {'Content-Type': 'application/json'},
            auth: {username: adminUsername, password: adminPassword},
            body: {
              id: tempId1 = cryptoRandom(32).toString('hex'),
              collRefCatalog: cryptoRandom(32).toString('hex')
            }
          }))
            await request(modreq({
              method: 'POST', resolveWithFullResponse: true, json: true,
              uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
              headers: {'Content-Type': 'application/json'},
              auth: {username: adminUsername, password: adminPassword},
              body: {
                id: tempId2 = cryptoRandom(32).toString('hex'),
                collRefCatalog: cryptoRandom(32).toString('hex')
              }
            }))
            await request(modreq({
              method: 'POST', resolveWithFullResponse: true, json: true,
              uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
              headers: {'Content-Type': 'application/json'},
              auth: {username: adminUsername, password: adminPassword},
              body: {
                id: tempId3 = cryptoRandom(32).toString('hex'),
                collRefCatalog: cryptoRandom(32).toString('hex')
              }
            }))
        try{
        resp = await request(modreq({
          method: 'POST', resolveWithFullResponse: true, json: true,
          uri: `${serverURL}/rest/crud/classColl@develop-and-test/`,
          headers: {'Content-Type': 'application/json'},
          auth: {username: adminUsername, password: adminPassword},
          body: {
            id: tempId = cryptoRandom(32).toString('hex'),
            table: [
              tempId1,
              tempId2,
              tempId3
            ]
          }
        }))}
        catch (e) {
          resp = e.resp;
        }
      });
      let res;
      let req = modreq({uri: `${serverURL}/rest/crud/classColl@develop-and-test/${tempId}?_eager=table`})
      it('делаем запрос, статус должен быть 200', async function() {
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains all three collRefCatalog objects', function() {
        assert.strictEqual(res.body[0].table.length, 3);
        res.body.table.forEach((item,i)=>{
        assert.strictEqual(res.body[0].table[i].__class, 'collRefCatalog@develop-and-test');
        });
      });
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
      it('check if the response contains any text objects', function() {
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].__class, 'class_text@develop-and-test');
      });
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
      it('check if the response contains any text objects', function() {
        assert.strictEqual(res.body.length > 0, true);
        assert.strictEqual(res.body[0].__class, 'class_text@develop-and-test');
      });
    });
    describe('# getting an object with eager loading of the "table" property (GET)', function() {
      let res;
      let req = modreq({
      uri: `${serverURL}/rest/crud/classColl@develop-and-test/${tempId}?_eager=table`})
      it('делаем запрос, статус должен быть 200', async function() {
        //console.log(tempId);
        res = await request(req);
        assert.strictEqual(res.statusCode, 200);
      });
      it('check if the response contains all three collRefCatalog objects', function() {
        assert.strictEqual(res.body.table.length, 3);
        res.body.table.forEach((item,i)=>{
        assert.strictEqual(res.body.table[i].__class, 'collRefCatalog@develop-and-test');
        });
      });
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
      it('check if the object was indeed deleted (HEAD responds with 404)', async function(){
        let res;
        let req = modreq({method: `HEAD`,
        uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`});
        try{
          res = await request(req);
        } catch (e) {
          res = e.response;
        };
        assert.strictEqual(res.statusCode, 404);
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