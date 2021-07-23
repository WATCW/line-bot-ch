const express  = require('express');
const line = require('@line/bot-sdk');
const mongodb = require("./app/db/mongoDB");
const mongoose = require('mongoose');
const flexm = require('./app/template/flexmessage');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");

const path = require('path');

const Schema = mongoose.Schema
//setup config
require('dotenv').config();

//declare express
const app = express();

const myLiffId = process.env.MY_LIFF_ID;
//app.use(express.static('public'));

//declare config 
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

//declare client
const client = new line.Client(config);

//post method
app.post('/webhook', line.middleware(config), (req,res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result)=> res.json(result));        
});

async function handleEvent(event){
    console.log(event);
    if(event.type==='message' && event.message.type==='text'){
       await handleTextMessage(event);
    }else{
        return Promise.resolve(event);
    }
    return Promise.resolve(event);
}

async function handleTextMessage(event){
    if(event.message.text == 'p::10'){
          let ms_flex = flexm.flexMessageTemplate();
          console.log(ms_flex);
          await connectDb();
        let mmsg = await mongodb.findBookStoreByPrice(event.message.text.split('::')[1]);
        var msg = {
          type: 'text',
          text: JSON.stringify(mmsg)
      }
        return client.replyMessage(event.replyToken, msg, true);
    }  

    if(event.message.text=='mock.location'){

        var data = [{
            name: 'name',
            id: 'id.----xx--'
        }, 
        {
            name: 'name2',
            id: 'id.2--xx----'
        }
      ];

      const oData = {
        "thumbnailImageUrl": '',
          "imageBackgroundColor": "#FFFFFF",
          "title": `PM 2.5: xxxxx`,
          "text": `xxxxxxx`,
          "actions": [
            {
              "type": "uri",
              "label": "ข้อมูลย้อนหลัง",
              "uri": 'https://www.google.com'
            }
          ]
      };

      var msg = {
        "type": "template",
        "altText": "ข้อมูลสถานที่",
        "template": {
          "type": "carousel",
          "columns": oData,
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
        }
      }

        return client.replyMessage(event.replyToken, msg);
    }else{
    var msg = {
        type: 'text',
        text: JSON.stringify(event.source)
    }

    await connectDb();
    //await dynamicModel("collections");
    console.log('not do this')
    await mongodb.checkCollectionExists("bookstore");
    return client.replyMessage(event.replyToken, msg);
}
}


async function connectDb() {
  try {
    await mongodb.connectToMongoDB().then((result) => {
     console.log(result);
    }).catch((error) => {
      console.log('Error connect db');
      throw new Error(error.message);
    });
  }
  catch (err) {
    console.log(err);
  }
}


 async function dynamicModel(suffix) {
  await mongodb.createCollection('','');
}

//get method
// app.get('/health', (req,res) => res.sendStatus(200).json({
//       status : 'OK',
//       message: 'Service is avaliable.'
// }));

app.use(morgan('tiny'));
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}));

// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

// load routers
app.use('/', require('./app/routes/route'))

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});
