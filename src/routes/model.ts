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
    url: `${basePath}/charts`,
    handler: modelController.updateCharts,
  })
  fastify.route({
    method: 'GET',
    url: `${basePath}/status`,
    handler: modelController.getStatus,
  })
}
