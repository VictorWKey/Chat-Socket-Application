const mongoose = require('mongoose');
const { Category, User, Product, Role } = require('../models');

const validateRole = async (role) => { //En este caso creamos nuestra propia validacion. El parametro que va dentro del callback es igual al valor que se manda en el body.
    const existsRole = await Role.findOne({role:role});

    if (!existsRole) throw new Error(`The role: ${role} is not in DB`); //No tirara un error tal cual pero es la manera en que express-validate lo agrega a su objeto de errors.

}

const emailExists = async (email = '') => {
        const existsEmail =  await User.findOne({email: email}); //Sin el await devuelve un objeto muy grande con informacion del modelo. Con el await devuelve el registro de la base de datos que cuente con lo pasado dentro del argumento de este metodo, sino devolvera null.
        if (existsEmail) throw new Error('This email is actually registered in our DB');

}
//Esta funcion remplaza la de abajo para evitar un error. El error consistia que al poner un id que no es de tipo moongose,tiraba el error del check().isMongoID() y al mismo tiempo tiraba un error de CAST, ya que lo que hace findByID es buscar con base al _id, osea al id de tipo moongose. Si no entiendes esto ignoralo. Si quieres entenderlo regresa a la clase 128 y ve los comments
// const idExists = async (id) => {
//     const existsId = await User.findById(id);

//     if (!existsId) throw new Error('This id isn´t in our database');
// }

const existsIdUser= async (id) => {
 
    if (mongoose.Types.ObjectId.isValid(id)) {
        const existId = await User.findById(id);

        if (!existId) {
            throw new Error(`The id ${id} doesn´t exists in Users DB`);
        }
        
    } else {
        throw new Error(`Id ${id} invalid`);
    }
}

const existsIdCategory = async ( id ) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const existId = await Category.findById(id);

        if (!existId) {
            throw new Error(`The id ${id} doesn´t exists in Categories DB`);
        }
        
    } else {
        throw new Error(`category ID invalid`);
    }
};

const existsIdProduct = async ( id ) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        const existId = await Product.findById(id);

        if (!existId) {
            throw new Error(`The id ${id} doesn´t exists in Product DB`);
        }
        
    } else {
        throw new Error(`product ID invalid`);
    }
};

const validCollections = (collection = '', validCollections = []) => {

    if(!validCollections.includes(collection)) {
        throw new Error('Invalid collection');
    }

    return true;

}

module.exports = {
    validateRole,
    validCollections,
    emailExists,
    existsIdUser,
    existsIdCategory,
    existsIdProduct    
}