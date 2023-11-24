import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, { SpreadsheetData } from '../utils/google/SheetsApiUtils'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { logger } from '../utils/logging/logger'
import { CustomError, errorOpenAi } from '../utils/errors/CustomError'
import {
  getPromptsSpreadsheetCreationA,
  getPromptsSpreadsheetCreationB,
} from '../data/prompts'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    let chatCompletion
    if (data.assistedMode) {
      chatCompletion = await GptApiUtils.startConv(
        getPromptsSpreadsheetCreationA(data.initialPrompt),
        {
          returnJson: true,
        },
      )
    } else {
      chatCompletion = await GptApiUtils.startConv(
        getPromptsSpreadsheetCreationB(data.initialPrompt),
        {
          returnJson: true,
        },
      )
    }

    if (!chatCompletion.choices[0].message.content) {
      throw errorOpenAi
    }

    const spreadsheetData = JSON.parse(
      chatCompletion.choices[0].message.content,
    ) as SpreadsheetData

    if (!spreadsheetData) {
      throw new CustomError(
        'ERROR_JSON',
        `The answer does not contain a valid JSON block : ${chatCompletion.choices[0].message.content}`,
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
      messages: [
        ...getPromptsSpreadsheetCreationA(data.initialPrompt),
        chatCompletion.choices[0].message,
      ],
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
      messages: [],
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }
}
