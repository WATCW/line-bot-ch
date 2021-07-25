var moment = require('moment');

var util = {
    getCurrentDate: function(){
        var today = new Date();
        var date = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear().toString().padStart(4, '0')} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}:${today.getSeconds().toString().padStart(2, '0')}`;
        return date;
    }
}

module.exports = util;