const winston = require('winston');
const {GraphQLError} = require("graphql");
const { format, transports } = winston;

const enumerateErrorFormat = format(info => {
    if (info.message instanceof Error) {
        info.message = {
            message: info.message.message,
            stack: info.message.stack,
            ...info.message
        };
    }

    if (info instanceof GraphQLError) {
        info = {
            message: info.message,
            stack: info.originalError?.stack,
            ...info
        };
    }

    if (info instanceof Error) {
        return {
            message: info.message,
            stack: info.stack,
            ...info
        };
    }

    return info;
})();

const logger = winston.createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        enumerateErrorFormat,
        format.printf(info =>
            `${info.timestamp} ${info?.level?.toUpperCase()}: ${info.message}${info.stack ? `\n${info.stack}` : ''}${(info.splat!==undefined?`${info.splat}`:" ")}`
        )
    ),
    transports: [new transports.Console()],
});


// If we're in production then logging is disabled
if (process.env.NODE_ENV === 'production') {
    logger.transports[0].level = 'error';
}

module.exports = logger;

