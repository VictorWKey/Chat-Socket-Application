const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');
const fileUpload = require('express-fileupload');
const socketController = require('../sockets/controller.js');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            upload: '/api/upload',
            users: '/api/users'
        }

        //Database connection
        this.connectDB();

        //Middlewares
        this.middlewares();
        
        //Routes of my application
        this.routes();

        // Sockets
        this.sockets();
    }


    async connectDB(){
        await dbConnection();
    }

    middlewares(){

        //Cors
        this.app.use(cors());

        //Lectura y parseo del body || este es estrictamente necesarios para que los bodys puedan enviar y recibir en formato json
        this.app.use(express.json());

        // Public directory
        this.app.use(express.static('public'));

        // Upload files 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // Cuando intentemos guardar un archivo en una carpeta que no esta creada, esta propiedad hace que la carpeta se cree automaticamente y asi no nos tira un error
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.js'));
        this.app.use(this.paths.categories, require('../routes/categories.js'));
        this.app.use(this.paths.products, require('../routes/products.js'));
        this.app.use(this.paths.search, require('../routes/search.js'));
        this.app.use(this.paths.upload, require('../routes/upload.js'));
        this.app.use(this.paths.users, require('../routes/users.js'));
    }

    sockets(){
        this.io.on('connection', socket => socketController(socket, this.io))
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Server running in port: ' + this.port)
        });
    }
}

module.exports = Server;



