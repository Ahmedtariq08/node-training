import winston from 'winston';
const { createLogger, format } = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, label, message, timestamp, ...metadata }) => {
    const msg = `${timestamp} [${level.toUpperCase()}] : ${message} `
    metadata && msg.concat(JSON.stringify(metadata));
    return msg;
});

export const testLogger = createLogger({
    level: 'http',
    format: combine(
        timestamp({ format: 'MMMM Do, YYYY hh:mm:ss.SSS A' }),
        myFormat
    ),
    transports: [
        new winston.transports.Console({}),
        new winston.transports.File({ filename: 'logs/tests.log' }),
    ],
});


// Works for synchronous code
process.on('uncaughtException', (ex) => {
    testLogger.error(`Uncaught exception: ${ex.message}`, ex);
    process.exit(1);
})


// For async code
process.on('unhandledRejection', (ex) => {
    testLogger.error(`Unhandled rejection`, ex);
    process.exit(1);
})