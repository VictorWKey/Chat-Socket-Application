const { Router } = require('express');

const { check, query } = require('express-validator');
const { createProduct, productsGet, productGetById, updateProduct, deleteProduct } = require('../controllers/products');
const { existsIdProduct, existsIdCategory } = require('../helpers/db_validators');
const { haveRole, validateFields, validateJWT } = require('../middlewares');

const router = Router();




router.get('/', [
    query('limit', 'limit must be a number').isNumeric().optional(),
    query('from', 'from must be a number').isNumeric().optional(),
    validateFields
], productsGet);

router.post('/', [
    validateJWT,
    check('name', 'name is obligatory').not().isEmpty(),
    check('category').custom(existsIdCategory),
    check('price').isNumeric(),
    validateFields
], createProduct)

router.get('/:id', [
    check('id').custom(existsIdProduct),
    validateFields
], productGetById);

router.put('/:id', [
    validateJWT,
    check('id').custom(existsIdProduct),
    check('price').isNumeric(),
    check('category').custom(existsIdCategory).optional(),
    validateFields
], updateProduct)

router.delete('/:id', [
    validateJWT,
    check('id').custom(existsIdProduct),
    haveRole('ADMIN_ROLE'),
    validateFields
], deleteProduct)



module.exports = router;