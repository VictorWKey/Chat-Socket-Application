
const generateJWT = require('./generate-jwt.js');
const googleVerify = require('./google-verify.js');
const DbValidators= require('./db_validators.js');
const uploadFile = require('./upload-file.js');

module.exports = {
    ...generateJWT,
    ...googleVerify,
    ...DbValidators,
    ...uploadFile
}