import { FastifyInstance } from 'fastify'
import { ModelController } from '../controllers/ModelController'

const modelController = new ModelController()
const basePath = '/model'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function modelRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: basePath,
    handler: modelController.createSpreadsheet,
  })
  fastify.route({
    method: 'PUT',
    url: `${basePath}/data`,
    handler: modelController.updateData,
  })
  fastify.route({
    method: 'PUT',
    url: `${basePath}/graphics`,
    handler: modelController.updateGraphics,
  })
  fastify.route({
    method: 'PUT',
    url: `${basePath}/styles`,
    handler: modelController.updateStyles,
  })
  fastify.route({
    method: 'GET',
    url: basePath,
    handler: modelController.collectInformation,
  })
}
