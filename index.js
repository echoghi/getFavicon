var express = require('express'),
app = express(),
server = require('http').Server(app),
request = require('request'),
cheerio = require('cheerio'),
bodyParser = require('body-parser'),
fs = require('fs'),
chalk = require('chalk'),
site = '',
favicons = [],
setUrl = '',
searchUrl = '';

function fileSize(filename) {
 var stats = fs.statSync(filename)
 var fileSizeInBytes = stats["size"]
 return fileSizeInBytes
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/download', function(req, res){
  var file = __dirname + '/img.ico';
  console.log(chalk.green("client is accessing download..."));
  res.download(file);
  console.log(fileSize(file));
});

app.use(express.static(__dirname));

app.post('/api/search', function(req, res){
  searchUrl = req.body.url;
  getFavicon();
  setTimeout(function(){
  res.send({'searchUrl': searchUrl});
}, 3000);
});

server.listen(3000, function(){
  console.log(chalk.blue('listening on port 3000'));
});

//download the .ico files
var download = function(url, filename, callback){

  request.head(url, function(err, res, body){
    if(err){
      console.log(chalk.red('Download Error:', err));
      searchUrl = 'error';
      return;
    } else{
      if((res.headers['content-type'].indexOf('text/html') === -1) && (res.headers['content-type'].indexOf('image/svg+xml') === -1)){
      console.log(chalk.blue('ico image:'), chalk.green(res.request.uri.href));
      console.log(chalk.blue('content-type:'), chalk.green(res.headers['content-type']));
      console.log(chalk.blue('content-length:'), chalk.green(res.headers['content-length']));
      request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
    }
     }
  });
};

function getFavicon(){
  // Check/Fix URL Formatting
  searchUrl.indexOf('http') !== -1 ? (console.log(chalk.green('HTTP Check Passed')), setUrl = searchUrl) : (setUrl = 'http://www.'+ searchUrl,
  console.log(chalk.green('HTTP(s) error fixed')));

  request({url: setUrl, rejectUnauthorized: false}, function(error, response, head) {
   if(error) {
    console.log(chalk.red("Request Error:", error));
    searchUrl = 'error';
    return;
  }
  //Parse the <head> for icons
  var $ = cheerio.load(head);
   $('link').each(function(index){
     var rel = $(this).attr('rel');
     if(rel.toLowerCase() === "icon" || rel.toLowerCase() === "shortcut icon"){
        site = $(this).attr('href');
       //Check if the favicon file has a proper address format
       if(site.indexOf('http') !== -1 || site.indexOf('https') !== -1){
         console.log(chalk.green('URL is a valid ICO file'));
       }
       else if((site.indexOf('http') === -1 && site.indexOf('https') === -1) && (site.indexOf('//') !== -1)){
         site = 'http:' + site;
       }
       else{
         site = setUrl + site;
         console.log(chalk.green('ICO path error fixed'));
       }

     favicons.push(site);

    if(site !== ''){
    download(site, 'img.ico', function(){console.log("File downloaded to server")});
    }
   }
    fs.writeFile('favicon.txt', "Favicon(s) from " + setUrl + ": " + favicons);
   });
   // Check if any favicons were found in the html body.
   // If not, set a download address where the main favicon can usually be found
   favicons.length === 0 ? (site = setUrl+'/favicon.ico',favicons.push(site),
   console.log(chalk.green("Retrieved", favicons.length, "favicon(s) from", setUrl)),
   download(site, 'img.ico', function(){console.log("File downloaded to server")}),
   fs.writeFile('favicon.txt', "Favicon(s) from " + setUrl + ": " + favicons),
   favicons = []) : (console.log(chalk.green("Retrieved " + favicons.length + " favicon(s) from " + setUrl)),
   favicons = []);
});
}
