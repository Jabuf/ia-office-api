import { Conv, SpreadSheetInfo } from '../controllers/SpreadsheetController'
import {
  getPromptsSpreadsheetAssisted,
  getPromptsSpreadsheetInstructions,
} from '../data/prompts'
import { CustomError, errorOpenAi } from '../utils/errors/CustomError'
import SheetsApiUtils, { SpreadsheetData } from '../utils/google/SheetsApiUtils'
import { logger } from '../utils/logging/logger'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { DriveService } from './FileService'

export class SpreadsheetService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    let chatCompletion
    if (data.assistedMode) {
      chatCompletion = await GptApiUtils.startConv(
        getPromptsSpreadsheetAssisted(data.initialPrompt),
        {
          returnJson: true,
        },
      )
    } else {
      chatCompletion = await GptApiUtils.startConv(
        getPromptsSpreadsheetInstructions(data.initialPrompt),
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

    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheet(
      spreadsheetData.title,
    )
    logger.info(
      `spreadsheetId: ${
        data.spreadSheetsId
      }, assistedMode: ${data.assistedMode.toString()}, prompt: ${
        data.initialPrompt
      }`,
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
        ...getPromptsSpreadsheetAssisted(data.initialPrompt),
        chatCompletion.choices[0].message,
      ],
      driveFileInfo: await this.driveService.getFileById(data.spreadSheetsId),
    }
  }

  async updateCharts(data: Conv): Promise<SpreadSheetInfo> {
    // TODO manage multiple charts
    // TODO Ask for advice about charts instead of the pure data
    return {
      messages: [],
      driveFileInfo: await this.driveService.getFileById(data.spreadSheetsId ?? ''),
    }
  }
}
