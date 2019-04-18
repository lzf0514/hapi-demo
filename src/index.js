const Hapi = require('hapi');
const Bcrypt = require('bcrypt');
const HapiJWT = require('hapi-jsonwebtoken');
const HapiJWTConfig = require('./config/jsonwebtoken');

const user = {
  username: 'john',
  password: '$2b$10$8YOSrxT75t4Okr4R6W5NzemF/Gj1XkEznZXyJlfLY/dzcdWcgtETy',
  name: 'John Doe',
  id: '23512545'
}

const validate = async (request, username, password) => {
  if (username !== user.username) {
    return { credentials: null, isValid: false }
  }

  const isValid = await Bcrypt.compare(password, user.password);
  const credentials = { id: user.id, name: user.name };

  return { isValid, credentials };
}

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })

  // await server.register(require('hapi-auth-basic'));
  // server.auth.strategy('myAuth', 'basic', { validate });

  await server.register(HapiJWT.plugin);
  server.auth.strategy('jwt', 'hapi-jsonwebtoken', HapiJWTConfig);
  // server.auth.default('jwt');

  await server.register(require('inert'));

  server.route({
    method: 'GET',
    path: '/',
    options: {
      auth: 'jwt'
    },
    handler: (request, h) => {
      return JSON.stringify(request.auth.credentials.decodeToken);
    }
  });

  server.route({
    method: 'GET',
    path: '/{name}',
    options: {
      auth: false
    },
    handler: (request, h) => {
      const token = request.server.methods.jwtSign({
        id: 1,
        name: request.params.name,
        isActive: true
      });
      return token;
    }
  });

  server.route({
    method: 'GET',
    path: '/hello',
    handler: (request, h) => {
      return h.file('./public/hello.html')
    }
  });

  await server.start();
  console.log('Server running on %ss', server.info.uri);
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();