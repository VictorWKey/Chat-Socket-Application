const jwt = require('jsonwebtoken');

const generateJWT = ( uid ) => {
    return new Promise ( (res, rej) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if ( err ) {
                console.log(err);
                rej( 'Token can´t be generated' )
            } else {
                res( token );
            }
        })
    } )
};

module.exports = generateJWT;