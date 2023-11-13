import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import { logger } from '../utils/logging/logger'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

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
    data.parentResId = (await ChatGptApiUtils.startConv(initialPrompt)).id

    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
      data.parentResId.substring(8),
    )

    const codePrompt = `Now I want you to act as a nodejs developer.
    The goal is to create a Google Sheets file that will contain all the information you provided to me previously.
    We'll be using the Sheets API and you will provide me with multiple answers.
    I have an application that will extract and execute the code inside your answers automatically. For that I'll be using the runInNewContext function of the vm package.
    It's imperative that they run without errors, to do so here are instructions :
      - each answer must contain exactly one block of code starting with \`\`\`javascript.
      - each block of code must be able to run independently while also using information contained in previous answers if possible,
        for example if you want to reuse the length of a variable used in a previous answer, register it and write it directly in a later step instead of referencing it.
      - additionally each step must respect instructions for code that'll be listed below.

    I'll give you some instructions for your code :
      - the variable for the id of the spreadsheet is already created and called 'spreadsheetId', use it directly and consequently never create another variable named spreadsheetId
      - I've already a sheets object that is responsible for the connection to the API client, use it directly and consequently never create another variable named sheets
      - never use variables that need to be declared before executing the block, unless I've told you to use them, like spreadsheetId or sheets
      - never write something in code that's intended to be replaced before executing it
      - ensure that you have created the functions you use
      - you shouldn't import packages, the sheets object is enough as an entry point
      - don't forget to use the await keyword, and when you use it ensure that the function is async
      - be careful to escape special characters, especially the ' symbol
      - keep the code as short as possible (don't add comments or console.log)
      - since you're not necessarily up to date, I want you to use the official documentation (https://developers.google.com/sheets/api/) as much as possible

        For the first step I want you to only create the sheets.
      `
    data.parentResId = await this.updateSpreadsheets(
      data.spreadSheetsId,
      data.parentResId,
      codePrompt,
    )

    const prompt = `For the second step I want you to create the tables without data in each sheet.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)

    await SheetsApiUtils.removeInitialSheet(data.spreadSheetsId)

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateExamples(data: Conv): Promise<SpreadSheetInfo> {
    const prompt = `For this step I want you to populate these tables with examples.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateFormulas(data: Conv): Promise<SpreadSheetInfo> {
    const prompt = `For this step I want you to add formulas inside cells to help the user of this table as much as possible.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateGraphics(data: Conv): Promise<SpreadSheetInfo> {
    const prompt = `For this step I want you to add graphs when it's relevant.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  async updateStyles(data: Conv): Promise<SpreadSheetInfo> {
    const prompt = `For this step I want you to add style to the tables with colors, borders, fonts, etc.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }

  /**
   * @deprecated
   */
  async collectInformation(data: Conv): Promise<Conv> {
    const initialPrompt = `My goal is to create of a spreadsheet.
          I'll later ask you to give me exhaustive information that I could put in that spreadsheet, like tables, sheets or graphs.
          But first I want you to give me a list of shorts questions that are related to this creation and that I could answer to help you with this task.
          The answer to a question should be simple and short, otherwise don't ask for it.
          I want the answers in the list to use the same language as the one used in the purpose while you'll continue to converse with me in English.
          Your answer must contain a block of code in json which start with \`\`\`json, it will contain the list. The type inside that block must be "{answers : string[]}".
          The purpose of my spreadsheet is : "${data.initialPrompt}"`
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)
    logger.info(`conv: ${JSON.stringify(parentRes)}`)

    data.additionalInfo = ChatGptApiUtils.extractList(parentRes.answer).map(
      (e) => {
        return { question: e, answer: '' }
      },
    )

    return data
  }

  private async updateSpreadsheets(
    spreadSheetId: string,
    parentResId: string,
    prompt: string,
  ): Promise<string> {
    const res = await ChatGptApiUtils.pursueExistingConv(parentResId, prompt)
    logger.info(
      `prompt: ${prompt}, answer size : ${res.answer.length}, spreadSheetId: ${spreadSheetId}, parentResId: ${parentResId}, answer: ${res.answer}`,
    )
    await Promise.all(
      ChatGptApiUtils.extractCode(res.answer).map(async (blockCode) => {
        await SheetsApiUtils.updateSpreadsheets(spreadSheetId, blockCode)
      }),
    )
    return res.id
  }
}
