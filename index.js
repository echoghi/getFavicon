var app = require('express')(),
server = require('http').Server(app),
io = require('socket.io')(server),
request = require('request'),
cheerio = require('cheerio'),
fs = require('fs'),
favicons = [],
setUrl = "https://www.github.com";


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
  console.log('listening on port 3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('search site', function(str){
    console.log('User searched in the site: ' + str);
    setUrl = str;
    getFavicon();
  });
});

function getFavicon(){
  request(setUrl, function(error, response, head) {
   if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);
  //Parse the <head> for .ico files
  var $ = cheerio.load(head);
   $('link').each(function(index){
     var rel = $(this).attr('rel');
     if(rel.toLowerCase() == "icon" || rel.toLowerCase() == "shortcut icon"){
     favicons.push($(this).attr('href'));

     //download the .ico files
     var download = function(uri, filename, callback){
       request.head(uri, function(err, res, body){
         console.log('content-type:', res.headers['content-type']);
         console.log('content-length:', res.headers['content-length']);
         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
       });
     };
     download($(this).attr('href'), 'img.ico', function(){console.log("File downloaded to server")});
   }
    fs.writeFile('favicon.txt', "Favicon(s) from " + setUrl +": " + favicons);
   });
   console.log("Retrieved " + favicons.length + " favicon(s) from " + setUrl);
   favicons = [];
});
}
