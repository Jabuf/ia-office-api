import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, { SpreadsheetData } from '../utils/google/SheetsApiUtils'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { logger } from '../utils/logging/logger'
import { CustomError, errorOpenAi } from '../utils/errors/CustomError'
import {
  getPromptsSpreadsheetAdvices,
  getPromptsSpreadsheetCreation,
} from '../data/prompts'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    const chatCompletion = await GptApiUtils.startConv(
      getPromptsSpreadsheetAdvices(data.initialPrompt),
    )

    const res = await GptApiUtils.startConv(getPromptsSpreadsheetCreation(), {
      previousMessages: [chatCompletion.choices[0].message],
      returnJson: true,
    })

    if (!res.choices[0].message.content) {
      throw errorOpenAi
    }

    const spreadsheetData = JSON.parse(
      res.choices[0].message.content,
    ) as SpreadsheetData

    if (!spreadsheetData) {
      throw new CustomError(
        'ERROR_JSON',
        `The answer does not contain a valid JSON block : ${res.choices[0].message.content}`,
        'ERROR_JSON',
      )
    }

    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
      spreadsheetData.title,
    )
    logger.info(
      `spreadsheetId: ${data.spreadSheetsId}, prompt: ${data.initialPrompt}`,
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
    // const res = await GptApiUtils.pursueExistingConv(
    //   data.parentResId,
    //   promptChartsCreation,
    // )
    //
    // const chartData = GptApiUtils.extractJson<ChartData>(res.answer)
    // if (chartData) {
    //   await SheetsApiUtils.addCharts(data.spreadSheetsId, chartData)
    // }

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }
}
