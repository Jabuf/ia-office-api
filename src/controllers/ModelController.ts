import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ModelService } from '../services/ModelService'
import { DriveFileInfo } from './SheetsController'

export type Conv = {
  initialPrompt: string
  additionalInfo: AdditionalInfo[]
  spreadSheetsId: string
  parentResId: string
}

export type SpreadSheetInfo = {
  parentResId: string
  driveFileInfo: DriveFileInfo
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
    const spreadSheetInfo = await modelService.createSpreadsheet(req.body)
    await HttpControllerUtils.sendPostResponse<SpreadSheetInfo>(
      res,
      spreadSheetInfo,
    )
  }

  updateFormulas = async (
    req: FastifyRequest<{ Body: Conv }>,
    res: FastifyReply,
  ): Promise<void> => {
    const modelService = new ModelService()
    const spreadSheetInfo = await modelService.updateFormulas(req.body)
    await HttpControllerUtils.sendPutResponse<SpreadSheetInfo>(
      res,
      spreadSheetInfo,
    )
  }

  updateCharts = async (
    req: FastifyRequest<{ Body: Conv }>,
    res: FastifyReply,
  ): Promise<void> => {
    const modelService = new ModelService()
    const spreadSheetInfo = await modelService.updateCharts(req.body)
    await HttpControllerUtils.sendPutResponse<SpreadSheetInfo>(
      res,
      spreadSheetInfo,
    )
  }
}
