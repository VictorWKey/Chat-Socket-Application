const { verifyJWT } = require("../helpers");
const { ChatMessages }= require('../models');
const chatMessages = new ChatMessages();


const socketController = async ( socket, io ) => {
    
    const user = await verifyJWT( socket.handshake.headers['x-token'] );
    if( !user ){
        return socket.disconnect();
    }

    chatMessages.connectUser( user );

    io.emit('active-users', chatMessages.usersArr )

    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id );
        io.emit('active-users', chatMessages.usersArr )
    })

    socket.on('send-message', ({ message, uid }) => {
        chatMessages.sendMessages( user.id, user.name, message);

        io.emit('receive-msg', chatMessages.last10 )
    })
}

module.exports = socketController;