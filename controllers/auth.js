const bcryptjs = require('bcryptjs');
const { response, request, json } = require("express");
const generateJWT = require('../helpers/generate-jwt.js');
const { googleVerify } = require('../helpers/google-verify.js');
const User = require('../models/user.js');

const login = async (req = request, res = response) => {

    try{
        //Validar email
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                msg: 'Invalid user credentials - Email'
            })
        }

        //Validar si esta activo
        if(!user.state){
            return res.status(400).json({
                msg: 'Invalid user credentials - state = false'
            })
        }

        //Validar password
        const validPassword = bcryptjs.compareSync(password, user.password); //Devuelve true si la contraseña enviada en la propiedad password es igual a la contraseña encriptada de la base datos de ese usuario
        if(!validPassword){
            return res.status(400).json({
                msg: 'Invalid user credentials - Password'
            })
        }

        //Enviar JWT
        const token = await generateJWT(user.id); // Ention que user.id no exista pero si ponemos user._uid nos devolver un objeto raro, pero para obtener directamente el id se utiliza esta forma: user.id


        res.json({
            user,
            token
        });

    } catch (err) {
        
        console.log(err);
        res.status(500).json({
            msg: 'Ocurrio algo mal en el servidor'
        })

    }
};

const googleSignIn = async (req, res = response) => {
    const {id_token } = req.body;

    try {

        const {name, email, img} = await googleVerify(id_token);
        
        let user = await User.findOne({email});

        if ( !user ) {
            const data = {
                name,
                email,
                img,
                password: 'p455w0rd',
                role: 'USER_ROLE',
                google: true
            };

            user = new User (data);
            await user.save();
        }

        if( !user.state) {
            return res.status(401).json({
                msg: 'Talk with the admin, the user was blocked',
            })
        }

        //Enviar JWT
        const token = await generateJWT(user.id);

        res.status(200).json({
            msg: 'All right! google sign-in',
            token,
            user
        })

    } catch ( err ) {

        res.status(400).json(
            {
                ok: false,
                msg: 'Token cannot be verified'
            }
        )
    }


};

module.exports = {
    login,
    googleSignIn
}