import { FastifyInstance } from 'fastify'
import { SpreadsheetController } from '../controllers/SpreadsheetController'

const spreadsheetController = new SpreadsheetController()
const basePath = '/spreadsheets'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function spreadsheetsRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: basePath,
    handler: spreadsheetController.createSpreadsheet,
  })
  fastify.route({
    method: 'PUT',
    url: `${basePath}/charts`,
    handler: spreadsheetController.updateCharts,
  })
  fastify.route({
    method: 'GET',
    url: `${basePath}/status`,
    handler: spreadsheetController.getStatus,
  })
}
