const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const fs = require('fs');
const path = require('path');

let  giventoken;
// text/javascript // string
const tempId1 = cryptoRandom(32).toString('hex');
const tempId2 = cryptoRandom(32).toString('hex');
const tempId3 = cryptoRandom(32).toString('hex');
const tempId = cryptoRandom(32).toString('hex');
const tempTextObj = cryptoRandom(24).toString('hex');
let tempList;
let tempText_text;
let BASE_REQUEST = {
  method: 'GET', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/crud`,
  headers: {}
};

const modreq = function(props) {
  return Object.assign({},BASE_REQUEST,props)
};

  describe('Checking crud service', function() {
    beforeAll(async function() {
      giventoken = (await request({method: 'GET', resolveWithFullResponse: true,
      uri: `${serverURL}/rest/token`,
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
      })).body;
      BASE_REQUEST.headers['auth-token'] = giventoken;
    });
    describe('# check if the response for null parameters is valid', function() {
      it('statusCode has to be 404', async function() {
        let res;
        try{
          res = await request(modreq({method: 'POST'}));
        }
        catch(e){
          res = e.response;
        }
        expect(res.statusCode).toEqual(404);
      })
    });
    describe('POST', function() {
      describe('# creating an object (POST)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = tempTextObj;
        let req = modreq({
          method: "POST",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`,
          body: {
            id: reqId,
            text_text: tempText_text = `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          }
        });
        req.headers['Content-Type'] = 'application/json';
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          //console.log(tempTextObj);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains the sent text object', async function () {
          expect(res.body.id).toEqual(reqId);
          expect(res.body.text_text).toEqual(`${tempText}1`);
          expect(res.body.text_multilinetext).toEqual(`${tempText}2`);
          expect(res.body.text_formattext).toEqual(`${tempText}3`);
        });
      });
      describe('# sending a file with multipart body request (POST)', function () {
        let res;
        it('making the request, statusCode has to be 200', async function () {
          const fileToSend = path.join(__dirname, 'crud_request-multipart');
          fs.writeFileSync(fileToSend, cryptoRandom(64));
          try {
            let req = modreq({
              method: "POST",
              uri: `${serverURL}/rest/crud/class_file@develop-and-test/`,
              formData: {
                file_file: fs.createReadStream(fileToSend),
              }
            });
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            res = await request(req);
            try {
              req.formData.file_file.close();
            } catch (err) {
            }
          } finally {
            fs.unlinkSync(fileToSend);
          }
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains the sent file object', async function () {
          expect(res.body.file.buffer.length).toBeGreaterThan(0);
        });
      });
      describe('# sending a file with json body request (POST)', function () {
        let res;
        const fileToSend = path.join(__dirname, 'crud_request-json');
        fs.writeFileSync(fileToSend, cryptoRandom(64));
        let req = modreq({
          method: "POST",
          uri: `${serverURL}/rest/crud/class_file@develop-and-test/`,
          json: false,
          body: JSON.stringify({
            file_file: fs.readFileSync(fileToSend).toString('base64'),
          })
        });
        req.headers['Content-Type'] = 'application/json';
        fs.unlinkSync(fileToSend);
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains the sent text object', async function () {
          expect(res.body.file.buffer.length).toBeGreaterThan(0);
        });
      });
      describe('# creating an object with the same ID as the previous (POST)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = tempTextObj;
        let req = modreq({
          method: "POST",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`,
          json: false,
          body: JSON.stringify({
            id: reqId,
            text_text: 'test-same-id',// `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          })
        });
        req.headers['Content-Type'] = 'application/json'
        it('making the request, statusCode has to be 400', async function () {
          try {
            res = await request(req);
          } catch (e) {
            console.log(e);
            res = e.response;
          }
          expect(res.statusCode).toEqual(400);
        });
      });
      describe('# creating an object, request type is not JSON (POST)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = cryptoRandom(24).toString('hex');
        let req = modreq({
          method: "POST",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/`,
          body: `${tempText}1`,
          json: false
        });
        req.headers['Content-Type'] = 'text/plain';
        it('making the request, statusCode has to be 400', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          //console.log(res);
          expect(res.statusCode).toEqual(400);
        });
      });
      describe('# creating an object with invalid auth (POST)', function () {
        let res;
        const tempId = cryptoRandom(24).toString('hex');
        const tempText = cryptoRandom(24).toString('hex');
        let req = modreq({
          body: {
            id: tempId,
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          },
          headers: {'auth-token': '123'}
        });
        req.headers['Content-Type'] = 'application/json';
        it('making the request, statusCode has to be 403', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          //console.log(res);
          expect(res.statusCode).toEqual(403);
        });
        it('check if the object was not created (HEAD responds with 404)', async function () {
          let res;
          let req = modreq({
            method: `HEAD`,
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId}`
          });
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
      describe('# creating an object with no auth (POST)', function () {
        let res;
        const tempId = cryptoRandom(24).toString('hex');
        const tempText = cryptoRandom(24).toString('hex');
        let req = modreq({
          body: {
            id: tempId,
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          },
          headers: {}
        });
        req.headers['Content-Type'] = 'application/json';
        it('making the request, statusCode has to be 401', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          //console.log(res);
          expect(res.statusCode).toEqual(401);
        });
        it('check if the object was not created (HEAD responds with 404)', async function () {
          let res;
          let req = modreq({
            method: `HEAD`,
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId}`
          });
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
    });
    describe('GET', function() {
      describe('# getting a list of text objects', function () {
        beforeAll(async function () {
          try {
            await request(modreq({
              method: 'POST', resolveWithFullResponse: true, json: true,
              uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json',
                'auth-token': giventoken},
              body: {
                _id: cryptoRandom(32).toString('hex'),
                text_text: cryptoRandom(8).toString('hex') + "55",
                text_miltilinetext: "Example10",
                text_formattext: "Example10"
              }
            }));
            await request(modreq({
              method: 'POST', resolveWithFullResponse: true, json: true,
              uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json',
                'auth-token': giventoken},
              body: {
                id: cryptoRandom(32).toString('hex'),
                text_text: cryptoRandom(8).toString('hex') + "66",
                text_miltilinetext: "Example10",
                text_formattext: "Example10"
              }
            }));
            await request(modreq({
              method: 'POST', resolveWithFullResponse: true, json: true,
              uri: `${serverURL}/rest/crud/class_text@develop-and-test/`, headers: {'Content-Type': 'application/json',
                'auth-token': giventoken},
              body: {
                _id: cryptoRandom(32).toString('hex'),
                text_text: cryptoRandom(8).toString('hex') + "77",
                text_miltilinetext: "Example10",
                text_formattext: "Example10"
              }
            }));
          } catch (e) {
          }
        });
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/`});
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains any text objects', function () {
          tempList = res.body;
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].__class).toEqual('class_text@develop-and-test');
        });
      });
      describe('# getting a list of text objects, with an offset of 1 and a count of 2', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?_offset=1&_count=2`});
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains any text objects', function () {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].__class).toEqual('class_text@develop-and-test');
        });
        it('check if the response is indeed offset by 1 and count is 2', function () {
          expect(res.body[0]).toEqual(tempList[1]);
          expect(res.body.length).toEqual(2);
        });
      });
      describe('# getting a list of text objects containing a specific string', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/?text_text=${tempText_text}`});
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains any text objects', function () {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].__class).toEqual('class_text@develop-and-test');
        });
        it('check if the response only has objects containing the requested text_text', function () {
          res.body.forEach((item) => {
            expect(item.text_text).toMatch(tempText_text);
          });
        });
      });
      describe('# getting a list of collections with the eager loading of the "table" property', function () {
        beforeAll(async function () {
          await request(modreq({
            method: 'POST', resolveWithFullResponse: true, json: true,
            uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
            headers: {
              'Content-Type': 'application/json',
              'auth-token': giventoken
            },
            body: {
              id: tempId1,
              collRefCatalog: cryptoRandom(32).toString('hex')
            }
          }));
          await request(modreq({
            method: 'POST', resolveWithFullResponse: true, json: true,
            uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
            headers: {
              'Content-Type': 'application/json',
              'auth-token': giventoken
            },
            body: {
              id: tempId2,
              collRefCatalog: cryptoRandom(32).toString('hex')
            }
          }));
          await request(modreq({
            method: 'POST', resolveWithFullResponse: true, json: true,
            uri: `${serverURL}/rest/crud/collRefCatalog@develop-and-test/`,
            headers: {
              'Content-Type': 'application/json',
              'auth-token': giventoken
            },
            body: {
              id: tempId3,
              collRefCatalog: cryptoRandom(32).toString('hex')
            }
          }));
          await request(modreq({
            method: 'POST', resolveWithFullResponse: true, json: true,
            uri: `${serverURL}/rest/crud/classColl@develop-and-test/`,
            headers: {
              'Content-Type': 'application/json',
              'auth-token': giventoken
            },
            body: {
              id: tempId,
              table: [
                tempId1,
                tempId2,
                tempId3
              ]
            }
          }));
        });
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/classColl@develop-and-test/${tempId}?_eager[]=table`});
        it('making the request, statusCode has to be 200', async function () {
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains all three collRefCatalog objects', function () {
          expect(res.body[0].table.length).toEqual(3);
          res.body.table.forEach((item, i) => {
            expect(res.body[0].table[i].__class, 'collRefCatalog@develop-and-test');
          });
        });
      });
      describe('# getting an object (GET)', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`});
        it('making the request, statusCode has to be 200', async function () {
          //console.log(tempId);
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains any text objects', function () {
          expect(typeof res.body).toEqual('object');
          expect(res.body).not.toBeNull();
          expect(res.body.__class).toEqual('class_text@develop-and-test');
        });
      });
      describe('# getting an object with eager loading of the "table" property (GET)', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/classColl@develop-and-test/${tempId}?_eager[]=table`});
        it('making the request, statusCode has to be 200', async function () {
          //console.log(tempId);
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains all three collRefCatalog objects', function () {
          expect(res.body.table.length).toEqual(3);
          res.body.table.forEach((item, i) => {
            expect(res.body.table[i].__class).toEqual('collRefCatalog@develop-and-test');
          });
        });
      });
      describe('# checking if the response is valid on invalid object check (GET)', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_text@develop-and-test/${cryptoRandom(8).toString('hex')}`});
        it('making the request, statusCode has to be 404', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
      describe('# checking if the response is valid on invalid class check (GET)', function () {
        let res;
        let req = modreq({uri: `${serverURL}/rest/crud/class_${cryptoRandom(8).toString('hex')}@develop-and-test/`});
        it('making the request, statusCode has to be 404', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
      describe('# checking if the response is valid on invalid auth (GET)', function () {
        let res;
        let req = modreq({
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          headers: {'auth-token': cryptoRandom(8).toString('hex')}
        });
        it('making the request, statusCode has to be 403', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('# checking if the response is valid on unauthorized request (GET)', function () {
        let res;
        let req = modreq({
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          headers: {}
        });
        it('making the request, statusCode has to be 401', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(401);
        });
      });
    });
    describe('HEAD', function() {
      describe('# checking if an object is present (HEAD)', function () {
        let res;
        let req = modreq({
          method: `HEAD`,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`
        });
        it('making the request, statusCode has to be 200', async function () {
          //console.log(tempId);
          res = await request(req);
          expect(res.statusCode).toEqual(200);
        });
        it('check if the response contains any text objects', function () {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].__class).toEqual('class_text@develop-and-test');
        });
      });
      describe('# checking if the response is valid on invalid object check (HEAD)', function () {
        let res;
        let req = modreq({
          method: `HEAD`,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${cryptoRandom(8).toString('hex')}`
        });
        it('making the request, statusCode has to be 404', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
      describe('# checking if the response is valid on invalid auth (HEAD)', function () {
        let res;
        let req = modreq({
          method: `HEAD`,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId}`,
          headers: {'auth-token': cryptoRandom(8).toString('hex')}
        });
        it('making the request, statusCode has to be 403', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('# checking if the response is valid on unauthorized request (HEAD)', function () {
        let res;
        let req = modreq({
          method: `HEAD`,
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId}`,
          headers: {}
        });
        it('making the request, statusCode has to be 401', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(401);
        });
      });
    });
    describe('PATCH', function() {
      describe('# updating an object (PATCH)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = tempTextObj;
        let req = modreq({
          method: "PATCH",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          body: {
            id: reqId,
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          }
        });
        req.headers['Content-Type'] = 'application/json';
        it('making the request, statusCode has to be 200', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(200);
          it('check if the response contains the sent text object', async function () {
            expect(res.body.id).toEqual(reqId);
            expect(res.body.text_text).toEqual(`${tempText}1`);
            expect(res.body.text_multilinetext).toEqual(`${tempText}2`);
            expect(res.body.text_formattext).toEqual(`${tempText}3`);
          });
        });
      });
      describe('# updating an object, request type is not JSON (PATCH)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = tempTextObj;
        let req = modreq({
          method: "PATCH",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          body: `${tempText}1`,
          json: false
        });
        req.headers['Content-Type'] = 'text/plain';
        it('making the request, statusCode has to be 400', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(400);
        });
      });
      describe('# updating an unexistent object (PATCH)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = cryptoRandom(24).toString('hex');
        let req = modreq({
          method: "PATCH",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${reqId}`,
          body: {
            id: reqId,
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          }
        });
        req.headers['Content-Type'] = 'application/json';
        it('making the request, statusCode has to be 404', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
      });
      describe('# updating an object with invalid auth (PATCH)', function () {
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
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          }
        });
        it('making the request, statusCode has to be 403', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(403);
        });
      });
      describe('# updating an object with no auth (PATCH)', function () {
        let res;
        const tempText = cryptoRandom(24).toString('hex');
        const reqId = cryptoRandom(32).toString('hex');
        let req = modreq({
          method: "PATCH",
          uri: `${serverURL}/rest/crud/class_text@develop-and-test/${reqId}`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            id: reqId,
            text_text: `${tempText}1`,
            text_multilinetext: `${tempText}2`,
            text_formattext: `${tempText}3`
          }
        });
        it('making the request, statusCode has to be 401', async function () {
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(401);
        });
      });
    });
    describe('DELETE', function() {
      describe('# deleting an object with no auth (DELETE)', function () {
        let req;
        beforeAll(async function () {
          req = modreq({
            method: "DELETE",
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId1}`,
            headers: {}
          });
        });
        it('making the request, statusCode has to be 401', async function () {
          try {
            let res = await request(req);
          } catch (e) {
            res = e.response
          }
          expect(res.statusCode).toEqual(401);
        });
        it('check if the object is still present (HEAD responds with 200)', async function () {
          let res;
          let req = modreq({
            method: `HEAD`,
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`
          });
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(200);
        });
      });
      describe('# deleting an object with invalid auth (DELETE)', function () {
        let req;
        beforeAll(async function () {
          req = modreq({
            method: "DELETE",
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempId1}`,
            headers: {'auth-token': '123'}
          });
        });
        it('making the request, statusCode has to be 403', async function () {
          try {
            let res = await request(req);
          } catch (e) {
            res = e.response
          }
          expect(res.statusCode).toEqual(403);
        });
        it('check if the object is still present (HEAD responds with 200)', async function () {
          let res;
          let req = modreq({
            method: `HEAD`,
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`
          });
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(200);
        });
      });
      describe('# deleting an object (DELETE)', function () {
        let deleted = false;
        beforeAll(async function () {
          let req = modreq({
            method: "DELETE",
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          });
          let res = await request(req);
          deleted = res.statusCode === 200;
        });
        it('making the request, statusCode has to be 200', function () {
          //console.log(tempTextObj);
          expect(deleted).toBeTruthy();
        });
        it('check if the object was indeed deleted (HEAD responds with 404)', async function () {
          let res;
          let req = modreq({
            method: `HEAD`,
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`
          });
          try {
            res = await request(req);
          } catch (e) {
            res = e.response;
          }
          expect(res.statusCode).toEqual(404);
        });
        describe('# trying to delete an object for the second time (DELETE)', function () {
          let res;
          let req = modreq({
            method: "DELETE",
            uri: `${serverURL}/rest/crud/class_text@develop-and-test/${tempTextObj}`,
          });
          it('making the request, statusCode has to be 404', async function () {
            try {
              res = await request(req);
            } catch (e) {
              res = e.response;
            }
            //console.log(tempTextObj);
            expect(res.statusCode).toEqual(404);
          });
        });
      });
    });
  });