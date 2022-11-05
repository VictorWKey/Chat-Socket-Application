const { verifyJWT } = require("../helpers");
const { ChatMessages }= require('../models');
const chatMessages = new ChatMessages();


const socketController = async ( socket, io ) => {
    
    const user = await verifyJWT( socket.handshake.headers['x-token'] );
    if( !user ){
        return socket.disconnect();
    }

    // Conectar usuario
    chatMessages.connectUser( user );
    io.emit('active-users', chatMessages.usersArr );
    socket.emit('receive-msg', chatMessages.last10 );

    // Conectarlo a una sala especial
    socket.join( user.id ); // Lo que normalmente sucede es que cuando un socket del cliente se conecta, este se conecta a una sala global (io), a una sala propia (socket) y nosotros podemos hacer que tambien se conecta a otras salas con el nombre que queramos, como lo hacemos en esta linea. Cada socket del cliente se conectara a una sala personalizada y nombrada con el id del usuario que se verifico en ese socket



    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id );
        io.emit('active-users', chatMessages.usersArr );
    })
 
    socket.on('send-message', ({ message, uid }) => {
        if( uid ) {
            socket.to( uid ).emit('private-msg', { from: user.name, message}); // Con el to() le emitimos un evento a una sala en especifico para que solo ella lo pueda recibir
        } else {
            chatMessages.sendMessages( user.id, user.name, message);
            io.emit('receive-msg', chatMessages.last10 );
        }
    })
}

module.exports = socketController;