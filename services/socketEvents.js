const socket = require('socket.io');


exports = module.exports = function (io) {
    const users = {}
    io.on('connection', socket => {
        /* If any new user joins, let other users connected to the server know!*/
        socket.on('new-user-joined', name => {
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        });

        /* If someone sends a message, broadcast it to other people*/
        socket.on('send-message', message => {
            socket.broadcast.emit('message-receive', { message: message, name: users[socket.id] })
        });

        socket.on('disconnect', message => {
            socket.broadcast.emit('user-left', users[socket.id]);
            delete users[socket.id];
        });
    })
}