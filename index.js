var request = require('request'),
cheerio = require('cheerio'),
fs = require('fs'),
express = require('express'),
app = express(),
favicons = [],
setUrl = "https://www.github.com";


  request(setUrl, function(error, response, head) {
   if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);
  var $ = cheerio.load(head);
   $('link').each(function(index){
     var rel = $(this).attr('rel');
     if(rel.toLowerCase() == "icon" || rel.toLowerCase() == "shortcut icon"){
     favicons.push($(this).attr('href'));
   }
   console.log("Retrieved " + favicons.length + "favicon(s) from " + setUrl);
    fs.writeFile('favicon.txt', "Favicon(s) from " + setUrl +": " + favicons);
   });
});
