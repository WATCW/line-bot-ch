var moment = require('moment');
const formatTimeStamp = "MM-DD-YYYY HH:MM:ss"

var util = {
    getCurrentDate: function(){
        var today = new Date();
        var date = moment(today, formatTimeStamp);
        return date;
    }
}

module.exports = util;