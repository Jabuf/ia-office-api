import { FastifyInstance } from 'fastify'
import { FileController } from '../controllers/FileController'

const fileController = new FileController()
const basePath = '/files'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function filesRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: basePath,
    handler: fileController.getFiles,
  })
}
