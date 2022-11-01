const { response, request } = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if( !token ) {
        res.status(401).json({
            msg: 'JWT Required'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY); //Este metodo devuelve el payload del token

        const user = await User.findById(uid);

        if( !user ) {
            return res.status(404).json({
                msg: 'Invalid auth token - user doesn´t exists at database'
            })
        }

        if( !user.state ) {
            return res.status(404).json({
                msg: 'Invalid auth token - user with state = false'
            })
        }

        req.userAuth = user;

        next();

    } catch ( err ) {
        console.log(err);
        
        res.status(401).json({
            msg: 'JWT Invalid '
        })
    }
};

module.exports = {
    validateJWT
};