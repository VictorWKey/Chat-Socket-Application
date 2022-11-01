//MODELO DE USUARIO 

const {Schema, model} = require('mongoose');

//Modelo de usuario
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', "USER_ROLE"]
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Aqui lo que hacemos es modificar lo que regresa la instancia new User, para que la respuesta no regrese "password" ni "__v" ya que el frontend no tiene porque recibir eso. Esto no modificara en lo absoluto la inserccion en la coleccion de la base de datos, solo lo que regresa la instancia.
UserSchema.methods.toJSON = function() {
    const {password, __v, _id, ...user} = this.toObject();
    
    user.uid = _id;

    return user;
};

//Con esto creamos el modelo de usuario y al mismo tiempo le damos el nombre a nuestra coleccion (tabla) en la que haremos estas insercciones en el primer parametro de "model()"
module.exports = model('User', UserSchema); //Con esto podremos crear instancias de nuestro modelo de usuario y con metodos de esa instancia, enviarlo