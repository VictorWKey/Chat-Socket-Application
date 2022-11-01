const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login',[
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password is obligatory').not().isEmpty(),
    validateFields
] , login);

router.post('/google',[
    check('id_token', 'id_token is obligatory').not().isEmpty(),
    validateFields
], googleSignIn);


module.exports = router;