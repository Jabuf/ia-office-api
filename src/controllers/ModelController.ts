import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ModelService } from '../services/ModelService'
import { DriveFileUrls } from './SheetsController'

export type InitialPrompt = {
  prompt: string
}

export class ModelController {
  createSpreadsheet = async (
    req: FastifyRequest<{ Body: InitialPrompt }>,
    res: FastifyReply,
  ): Promise<void> => {
    const modelService = new ModelService()
    const fileUrls = await modelService.createSpreadsheet(req.body)
    await HttpControllerUtils.sendPostResponse<DriveFileUrls>(res, fileUrls)
  }
}
