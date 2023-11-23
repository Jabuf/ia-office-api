import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ModelService } from '../services/ModelService'
import { DriveFileInfo } from './SheetsController'
import GptApiUtils from '../utils/openai/GptApiUtils'

export type Conv = {
  initialPrompt: string
  spreadSheetsId: string
  parentResId: string
}

export type SpreadSheetInfo = {
  parentResId: string
  driveFileInfo: DriveFileInfo
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

  getStatus = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    const status = await GptApiUtils.getStatus()
    await HttpControllerUtils.sendGetResponse<{ status: boolean }>(res, {
      status,
    })
  }
}
