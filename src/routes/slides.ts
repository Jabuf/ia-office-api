import { FastifyInstance } from 'fastify'
import { SlideController } from '../controllers/SlideController'

const slideController = new SlideController()
const basePath = '/slides'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function slidesRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: basePath,
    handler: slideController.createSlide,
  })
}
