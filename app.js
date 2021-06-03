const express  = require('express');
const line = require('@line/bot-sdk');
//setup config
require('dotenv').config();

//declare express
const app = express();

//declare config 
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
}

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
    var msg = {
        type: 'text',
        text: JSON.stringify(event.source)
    }

    return client.replyMessage(event.replyToken, msg);
}

//get method
app.get('/health', (req,res) => res.sendStatus(200).json({
  status: 'OK'
}));

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});
