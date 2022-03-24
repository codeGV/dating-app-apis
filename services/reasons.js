'use strict'
const response = require('../exchange/response');
const message = require('../helpers/message');

const create = async (req, model, context, res) => {
    const log = context.logger.start('services/reasons')
    let reason
    try {
        if (context.user.type == 'admin') {

            reason = await new db.reason(model).save();
        } else {
            throw response.unAuthorized(res, "unAuthorized_user");
        }

        log.end();
        return reason
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

const get = async (req, page, context) => {
    const log = context.logger.start(`services/reasons/get`)
    try {
        let params = req.query
        let query = {}
        let reason
       
            if (page != null && page != undefined && page != "") {

                reason = await db.reason.find().skip(page.skipCount).limit(page.items).sort({
                    timeStamp: -1
                })
            }

        log.end();
        return reason
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}
exports.create = create

exports.get = get
