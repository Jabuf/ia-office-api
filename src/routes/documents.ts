import { FastifyInstance } from 'fastify'
import { DocumentController } from '../controllers/DocumentController'

const documentController = new DocumentController()
const basePath = '/documents'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function documentsRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: basePath,
    handler: documentController.createSpreadsheet,
  })
}
