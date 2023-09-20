import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ModelService } from '../services/ModelService'
import { DriveFileUrls } from './SheetsController'

export type Conv = {
  prompt: string
  additionalInfo: AdditionalInfo[]
}

export type AdditionalInfo = {
  question: string
  answer: string
}

export class ModelController {
  createSpreadsheet = async (
    req: FastifyRequest<{ Body: Conv }>,
    res: FastifyReply,
  ): Promise<void> => {
    const modelService = new ModelService()
    const fileUrls = await modelService.createSpreadsheet(req.body)
    await HttpControllerUtils.sendPostResponse<DriveFileUrls>(res, fileUrls)
  }

  collectInformation = async (
    req: FastifyRequest<{
      Querystring: Conv
    }>,
    res: FastifyReply,
  ): Promise<void> => {
    const modelService = new ModelService()
    const conv = await modelService.collectInformation(req.query)
    await HttpControllerUtils.sendGetResponse<Conv>(res, conv)
  }
}
