'use strict'

exports.toModel = entity => {
    var model = {
        _id: entity._id,
        question:entity.question,
        option:entity.option,
        text:entity.text,
        option:entity.option,
        type:entity.type
    }
   
    return model
}