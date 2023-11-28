import { HttpControllerUtils } from '../utils/HttpControllerUtils'
import { FastifyReply, FastifyRequest } from 'fastify'
import { SpreadsheetService } from '../services/SpreadsheetService'
import { DriveFileInfo } from './SheetsController'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'

export type Conv = {
  initialPrompt: string
  assistedMode: boolean
  spreadSheetsId?: string
  messages?: ChatCompletionMessageParam[]
}

export type SpreadSheetInfo = {
  messages: ChatCompletionMessageParam[]
  driveFileInfo: DriveFileInfo
}

export class SpreadsheetController {
  createSpreadsheet = async (
    req: FastifyRequest<{ Body: Conv }>,
    res: FastifyReply,
  ): Promise<void> => {
    const spreadsheetService = new SpreadsheetService()
    const spreadSheetInfo = await spreadsheetService.createSpreadsheet(req.body)
    await HttpControllerUtils.sendPostResponse<SpreadSheetInfo>(
      res,
      spreadSheetInfo,
    )
  }

  updateCharts = async (
    req: FastifyRequest<{ Body: Conv }>,
    res: FastifyReply,
  ): Promise<void> => {
    const spreadsheetService = new SpreadsheetService()
    const spreadSheetInfo = await spreadsheetService.updateCharts(req.body)
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
