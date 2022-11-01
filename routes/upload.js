const { Router } = require('express');
const { check } = require('express-validator');
const { upload, updateImage, showImage, updateImageCloudinary } = require('../controllers/upload');
const { validCollections } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const router = Router();

router.post('/',[
    validateFile
] , upload);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'Enter a format id valid').isMongoId(),
    check('collection').custom( c => validCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary);
// updateImage

router.get('/:collection/:id', [
    check('id', 'Enter a format id valid').isMongoId(),
    check('collection').custom( c => validCollections(c, ['users', 'products'])),
    validateFields
], showImage);

module.exports = router;