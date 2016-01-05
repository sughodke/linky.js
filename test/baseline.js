
/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// Core
var http = require('http');
var Q = require('q');
var Linky = require('../lib/');
var assert = require('assert');

/* -----------------------------------------------------------------------------
 * server
 * ---------------------------------------------------------------------------*/

var server;

function handleRequest(request, response){
  response.end('I'.repeat(100));
}

var startServer = function() {
  var deferred = Q.defer();
  server = http.createServer(handleRequest);

  server.listen(9995, function(){
      deferred.resolve();
  });

  return deferred.promise;
};

/* -----------------------------------------------------------------------------
 * link layer
 * ---------------------------------------------------------------------------*/

var linky;

var startLinky = function() {
  return Q.fcall(function() {
    linky = new Linky();
    linky.createLinkLayer();
  });
};

var stopLinky = function() {
  return Q.fcall(function() {
    linky.destroyLinkLayer();
  });
};

/* -----------------------------------------------------------------------------
 * client
 * ---------------------------------------------------------------------------*/

var options = {
  host: 'localhost',
  path: '/large_file',
  port: '9998',
  method: 'GET'
};

var assertClientDownload = function(expectedSize) {
  var deferred = Q.defer();
  console.log('idd');

  var req = http.request(options, function(response) {
    var fileSize = 0;

    response.on('data', function (chunk) {
      fileSize += chunk.length;
      if (fileSize > expectedSize) {
        deferred.reject(new Error('Download exceeded the expected size.'));
      }
    });
    console.log('fSize ' + fileSize);

    response.on('end', function () {
      assert.equal(fileSize, expectedSize,
          'The downloaded file did not match the expected filesize');
      deferred.resolve();
    });
  });

  return deferred;
};


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('LinkyUnitTest', function () {

    this.timeout(10000 * 3);

    beforeEach(function () {
        return startServer()
            .then(startLinky);
    });

    afterEach(function () {
      return stopLinky();
    });

    it('Should allow all data to flow through.', function () {
          return assertClientDownload(100);
    });

});
