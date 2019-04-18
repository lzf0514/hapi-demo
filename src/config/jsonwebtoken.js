'use strict';

module.exports = {
    secretOrPrivateKey: 's3cr3t',
    sign: {},
    decode: {},
    verify: {},
    getToken: (request) => {

        return request.headers.authorization;
    },
    validate: (request, payload, h) => {
        const token = request.headers.authorization;
        const decodeToken = request.server.methods.jwtDecode(token);

        // select db by payload

        return {
            isValid: true, // select db by payload
            credentials: { id: payload.id, name: payload.name, decodeToken }
        };
    }
};