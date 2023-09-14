import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SheetsService } from '../services/SheetsService'

export type DriveFileUrls = {
  webContentLink: string | undefined | null
  webViewLink: string | undefined | null
}

export class SheetsController {
  create = async (
    req: FastifyRequest<{ Body: { fileName: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    const sheetsService = new SheetsService()
    const sheets = await sheetsService.create(req.body)
    await HttpControllerUtils.sendPostResponse<DriveFileUrls>(res, sheets)
  }

  get = async (
    req: FastifyRequest<{
      Querystring: { id: string }
    }>,
    res: FastifyReply,
  ): Promise<void> => {
    const sheetsService = new SheetsService()
    const sheets = await sheetsService.getById(req.query.id)
    await HttpControllerUtils.sendPostResponse<DriveFileUrls>(res, sheets)
  }
}
