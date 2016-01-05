
var http = require('http');

var options = {
  host: 'localhost',
  path: '/large_file',
  port: '9998',
  method: 'GET'
};

function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(9998, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

var req = http.request(options, function(response) {
  var fileSize = 0;
  response.on('data', function (chunk) {
    fileSize += chunk.length;
  });

  response.on('end', function () {
    console.log('Assert that this is the filesize' + fileSize);
  });
});
