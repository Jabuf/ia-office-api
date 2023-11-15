import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, { SpreadsheetData } from '../utils/google/SheetsApiUtils'
import { logger } from '../utils/logging/logger'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

const spreadsheetExample: SpreadsheetData = {
  title: 'My spreadsheet title',
  sheetsData: [
    {
      name: 'MySheet1',
      values: [
        ['Name', 'Job'],
        ['John', 'CEO'],
        ['Robert', 'Salesman'],
      ],
    },
    {
      name: 'MySheet2',
      values: [
        ['Sales', 'Month'],
        ['123', 'january'],
        ['456', 'march'],
      ],
    },
  ],
}

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    const initialPrompt = `I will give you a prompt that have for goal the creation of a spreadsheet.
        I want you to give me an exhaustive list of information I could put in that spreadsheet, like tables, sheets or graphs.
        I want the label in your answers to use the same language used in the prompt while you'll continue to converse with me in English.
        The prompt is "${data.initialPrompt}"`
    const gptRes = await ChatGptApiUtils.startConv(initialPrompt)

    const prompt = `Now I want to create a Sheets file using the Sheets API. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    First I want you to return me the a JSON object following the example that I will give you and that will contain the information you mentioned previously:
    ${JSON.stringify(spreadsheetExample)}`
    const res = await ChatGptApiUtils.pursueExistingConv(gptRes.id, prompt)
    logger.info(
      `parentId: ${gptRes.id}, 
      answer size : ${JSON.stringify(res.usage)}, 
      spreadSheetId: ${data.spreadSheetsId}, 
      answer: ${res.answer},
      prompt: ${prompt}`,
    )

    const spreadsheetData = ChatGptApiUtils.extractJson<SpreadsheetData>(
      res.answer,
    )
    if (spreadsheetData) {
      data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
        spreadsheetData.title,
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
    }

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateFormulas(data: Conv): Promise<SpreadSheetInfo> {
    // const prompt = `For this step I want you to add formulas inside cells to help the user of this table as much as possible while following the same instructions as the previous request.`
    // data.parentResId = await this.updateSpreadsheets(
    //   data.spreadSheetsId,
    //   data.parentResId,
    //   prompt,
    // )
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateGraphics(data: Conv): Promise<SpreadSheetInfo> {
    // const prompt = `For this step I want you to add graphs when it's relevant while following the same instructions as the previous request.`
    // data.parentResId = await this.updateSpreadsheets(
    //   data.spreadSheetsId,
    //   data.parentResId,
    //   prompt,
    // )
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateStyles(data: Conv): Promise<SpreadSheetInfo> {
    // const prompt = `For this step I want you to add style to the tables with colors, borders, fonts, etc.`
    // data.parentResId = await this.updateSpreadsheets(
    //   data.spreadSheetsId,
    //   data.parentResId,
    //   prompt,
    // )
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  private async updateSpreadsheets(
    spreadSheetId: string,
    parentResId: string,
    prompt: string,
  ): Promise<string> {
    const res = await ChatGptApiUtils.pursueExistingConv(parentResId, prompt)
    logger.info(
      `parentId: ${parentResId}, 
      answer size : ${JSON.stringify(res.usage)}, 
      spreadSheetId: ${spreadSheetId}, 
      prompt: ${0}, 
      answer: ${res.answer}`,
    )
    if (res.usage?.total_tokens && res.usage?.total_tokens > 4000) {
      logger.warn(
        `The number of tokens is close to exceeding the limit : ${JSON.stringify(
          res.usage,
        )}`,
      )
    }
    await Promise.all(
      ChatGptApiUtils.extractCode(res.answer).map(async (blockCode) => {
        await SheetsApiUtils.updateSpreadsheets(spreadSheetId, blockCode)
      }),
    )
    return res.id
  }
}
