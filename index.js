var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var express = require('express');
var app = express();
var favicons = [];

  request("https://www.cnn.com", function(error, response, head) {
   if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(head);
   $('link').each(function(index){
     var linkType = $(this).attr('type');
     var rel = $(this).attr('rel');
     if(linkType == "image/x-icon" || rel == "shortcut icon"){
     favicons.push($(this).attr('href'));
   }
    fs.writeFile('favicon.txt', favicons);
   });
});
