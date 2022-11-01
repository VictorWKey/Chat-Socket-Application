const validateJWT  = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateFields  = require('../middlewares/validate-fields');
const validateFile  = require('../middlewares/validate-file');

module.exports = {
    ...validateJWT,
    ...validateRoles,
    ...validateFields,
    ...validateFile
}