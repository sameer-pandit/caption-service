'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs= require('fs')
const captionService = require('./capService')
var multer  = require('multer')

// Constants
const PORT = 8080;

const handleSuccessResponse = (caption) => {
    if (caption) {
        console.log("I think it's " + caption);
    }
    else {
        process.stdout.write("Couldn't find a caption for this one");
    }

}

const handleErrorResponse = (error) => {
    console.log("Oops! Something went wrong. Try again later.");
    console.error(error);
}

// App
const app = express();
app.use(bodyParser.json());
var upload = multer({ dest: './public/uploads/' })

app.post('/', function (req, res) {
  console.log(JSON.stringify(req.body))
  var data = JSON.parse(JSON.stringify(req.body))
  console.log("Getting caption for url: " + data.url)
  captionService.getCaptionFromUrl(data.url)
  				.then(caption => res.send(caption))
                .catch(error => handleErrorResponse(error));
  //res.send("a man flying a kite")
});

app.post('/img', upload.single('file'), function (req, res) {
  console.log(req.file)
  var readStream = fs.createReadStream(req.file.path);
  captionService.getCaptionFromStream(readStream)
        .then(caption => res.send(caption))
        .catch(error => handleErrorResponse(error));
  // readStream.on('open',function(){
    
  // });

  //res.send("a man flying a kite")
});

app.get('/', function (req, res) {
  res.send('Please use POST to provide URL');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
