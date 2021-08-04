var faker = require('faker');
module.exports = {


  friendlyName: 'Create',


  description: 'Create message.',


  inputs: {
    message: {
      type: 'string'
    },
    nick: {
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
    sails.io.sockets.emit('message', inputs);
    await Messages.create({messageId: faker.random.alphaNumeric(10), userName: inputs.nick, textContent: inputs.message});
  }


};
