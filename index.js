"use strict";
require('dotenv').config();
const Hapi = require('@hapi/hapi');

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/',
  handler: (req, h) => {
    return 'Hello from HapiJS!';
  }
});

server.route({
  method: 'GET',
  path: '/{creation_id}',
  handler: (req, h) => {
    const creationUri = req.params.creation_id
    return 'URI: ' + creationUri;
  }
});

server.start();
console.log('Server running on %s', server.info.uri);
console.log(process.env.DB_HOST);