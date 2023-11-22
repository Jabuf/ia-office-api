import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, {
  ChartData,
  SpreadsheetData,
} from '../utils/google/SheetsApiUtils'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'
import { logger } from '../utils/logging/logger'
import { CustomError } from '../utils/errors/CustomError'
import {
  promptChartsCreation,
  promptSpreadsheetAdvices,
  promptSpreadsheetCreation,
} from '../data/prompts'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    const initialPrompt = `${promptSpreadsheetAdvices} "${data.initialPrompt}"`
    const gptRes = await ChatGptApiUtils.startConv(initialPrompt)

    const res = await ChatGptApiUtils.pursueExistingConv(
      gptRes.id,
      promptSpreadsheetCreation,
    )

    const spreadsheetData = ChatGptApiUtils.extractJson<SpreadsheetData>(
      res.answer,
    )

    if (!spreadsheetData) {
      throw new CustomError(
        'ERROR_JSON',
        `The answer does not contain a valid JSON block : ${res.answer}`,
        'ERROR_JSON',
      )
    }

    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
      spreadsheetData.title,
    )
    logger.info(
      `spreadsheetId: ${data.spreadSheetsId}, prompt: ${initialPrompt}`,
    )

    await SheetsApiUtils.createSheets(
      data.spreadSheetsId,
      spreadsheetData.sheetsData.map((e) => e.name) ?? [],
    )
    await SheetsApiUtils.updateSheet(
      data.spreadSheetsId,
      spreadsheetData.sheetsData,
    )

    await SheetsApiUtils.removeInitialSheet(data.spreadSheetsId)

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateCharts(data: Conv): Promise<SpreadSheetInfo> {
    // TODO manage multiple charts
    // TODO Ask for advice about charts instead of the pure data
    const res = await ChatGptApiUtils.pursueExistingConv(
      data.parentResId,
      promptChartsCreation,
    )

    const chartData = ChatGptApiUtils.extractJson<ChartData>(res.answer)
    if (chartData) {
      await SheetsApiUtils.addCharts(data.spreadSheetsId, chartData)
    }

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }
}
