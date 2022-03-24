'use strict'

exports.toModel = entity => {
    var model = {
        _id: entity._id,
        name:entity.name
    }
   
    return model
}