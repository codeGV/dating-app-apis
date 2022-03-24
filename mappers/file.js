'use strict'

exports.toModel = entity => {
    var model = {
        _id: entity._id
    }
    if (entity.image) {
        model.image = {
            url: entity.image.url,
            resize_url: entity.image.resize_url,
            thumbnail: entity.image.thumbnail,
            resize_thumbnail: entity.image.resize_thumbnail
        }
    }
    return model
}