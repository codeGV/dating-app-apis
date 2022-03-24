// 'use strict'

const fs = require('fs')
const Jimp = require('jimp')
const path = require('path')
const appRoot = require('app-root-path')
const fileStoreConfig = require('config').get('providers.file-store')

const create = async (req, model, context, res) => {
    const log = context.logger.start('services/files')
    try {
        let data = await upload(req.files.file)
        const temp = {
            image: {
                url: data.url,
                thumbnail: data.thumbnail,
                resize_url: data.resize_url,
                resize_thumbnail: data.resize_thumbnail
            }
        }

        let file = await new db.file(temp).save()
        console.log(file)
        log.end()
        return file

    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

const getById = async (id, context) => {
    const log = context.logger.start(`services/files/get:${id}`)
    try {
        const file = await db.file.findById(id)
        log.end()
        return file
    } catch (err) {
        log.end()
        throw new Error(err)
    }
}

// function to upload image
const upload = async (file, context) => {
    console.log('fileeee name:', file.name);
    var parts = file.name.split(/\.(?=[^\.]+$)/);
    // let parts = file.name.split('.')

    let name = parts[0]
    let ext = parts[1]

    let destDir = path.join(appRoot.path, fileStoreConfig.dir)

    let fileName = `${name}-${Date.now()}.${ext}`

    let destination = `${destDir}/${fileName}`
    let url = `${fileStoreConfig.root}/${fileName}`

    await move(file.path, destination)

    const thumbnail = await imagethumbnail(destination)

    file.path = destination
    const resize = await resizeImage(file, context)

    return {
        url: url,
        thumbnail: thumbnail,
        resize_url: resize.url,
        resize_thumbnail: resize.thumbnail
    }
}

const move = async (oldPath, newPath) => {
    const copy = (cb) => {
        var readStream = fs.createReadStream(oldPath)
        var writeStream = fs.createWriteStream(newPath)

        readStream.on('error', cb)
        writeStream.on('error', cb)

        readStream.on('close', function () {
            fs.unlink(oldPath, cb)
        })

        readStream.pipe(writeStream)
    }

    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                if (err.code === 'EXDEV') {
                    copy(err => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    })
                } else {
                    reject(err)
                }
            } else {
                resolve()
            }
        })
    })
}

const resizeImage = async (file, context) => {
    let parts = file.name.split('.')

    let name = parts[0]
    let ext = parts[1]

    let destDir = path.join(appRoot.path, fileStoreConfig.dir)

    let fileName = `${name}-${Date.now()}.${ext}`

    let destination = `${destDir}/${fileName}`
    let url = `${fileStoreConfig.root}/${fileName}`

    await Jimp.read(file.path)
        .then(lenna => {
            return lenna
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .write(path.join(destination)) // save
        })
        .catch(err => {
            throw new Error(err)
        })

    const thumbnail = await imagethumbnail(destination)

    return {
        url,
        destination,
        thumbnail
    }
}

const imagethumbnail = (path) => {
    if (!path) {
        return Promise.resolve(null)
    }

    return new Promise((resolve, reject) => {
        return Jimp.read(path).then(function (lenna) {
            if (!lenna) {
                return resolve(null)
            }
            var a = lenna.resize(15, 15) // resize
                .quality(50) // set JPEG quality
                .getBase64(Jimp.MIME_JPEG, function (result, base64, src) {
                    return resolve(base64).save()
                })
        }).catch(function (err) {
            reject(err)
        })
    })
}

exports.upload = upload
exports.create = create
exports.getById = getById