const mongoose = require('mongoose');

const dbConnection = async () => {
    try {

        //Conexion
        //El objeto que lleva como parametro es una configuracion obligatorio para mongoose que siempre debe ser igual a la puesta
        //Basicamente lo que hace esto es esperar que la coneccion se haga
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); 

        console.log('Data base online');

    } catch (err) {
        console.log(err);
        throw new Error('Error a la hora de iniciar la base de datos');
    }

};

module.exports = {
    dbConnection,
}