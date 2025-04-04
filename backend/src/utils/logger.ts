

import {MyLogger} from "./loki-logger";


// const logger = winston.createLogger({
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   levels: customLevels.levels,
//   transports: [
//     new DailyRotateFile({
//       filename: './logs/error-%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d'
//     }), new DailyRotateFile({
//       filename: './logs/req-%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d'
//     }), new DailyRotateFile({
//       filename: './logs/res-%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d'
//     }), new DailyRotateFile({
//       filename: './logs/info-%DATE%.log',
//       datePattern: 'YYYY-MM-DD',
//       zippedArchive: true,
//       maxSize: '20m',
//       maxFiles: '14d'
//     })
//   ],
// });

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.simple()
//     )
//   }));
// }

type LoggerParamsType = {
    method: string, data?: any, message?: string, traceId?: string
}

class Logger {
    responseLogger({method, data, message, traceId}: LoggerParamsType) {
        // logger.log('res', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data)}`);
        MyLogger.success(message || '', {...data, traceId})
        console.log('res', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data, null, 2)}`);
        // logger.log('res', ``);
    }

    requestLogger({method, data, message, traceId}: LoggerParamsType) {
        // logger.log('req', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data)}`);
        MyLogger.info(message || '', {...data, traceId})
        console.log('req', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data, null, 2)}`);
        // logger.log('req', '');
    }

    errorLogger({method, data, message, traceId}: LoggerParamsType) {
        // logger.log('error', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data)}`);
        MyLogger.error(message || '', data, {traceId})
        console.log('error', `${traceId} ${message ? message + '\n' : ''}<<_${method}_>>', 'data: ${JSON.stringify(data, null, 2)}`);
        // logger.log('error', ``);
    }
}
export default new Logger();