import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SheetsService } from '../services/SheetsService'
import { drive_v3 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import Schema$File = drive_v3.Schema$File

export class SheetsController {
  create = async (
    req: FastifyRequest<{ Body: { fileName: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    const sheetsService = new SheetsService()
    const sheets = await sheetsService.create(req.body)
    await HttpControllerUtils.sendPostResponse<GaxiosResponse<Schema$File>>(
      res,
      sheets,
    )
  }
}
