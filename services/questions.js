'use strict'

const response = require('../exchange/response')


// const set = (model, entity, context) => {
//     const log = context.logger.start('services/questions/set')
//     try {

//         if (model.name) {
//             entity.name = (model.name)
//         }
//         if (model.price) {
//             entity.price = model.price
//         }
//         if (model.status) {
//             entity.status = model.status
//         }
//         if(model.duration){
//             entity.duration=model.duration
//         }
//         if(model.durationType){
//             entity.durationType=model.durationType
//         }
//         log.end()
//         entity.save()
//         return entity
//     } catch (err) {
//         throw new Error(err)
//     }
// }

const create = async (req, model, context, res) => {
    const log = context.logger.start(`services/questions`)

    try {
        let question
        if (context.user.type == 'admin') {
            if (model.type) {
                let tempQuestion = await db.question.find({
                    type: {
                        $eq: model.type
                    }
                })
                if (tempQuestion.length < 10) {
                    question = await new db.question(model).save()
                } else {
                    throw response.unprocessableEntity(res, "unable_to_add_more_question")
                }
            }
        } else {
            throw response.unAuthorized(res, "unAuthorized_user")
        }
        log.end()
        return question

    } catch (err) {
        log.end()
        throw new Error(err)
    }
}


// const update = async (id, model, context) => {
//     const log = context.logger.start(`services/questions:${id}`)
//     try {

//         const entity = id === 'my' ? context.user.type.admin : await db.question.findById(id)

//         if (!entity) {
//             throw new Error('invalid question')
//         }

//         // call set method to update question
//         await set(model, entity, context)

//         log.end()
//         return entity
//     } catch (err) {
//         throw new Error(err)
//     }
// }

const getById = async (id, context) => {
    const log = context.logger.start(`services/questions/getById:${id}`)
    try {
        const question = await db.question.findById(id)
        log.end()
        return question
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

const get = async (req, page, context) => {
    const log = context.logger.start(`services/questions/get`)
    let questions
    let queryModel
    const params = req.query;
    try {
        if ((params.type != undefined && params.type != null)) {

            queryModel = {
                'type': {
                    $eq: params.type
                }
            }

            // find question
            questions = await db.question.find(queryModel).skip(page.skipCount).limit(page.items).sort({
                timeStamp: 1
            })
        } else {
            questions = await db.question.find().skip(page.skipCount).limit(page.items).sort({
                timeStamp: 1
            })
            // const tempquestionResponseObj = await createTempquestionObj(question, skipCount)
            // question = tempquestionResponseObj

        }
        log.end()
        return questions

    } catch (err) {
        log.end()
        throw new Error(err)
    }
}


const deletequestion = async (id, context, res) => {
    const log = context.logger.start(`services/questions/delete:${id}`)
    try {
        const question = await db.question.findByIdAndRemove(id)
        log.end()
        return question
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

exports.create = create
exports.getById = getById
exports.get = get
// exports.update = update
exports.deletequestion = deletequestion

