const { response } = require("express")

const adminRole = (req, res = response, next) => {
    
    if (!req.userAuth) {
        res.status(500).json({
            msg: 'Error, primero debe validarse el token antes de validar el rol'
        })
    }

    const {role, name} = req.userAuth;

    if (role !== 'ADMIN_ROLE'){
        res.status(401).json({
            msg: `${ name } isn´t a admin - he can´t do this`
        })
    }

    next();
}

const haveRole = ( ...roles ) => {
    return ( req, res, next ) => {

        if (!req.userAuth) {
            res.status(500).json({
                msg: 'Error, primero debe validarse el token antes de validar el rol'
            })
        }
        
        if( !roles.includes(req.userAuth.role) ) {
            res.status(401).json({
                msg: `The request require one of these roles: ${ roles }`
            })
        }

        next();
    }
}

module.exports = {
    adminRole,
    haveRole
}