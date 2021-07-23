const express  = require('express');
const line = require('@line/bot-sdk');
const mongodb = require("./app/db/mongoDB");
const mongoose = require('mongoose');
const Schema = mongoose.Schema
//setup config
require('dotenv').config();

//declare express
const app = express();

const myLiffId = process.env.MY_LIFF_ID;
app.use(express.static('public'));

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

    var msg2 = {
        "type": "bubble",
        "styles": {
          "footer": {
            "backgroundColor": "#42b3f4"
          }
        },
        "header": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "icon",
                  "size": "xxl",
                  "url": "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-1/p200x200/22814542_1962234637127047_1607260544847069468_n.png?_nc_cat=0&oh=2a303227c24dfab9e71a405b6d594d50&oe=5BC3965D"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "flex": 5,
              "contents": [
                {
                  "type": "text",
                  "text": "โรงพยาบาลอ่างทอง",
                  "weight": "bold",
                  "color": "#aaaaaa",
                  "size": "md",
                  "gravity": "top"
                },
                {
                  "type": "text",
                  "text": "ขอขอบพระคุณ",
                  "weight": "bold",
                  "color": "#aaaaaa",
                  "size": "lg",
                  "gravity": "top"
                }
              ]
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": "https://scontent.fbkk7-2.fna.fbcdn.net/v/t1.0-9/35076722_2227987830551725_330757188106584064_n.jpg?_nc_cat=0&oh=0f5fa137c5bd65f109a40439afcd59eb&oe=5BB566B6",
          "size": "full",
          "aspectRatio": "16:9",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "http://bit.ly/2JGBRKv"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "margin": "sm",
              "text": "คุณกานต์สินี ไหลสงวนงาม",
              "weight": "bold",
              "size": "md",
              "wrap": true
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "xs",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "บริจาคเงินจำนวน ๑๘๐,๐๐๐ บาท เพื่อซื้อครุภัณฑ์ทางการแพทย์ ใช้ในโรงพยาบาลอ่างทอง โดยมีนายแพทย์พงษ์นรินทร์ ชาติรังสรรค์ผู้อำนวยการโรงพยาบาลอ่างทอง เป็นผู้รับมอบ",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 6
                    }
                  ]
                }
              ]
            },
            {
              "type": "text",
              "margin": "md",
              "text": "วันที่ 12 มิ.ย. 2561",
              "size": "sm",
              "color": "#adadad"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "color": "#FFFFFF",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "อ่านต่อ...",
                "uri": "http://bit.ly/2JGBRKv"
              }
            }
          ]
        }
      };

    if(event.message.text == 'msg'){
        return client.replyMessage(event.replyToken, msg2);
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
    await dynamicModel("collections");
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
app.get('/health', (req,res) => res.sendStatus(200).json({
      status : 'OK',
      message: 'Service is avaliable.'
}));

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});
