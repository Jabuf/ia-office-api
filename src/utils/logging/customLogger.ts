import pino, { Logger } from 'pino'
import dotenv from 'dotenv'
import ecsFormat from '@elastic/ecs-pino-format'

dotenv.config()
const logLevel = process.env.LOG_LEVEL ?? 'info'
const nodeEnv = process.env.NODE_ENV ?? 'development'
const serviceName = process.env.ELASTIC_SERVICE_NAME

/**
 * @see {@link https://getpino.io/#/} pino documentation
 * @see {@link https://www.elastic.co/guide/en/ecs-logging/nodejs/current/pino.html#pino} elastic documentation
 * @see {@link https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/} a tutorial
 */
export let customLogger: Logger = pino({
  name: serviceName,
  level: logLevel,
})
if (nodeEnv !== 'development') {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const streams = [{ stream: process.stdout }]
  customLogger = pino(
    { name: serviceName, level: logLevel, ...ecsFormat() },
    pino.multistream(streams)
  )
}

customLogger.info(
  `Logger started on ${nodeEnv} environment, level :${customLogger.level}`
)
