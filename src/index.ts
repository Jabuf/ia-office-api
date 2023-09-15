import 'regenerator-runtime/runtime.js'
import fastify from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import middleware from '@fastify/middie'
import xXssProtection from 'x-xss-protection'
import { customLogger } from './utils/logging/customLogger'
import dotenv from 'dotenv'
import { PrismaClientUtils } from './utils/db/PrismaClientUtils'
import { PrismaClient } from '@prisma/client'
import sheetsRouter from './routes/sheets'
import { ApiPrefixes } from './routes/urlConstants'

dotenv.config()

const port = process.env.PORT ?? 8080
const host = process.env.HOST ?? 'localhost'
const whitelist =
  (process.env.CORS_WHITELIST && process.env.CORS_WHITELIST.split(',')) || true

export let prismaClient: PrismaClient

/**
 * Start a Fastify server
 */
export async function startServer() {
  try {
    const server = await fastify({
      logger: customLogger,
    })

    // Middlewares managed by a @fastify package
    await server.register(helmet)
    // https://github.com/fastify/fastify-cors#options
    customLogger.info(whitelist)
    await server.register(cors, {
      origin: whitelist,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })

    // Additional middlewares : https://www.fastify.io/docs/latest/Reference/Middleware/
    await server.register(middleware)
    server.use(xXssProtection())

    // Register the routes
    await server.register(sheetsRouter, { prefix: ApiPrefixes.V1 })
    customLogger.info(`Routes registered${server.printRoutes()}`)

    server.setErrorHandler((error, request, reply) => {
      server.log.error(error)
    })

    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () => {
          void (async () => {
            await server.close().then((err) => {
              customLogger.error(`close application on ${signal}`)
              process.exit(err ? 1 : 0)
            })
          })()
        })
      }
    }

    customLogger.info('Starting the prisma client')
    prismaClient = await PrismaClientUtils.initPrismaClient()
    customLogger.info('The prisma client has been successfully started!')

    // Starting the server
    await server.listen({ port: Number(port), host })

    process.on('uncaughtException' || 'unhandledRejection', (err) => {
      customLogger.error(err)
      process.exit(1)
    })
  } catch (e) {
    customLogger.error(e)
  }
}

void startServer()
