const moment = require('moment');

exports.date = async () => {
    try {
        let now = moment();
        now = now.format('DD-MM-YYYY')
        return now
    } catch (err) {
       throw new Error('ERROR_DURING_DATE_GENERATION')
    }
}