'use strict'

exports.toModel = entity => {
    var model = {
        _id: entity._id,
        reasonId: entity.reasonId,
        reasonName: entity.reasonName,
        reportedTo: entity.reportedTo,
        reportedBy:entity.reportedBy
    }
    //    if(entity.image){
    //        model.image={
    //            url:entity.image.url,
    //            resize_url:entity.image.resize_url,
    //            thumbnail:entity.image.thumbnail,
    //            resize_thumbnail:entity.image.resize_thumbnail
    //        }
    //    }
    return model
}