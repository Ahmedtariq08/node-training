import winston from 'winston';
const { createLogger, format } = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, label, message, timestamp, ...metadata }) => {
    const msg = `${timestamp} [${level.toUpperCase()}] : ${message} `
    metadata && msg.concat(JSON.stringify(metadata));
    return msg;
});

export const logger = createLogger({
    level: 'http',
    format: combine(
        timestamp({ format: 'MMMM Do, YYYY hh:mm:ss.SSS A' }),
        myFormat
    ),
    transports: [
        new winston.transports.Console({}),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log' }),
    ],
});

if (process.env.NODE_ENV === 'dev') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Works for synchronous code
process.on('uncaughtException', (ex) => {
    logger.error(`Uncaught exception: ${ex.message}`, ex);
    process.exit(1);
})


// For async code
process.on('unhandledRejection', (ex) => {
    logger.error(`Unhandled rejection`, ex);
    process.exit(1);
})