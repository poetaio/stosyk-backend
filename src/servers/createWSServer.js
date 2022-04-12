const { execute, subscribe } = require('graphql');
const { WebSocketServer } = require('ws');
const {useServer} = require("graphql-ws/lib/use/ws");

const schema = require('../schemas/index');


module.exports = (expressServer, pubsub) => {
    const wsServer = new WebSocketServer({
        // server: expressServer,
        path: '/subscriptions',
        // port: process.env.WS_PORT,
        port: 8889,
    }, () => console.log(`WebSocket server is running on http://localhost:8889/subscriptions`));

    useServer({
        schema,
        execute,
        subscribe,
        context: { pubsub },
        keepAlive: 10000,
        }, wsServer);

    return wsServer;
};
