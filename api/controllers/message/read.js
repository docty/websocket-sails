module.exports = {


  friendlyName: 'Read',


  description: 'Read message.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    const result = await Messages.find({});
    sails.io.sockets.emit('readAll', result);

    return exits.success({
      message: result
    });

  }


};
