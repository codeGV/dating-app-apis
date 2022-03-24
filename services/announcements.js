'use strict'

const response = require('../exchange/response')


// const set = (model, entity, context) => {
//     const log = context.logger.start('services/announcements/set')
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
    const log = context.logger.start(`services/announcements`)

    try {
        let announcement
        if (context.user.type == 'admin') {


            announcement = await new db.announcement(model).save()


        } else {
            throw response.unAuthorized(res, "unAuthorized_user")
        }
        log.end()
        return announcement

    } catch (err) {
        log.end()
        throw new Error(err)
    }
}


// const update = async (id, model, context) => {
//     const log = context.logger.start(`services/announcements:${id}`)
//     try {

//         const entity = id === 'my' ? context.user.type.admin : await db.announcement.findById(id)

//         if (!entity) {
//             throw new Error('invalid announcement')
//         }

//         // call set method to update announcement
//         await set(model, entity, context)

//         log.end()
//         return entity
//     } catch (err) {
//         throw new Error(err)
//     }
// }

const getById = async (id, context) => {
    const log = context.logger.start(`services/announcements/getById:${id}`)
    try {
        const announcement = await db.announcement.findById(id)
        log.end()
        return announcement
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

const get = async (req, page, context) => {
    const log = context.logger.start(`services/announcements/get`)
    let announcements
    let queryModel
    const params = req.query;
    try {
        if ((params.status != undefined && params.status != null)) {
            queryModel = {
                'status': {
                    $eq: params.status
                }
            }
            // find announcement
            announcements = await db.announcement.find(queryModel).skip(page.skipCount).limit(page.items).sort({
                timeStamp: -1
            })
        } else {
            announcements = await db.announcement.find().skip(page.skipCount).limit(page.items).sort({
                timeStamp: -1
            })
            // const tempannouncementResponseObj = await createTempannouncementObj(announcement, skipCount)
            // announcement = tempannouncementResponseObj

        }
        log.end()
        return announcements

    } catch (err) {
        log.end()
        throw new Error(err)
    }
}


const deleteannouncement = async (id, context, res) => {
    const log = context.logger.start(`services/announcements/delete:${id}`)
    try {
        const announcement = await db.announcement.findByIdAndRemove(id)
        log.end()
        return announcement
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

exports.create = create
exports.getById = getById
exports.get = get
// exports.update = update
exports.deleteannouncement = deleteannouncement

