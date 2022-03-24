'use strict'

const bcrypt = require('bcrypt')

const getHash = (password, context) => {
    const log = context.logger.start('permit/crypto/getHash')
    const hash = bcrypt.hashSync(password, 10);
    log.end()
    return hash;
}

const compareHash = (password, hash, context) => {
    const log = context.logger.start('permit/crypto/compareHash')
    if (bcrypt.compareSync(password, hash)) {
        log.end()

        return true
    }
    return false;
    // else {
    //     return false
    // }
    // log.end()
}


exports.getHash = getHash
exports.compareHash = compareHash
