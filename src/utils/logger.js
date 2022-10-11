const winston = require('winston');

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    const { format } = winston;
    winston.add(new winston.transports.Console({
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
        ),
        // colorize: true,
        timestamp: true,
    }));
}

module.exports = winston;

