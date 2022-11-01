//Es necesario hacer esto para tener el tipado (para que nos rellene automaticamente cuando necesitemos poner un metodo con "req" o "res");
//Es solo para agilizar el llenado de codigo, no es necesario hacerlo
const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
// const {validationResult} = require('express-validator')

const User = require('../models/user');

const usersGet = async (req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;

    const condition = {state: true}; //Debido a que el state significa si estan o no eliminados de la base de datos, se utiliza esto. Recuerda que cuando eliminamos un usario de la base de datos, no se elimina tal cual (aunque si se puede para yo no se hace eso), solo cambia su estado a false.
    
    //-----------------------------------------------------------------------
    // Esta forma es valida? si pero como hay dos await que ninguno de ellos depende del otro, nos ahorrariamos tiempo de carga si los ejecutamos al mismo tiempo, para eso se usa Promise.all
    // const users = await User.find(condition) //Devuelve todos los registros de esa coleccion. Debido al "condition" como parametro, devolvera solo los registros que cuenten con eso de la condicion
    //     .limit(Number(limit)) //Limitamos la cantidad de registros que va devolver
    //     .skip(Number(from)) //Le decimos despues de cual registro va comenzar a devolver

    // const total = await User.count(condition);
    //-----------------------------------------------------------------------

    //Ejecutar y devolver la respuesta de varias promesas al mismo tiempo (dentro de un array):
    const [total, users] = await Promise.all([
        User.count(condition),
        User.find(condition)
            .limit(limit)
            .skip(from)    
    ]) //Esto devolvera un array con las respuesta de sus promesas en sus respectivas posiciones, por eso usamos la destructuracion, para que sea igual la manera de enviar la respuesta a que si usaramos lo de arriba

    res.json(
        {
            total,
            users
        }
    );
};

const usersPost = async (req = request, res = response) => {

    //--------------------------------------------------------------
    // const errors = validationResult(req); //Devuelve en forma de objeto con una propedad llamada formatter (no es importante) y otra errors, la cual, dentro de ella hay un array con las validaciones erroneas. Trae alguna validacion erronea si es que la hay, sino el array se queda vacio.
    // console.log(errors);
    //isEmpty() verifica si el array de las validaciones que trajo esta vacio (devuelve true), pero si si trajo validaciones erroneas devuelve false
    // if ( !errors.isEmpty() ) {
    //     return res.status(400).json(errors); //Por alguna razon el valor de errors aqui ignora la propiedad "formatter" y no la pone (solo como si estuviera la de errors). En realidad si quieres ignorar todo esto, ignoralo, solo fue para comprender mas el middleware utilizado para validaciones
    // }
    //--------------------------------------------------------------
    //Debido a que todo lo anterior es muy posible que lo vayamos a utilizar en varias rutas, hay que convertirlo en una funcion mejor no?, en este caso no, en este caso lo podemos convertir en un middleware, debido a que hace uso del req y el res y los middlewares tiene acceso a estos antes de que se llame al controlador

    const {name, password, role, email} = req.body;
    const user = new User({name, password, role, email}); //Aqui solo creamos la instancia de la inserccion en la base de datos



    // Encriptar la contraseña 
    const salt = bcryptjs.genSaltSync(10); //10 es el valor por defecto aunque no se lo pongamos. El numero que pongamos como parametro es el numero de vueltas que se le dara la encryptacion, es decir, entre mas vueltas, mas segura la encriptacion, pero el numero intermedio de seguridad es 10.
    user.password = bcryptjs.hashSync(password, salt); //Como primer parametro nos pide el string que queremos encriptar y como segundo el salt.Con esto creamos un hash de esa contraseña y por lo tanto la encriptamos. El hash sirve para que cuando hackeen nuestra base de datos o alguien mas la vea, no pueda saber nadie, cual es la verdadera contraseña de los usuarios. No importa que otros usuarios tengan la misma contraseña, cada hash sera totalmente diferente.

    // Guardar en DB
    await user.save(); //Aca guardamos esa instancia y la enviamos a la base de datos, siempre y cuando se cumplan todos los requisitos de nuestro modelo de usuario 

    res.json(
        {
            msg: 'xd',
            user
        }
    );
};

const usersPut = async (req = request, res = response) => {
    const {id} = req.params;
    const {_id, password, google, ...other} = req.body; //el id se saca pq si lo incluimos y le damos otro valor, dara error.

    //Aqui lo que haces es verificar si cambio o no la contraseña, y si si, la encriptamos
    if (password) {
        const salt = bcryptjs.genSaltSync(10); //10 es el valor por defecto aunque no se lo pongamos. El numero que pongamos como parametro es el numero de vueltas que se le dara la encryptacion, es decir, entre mas vueltas, mas segura la encriptacion, pero el numero intermedio de seguridad es 10.
        other.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, other); //Aqui lo que hacemos es buscar un registro con el id del parametro, y cambiaremos las propiedades que vengan en "other"

    res.json(
        {
            msg: 'put response - controller',
            user
        }
    );
};

const usersPatch = (req = request, res = response) => {
    res.json(
        {
            msg: 'patch response - controller'
        }
    );
};

const usersDelete = async (req = request, res = response) => {
    const {id} = req.params;

    const userAuth = req.userAuth;

    // Eliminar fisicamente de la base de datos
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {state: false});

    res.json(
        user
    );
};


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}