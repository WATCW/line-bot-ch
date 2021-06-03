const express  = require('express');
const line = require('@line/bot-sdk');
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

function handleEvent(event){
    console.log(event);
    if(event.type==='message' && event.message.type==='text'){
        handleTextMessage(event);
    }else{
        return Promise.resolve(null);
    }
}

function handleTextMessage(event){

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

    return client.replyMessage(event.replyToken, msg);
}
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
