import { FastifyInstance } from 'fastify'
import { SheetsController } from '../controllers/SheetsController'

const sheetsController = new SheetsController()
const basePath = '/sheets'

// eslint-disable-next-line @typescript-eslint/require-await
async function sheetsRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: basePath,
    handler: sheetsController.create,
  })
  fastify.route({
    method: 'GET',
    url: basePath,
    handler: sheetsController.get,
  })
}

export default sheetsRouter
