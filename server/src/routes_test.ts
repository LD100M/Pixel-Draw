import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import {save, resetFolderForTesting, load, listName} from './routes';


describe('routes', function() {
  it('save', function() {
    // First branch, straight line code, error case
    const req = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {content: "some stuff1"}});
    const res = httpMocks.createResponse();
    save(req, res);

    assert.deepStrictEqual(res._getStatusCode(), 400);
    assert.deepStrictEqual(res._getData(),
        'required argument "name" was missing');

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {content: "some stuff2"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/save', body: {name: "A"}});
  const res2 = httpMocks.createResponse();
  save(req2, res2);

  assert.deepStrictEqual(res2._getStatusCode(), 400);
  assert.deepStrictEqual(res2._getData(),
      'required argument "content" was missing');

  const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/save', body: {name: "L"}});
  const res3 = httpMocks.createResponse();
  save(req3, res3);
  
  assert.deepStrictEqual(res3._getStatusCode(), 400);
  assert.deepStrictEqual(res3._getData(),
      'required argument "content" was missing');

  // Third branch, straight line code
  const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", content: "some stuff"}});
  const res4 = httpMocks.createResponse();
  save(req4, res4);

  assert.deepStrictEqual(res4._getStatusCode(), 200);
  assert.deepStrictEqual(res4._getData(), {saved: true});

  const req5 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", content: "different stuff"}});
  const res5 = httpMocks.createResponse();
  save(req5, res5);

  assert.deepStrictEqual(res5._getStatusCode(), 200);
  assert.deepStrictEqual(res5._getData(), {saved: true});

  resetFolderForTesting();
  })

  it('load', function() {
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "key", content: "transcript value"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "key2", content: "transcript value2"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    // First Branch, straight line code(Error Case)
    const loadReq1 = httpMocks.createRequest(
      {method: 'GET', url: '/load', query: {hobby: "key", content: "Another one bites the dust"}});
    const loadRes1 = httpMocks.createResponse();
    load(loadReq1, loadRes1);
    assert.deepStrictEqual(loadRes1._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes1._getData(), 'required argument "name" was missing');

    const loadReq2 = httpMocks.createRequest(
      {method: 'GET', url: '/load', query: {age: "key", content: "speed and power is the answer"}});
    const loadRes2 = httpMocks.createResponse(); 
    load(loadReq2, loadRes2);
    assert.deepStrictEqual(loadRes2._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes2._getData(), 'required argument "name" was missing');


    // Second Branch, straight line code(Error Case)
    const loadReq3 = httpMocks.createRequest(
      {method: 'GET', url: '/load', query: {name: "muda muda muda"}});
    const loadRes3 = httpMocks.createResponse();
    load(loadReq3, loadRes3);
   assert.deepStrictEqual(loadRes3._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes3._getData(), 'no file was previously saved with that name');

    const loadReq4 = httpMocks.createRequest(
      {method: 'GET', url: '/load', query: {name: "ora ora ora"}});
    const loadRes4 = httpMocks.createResponse();
    load(loadReq4, loadRes4);
    assert.deepStrictEqual(loadRes4._getStatusCode(), 404);
    assert.deepStrictEqual(loadRes4._getData(), 'no file was previously saved with that name');

      // Third Branch, straight line code
      const loadReq5 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query:{name: "key", content: "transcript value"}});
    const loadRes5 = httpMocks.createResponse();
    load(loadReq5, loadRes5);
    assert.deepStrictEqual(loadRes5._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes5._getData(), {name: "key", content: "transcript value"});

    const loadReq6 = httpMocks.createRequest(
        {method: 'GET', url: '/load', query: {name: "key2", content: "transcript value2"}});
    const loadRes6 = httpMocks.createResponse();
    load(loadReq6, loadRes6);
    // Validate that both the status code and the output is as expected
    assert.deepStrictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), {name: "key2", content: "transcript value2"});

    resetFolderForTesting();
  })

  it("ListName", function() {
    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "key", content: "transcript value"}});
    const saveResp1 = httpMocks.createResponse();
    save(saveReq1, saveResp1);

    // straight line code
    const listNameReq6 = httpMocks.createRequest(
      {method: 'GET', url: '/listName'});
    const listNameRes6 = httpMocks.createResponse();
    listName(listNameReq6, listNameRes6);
    assert.deepStrictEqual(listNameRes6._getStatusCode(), 200);
    assert.deepStrictEqual(listNameRes6._getData(), {names: ["key"]});

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/save',
    body: {name: "key2", content: "transcript value2"}});
    const saveResp2 = httpMocks.createResponse();
    save(saveReq2, saveResp2);

    const listNameReq7 = httpMocks.createRequest(
      {method: 'GET', url: '/listName'});
    const listNameRes7 = httpMocks.createResponse();
    listName(listNameReq7, listNameRes7);
    assert.deepStrictEqual(listNameRes7._getStatusCode(), 200);
    assert.deepStrictEqual(listNameRes7._getData(), {names: ["key", "key2"]});
  }) 
});
