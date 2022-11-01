const { Router } = require('express');

const { check, query } = require('express-validator');
const { createCategories, categoriesGet, categoryGetById, updateCategory, deleteCategory } = require('../controllers/categories');
const { existsIdCategory } = require('../helpers/db_validators');
const { haveRole, validateFields, validateJWT } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', [
    query('limit', 'limit must be a number').isNumeric().optional(),
    query('from', 'from must be a number').isNumeric().optional(),
    validateFields
], categoriesGet);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id').custom(existsIdCategory),
    validateFields
], categoryGetById);

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'Name is obligatory').not().isEmpty(),
    validateFields
], createCategories)

// Actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validateJWT,
    check('name', 'Name is obligatory'),
    check('id').custom(existsIdCategory),
    validateFields
], updateCategory)

// Borrar una categoria - admin
router.delete('/:id', [
    validateJWT,
    check('id').custom(existsIdCategory),
    haveRole('ADMIN_ROLE'),
    validateFields
], deleteCategory)

module.exports = router;