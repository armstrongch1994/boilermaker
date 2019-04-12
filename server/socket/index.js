// if this function is given an i/o instance, a version of the socket io library thats been married to the server => its says whenever that socket server gets a new connection from the front end, a new client, run this other function, that socket parameter is representing a new connection
// this is a connection between us the server and this new client that just joined

//
module.exports = io => {
  io.on('connection', socket => {
    console.log(
      `A socket connection to the server has been made: ${socket.id}`
    );

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`);
    });
  });
};
