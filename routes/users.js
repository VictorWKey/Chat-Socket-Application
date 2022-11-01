
const {Router} = require('express');
const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require('../controllers/users');
const {check, query} = require('express-validator');

const { validateRole, emailExists, existsIdUser } = require('../helpers/db_validators.js');

// Una forma mas ordenada de hacer lo siguiente, es usar el index.js de la carpeta middlewares y hacer lo de abajo de esto
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { adminRole, haveRole } = require('../middlewares/validate-roles');
// const { validateFields } = require('../middlewares/validate-fields');

const {
    validateJWT,
    adminRole,
    haveRole,
    validateFields
} = require('../middlewares'); //No es necesario especificar cual archivo exactamente, ya que toma por defecto el archivo index.js

const router = Router();

//Importamos query de express-validator para hacer validaciones pero con los parametros query. Recuerda que para hacer validaciones del body y de los parametros normales se utiliza el check()
//Si no hacemos estas validaciones, tomara los parametros con un valor de NaN y por lo tanto lo tanto, no tirara error, pero si los ignorara y los pondra con sus valores por defecto
router.get('/', [
    query('limit', 'limit => must be a number').isNumeric().optional(),
    query('from', 'from => must be a number').isNumeric().optional(),
    validateFields
], usersGet)

router.post('/',[ 
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailExists),
    check('name', 'Invalid name').not().isEmpty(),
    check('password', 'Password must have more of 6 letters').isLength({min: 6}),
    // check('role', 'This role isn´t on database').isIn(["ADMIN_ROLE", "USER_ROLE"]),
    // check('role').custom(validateRole),
    validateFields
] ,usersPost); //check().isEmail() es un middleware .Hay middlewares que son necesarios que pongamos como argumento del router, estos se ejecutan antes que todo. Se pone en [] por si queremos poner mas, sino sin problema podriamos poner solo 1 middleware. Como primer parametro del check() ponemos la propiedad del body que se requiere validar. Como segundo argumento ponemos el error que deberia tirar si su validacion no se cumple. isEmail() lo que hace es indicar que lo que va validar es un email. Asi de simple y sencillo. Poner solo el middleware aqui, no hara nada, lo unico que hace es preparar los errores si es que los hay. Para poder utilizarlos, se usa validationResult(req) en el controlador. Asi que ve y fijate que hiciste ahi. El error lo envia en forma de objeto junto con otras propiedades

//En el caso del put, al poncer check('id'), 'id' sera lo que esta en el parametro de la ruta, no lo que se envia en el body
router.put('/:id',[
    // check('id').isMongoId(), //Decidimos eliminar esto, por que en el custom de abajo ya hacemos lo que realiza esta. Esto para eliminar un error que daba al poner un id que no era de moongose con la funcion que fue remplazada por existsIdUser en el apartado de helpers.
    check('id').custom(existsIdUser), 
    check('password', 'Password must have more of 6 letters').optional().isLength({min: 6}), //El metodo optional() sirve para que no sea obligatorio que la contraseña venga en el body, si si viene hace la validacion, sino no. Si no tuviera el optional() y la password no se envia en el body, tomara la validacion como un error
    check('role').optional().custom(validateRole),
    validateFields
], usersPut);

router.patch('/', usersPatch);

router.delete('/:id',[
    validateJWT,
    // adminRole, //Este a fuerza pedira que el usuario que realiza la accion se admin
    haveRole('ADMIN_ROLE', 'HELPER_ROLE', 'DEVELOPER_ROLE'), //Este verifica que el usuario que realiza esta accion tenga alguno de estos roles (se pueden pasar x cantidad de roles)
    check('id').custom(existsIdUser),
    validateFields
] , usersDelete);

module.exports = router;