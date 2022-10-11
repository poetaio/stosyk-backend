const { execute, subscribe } = require('graphql');
const { WebSocketServer } = require('ws');
const {useServer} = require("graphql-ws/lib/use/ws");

const schema = require('../graphql/index');
const {ApolloServer} = require("apollo-server-express");
const {ApolloServerPluginDrainHttpServer} = require("apollo-server-core");
const {errorHandlingMiddleware} = require("../middleware");
const {logger} = require("../utils");


module.exports = async (httpServer, expressServer, pubsub) => {
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    }, () => logger.info(`WebSocket server is running on http://localhost:8889/subscriptions`));

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
        context: (({req}) => ({ pubsub, authHeader: req.headers.authorization })),
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
