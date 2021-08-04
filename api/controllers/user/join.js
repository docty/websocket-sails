const activeUsers = new Map();
module.exports = {


  friendlyName: 'Join',


  description: 'Join user.',


  inputs: {
    userName: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits, env) {
    const {res, req} = env;
    if(!req.isSocket){
      return res.badRequest();
    }

    const socketId = sails.sockets.getId(req);
    activeUsers.set(socketId, inputs.userName);
    sails.io.sockets.activeUser = activeUsers;
    sails.io.sockets.emit('new user', [...activeUsers.values()]);
  }


};
