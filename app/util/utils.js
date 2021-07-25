var moment = require('moment');

var util = {
    getCurrentDate: function(){
        var today = new Date();
        var date = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().padStart(4, '0')}`;
        return date;
    }
}

module.exports = util;