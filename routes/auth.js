const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

router.post('/login',[
    check('email', 'Insert a correct email').isEmail(),
    check('password', 'Password is obligatory').not().isEmpty(),
    validateFields
] , login);

router.post('/google',[
    check('id_token', 'id_token is obligatory').not().isEmpty(),
    validateFields
], googleSignIn);

router.get('/', validateJWT, renewToken)

module.exports = router;