var express = require('express'),
    request = require('supertest'),
    assert = require('assert'),
    ogre = require('..');

describe('Ogre Cache', function () {

  it('should automatically set cache headers for know resources', function (done) {
    var app = express();
    app.use(ogre.cache());

    app.get('/foo.js', function(req, res) {
      res.send('var a=5;');
      assert.deepEqual(res._headers['cache-control'], 'public, max-age=604800');
      res.end();
    });

    request(app.listen())
      .get('/foo.js')
      .expect(200, done)

  });

  it('should not apply cache headers for not handled resources', function (done) {
    var app = express();
    app.use(ogre.cache());

    app.get('/foo.doc', function(req, res) {
      res.send('foo bar baz');
      assert.deepEqual(res._headers['cache-control'], undefined);
      res.end();
    });

    request(app.listen())
      .get('/foo.doc')
      .expect(200, done)

  });


});