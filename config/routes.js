/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /api/v1/join'       : { action: 'user/join'      },
  'GET /api/v1/message'    : { action: 'message/read'   },
  'POST /api/v1/message'   : { action: 'message/create' },
};
