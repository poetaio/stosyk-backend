const { execute, subscribe } = require('graphql');
const { WebSocketServer } = require('ws');
const {useServer} = require("graphql-ws/lib/use/ws");

const schema = require('../schemas/index');
const {ApolloServer} = require("apollo-server-express");
const {ApolloServerPluginDrainHttpServer} = require("apollo-server-core");
const {errorHandlingMiddleware} = require("../middleware");


module.exports = async (httpServer, expressServer, pubsub) => {
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    }, () => console.log(`WebSocket server is running on http://localhost:8889/subscriptions`));

    const serverCleanup = useServer({
        schema,
        execute,
        subscribe,
        context: ({ connectionParams }) => ({ pubsub, authHeader: connectionParams?.Authorization }),
        keepAlive: 10000
    }, wsServer);


    // Set up ApolloServer.
    const server = new ApolloServer({
        schema,
        context: ({ connectionParams }) => ({ pubsub, authHeader: connectionParams?.Authorization }),
        formatError:  (err) => errorHandlingMiddleware(err),
        csrfPrevention: true,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();
    server.applyMiddleware({ app: expressServer });

    return wsServer;
};
