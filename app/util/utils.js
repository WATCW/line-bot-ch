var moment = require('moment');

var util = {
    getCurrentDate: function(){
        var today = new Date();
        var date = moment(today).format("DD/MM/YYYY HH:mm:ss");
        return date;
    }
}

module.exports = util;