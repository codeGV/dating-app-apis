'use strict'
const response = require('../exchange/response');
const message = require('../helpers/message');

const create = async (req, model, context, res) => {
    const log = context.logger.start('services/recommended')
    let recommended
    try {
        // if (context.user.type == 'admin') {

            recommended = await new db.recommended(model).save();
        // } else {
        //     throw response.unAuthorized(res, "unAuthorized_user");
        // }

        // log.end();
    //  return recommended
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

const get = async (req, page, context) => {
    const log = context.logger.start(`services/recommended/get`)
    try {
        let params = req.query
        let query = {}
        let recommended
       
            if (page != null && page != undefined && page != "") {

                recommended = await db.recommended.find().skip(page.skipCount).limit(page.items).sort({
                    timeStamp: -1
                })
            }

        log.end();
        return recommended
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}
exports.create = create

exports.get = get
