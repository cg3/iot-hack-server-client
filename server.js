var Hapi = require('hapi');
var Path = require('path');
var server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000,
  routes: {
    cors: true,
    files: {
        relativeTo: Path.join(__dirname, 'public')
    }
  }
});

var io = require('socket.io')(server.listener);
io.on('connection', function (socket) {

  socket.emit('data', data);
});

var data = null;

server.register(require('inert'), () => { 
  server.route({
    method: 'GET',
    path: '/adddata',
    handler: function (request, reply) {
      data = request.query;
      io.sockets.emit('data', data);
      reply();
    }
  });

  server.route({
    method: 'POST',
    path: '/data',
    handler: function (request, reply) {
      reply();
      data = request.payload;
      io.sockets.emit('data', data);
    }
  });

  server.route({
    method: 'GET',
    path: '/data',
    handler: function (request, reply) {
      reply(data);
    }
  })

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
  });

  server.start((err) => {
    console.log(err);
    console.log(server.info.uri);
  });
});