import { DriveFileUrls } from '../controllers/SheetsController'
import { Conv } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import { logger } from '../utils/logging/logger'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<DriveFileUrls> {
    const initialPrompt = `I will give you a prompt that have for goal the creation of a spreadsheet.
        I want you to give me an exhaustive list of information I could put in that spreadsheet, like tables, sheets or graphs.
        I want the label in your answers to use the same language used in the prompt while you'll continue to converse with me in English.
        The prompt is "${data.initialPrompt}"`
    data.parentResId = (await ChatGptApiUtils.startConv(initialPrompt)).id

    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
      data.parentResId.substring(8),
    )
    // Step 1
    const codePrompt = `Now I want to put all the information you just provided to me in a spreadsheet, including graphs, sheets and examples for values.
        We'll be using the Sheets API in nodejs and want you to provide me with blocks of code.

        We'll be proceeding in multiple steps. Here are some instructions about how these steps will work : 
          each step must contain one block of code which start with \`\`\`javascript;
          the code of each step must be able to run independently while also using previous information, 
            for example if you want to reuse the length of a previous variable, store it in your memory and write it directly in a later step, instead of dynamically;
          each step must respect instructions for code that'll be listed below.

        I'll now give you instructions that you must respect for each steps.
        I'll give you some instructions for your code :
          the variable for the id of the spreadsheet is already created and called 'spreadsheetId', use it directly and consequently never create another variable named spreadsheetId;
          I've already a sheets object that is responsible for the connection to the API client, use it directly and consequently never create another variable named sheets;
          don't use variables that need to be declared before executing the block, unless I've told you to use them, like spreadsheetId or sheets;
          ensure that you have created the functions you use;
          you shouldn't import packages, the sheets object is enough as an entry point;
          don't forget to use the await keyword;
          be careful to escape special characters, especially the ' symbol;
          don't forget to add data for the graphs;
          keep the code as short as possible (don't add comments or console.log);
          try to get every id dynamically, for example get the id of a sheet from its name;
          since you're not necessarily up to date, I want you to use the official documentation (https://developers.google.com/sheets/api/) as much as possible.

        For the first step I want you to only create the sheets.
      `
    data.parentResId = await this.updateSpreadsheets(
      data.spreadSheetsId,
      data.parentResId,
      codePrompt,
    )

    const prompt = `For the second step I want you to create the tables in each sheet and populate them with examples.`
    await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)

    return this.sheetsService.getById(data.spreadSheetsId)
  }

  async updateData(data: Conv): Promise<DriveFileUrls> {
    // const prompt = `For this step I want you to populate these tables with dummy values.`
    // await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return this.sheetsService.getById(data.spreadSheetsId)
  }

  async updateGraphics(data: Conv): Promise<DriveFileUrls> {
    // const prompt = `For this step I want you to add graphs when it's relevant.`
    // await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return this.sheetsService.getById(data.spreadSheetsId)
  }

  async updateStyles(data: Conv): Promise<DriveFileUrls> {
    // const prompt = `For this step I want you to add style to the tables with colors, borders, fonts, etc.`
    // await this.updateSpreadsheets(data.spreadSheetsId, data.parentResId, prompt)
    return this.sheetsService.getById(data.spreadSheetsId)
  }

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
      `spreadSheetId: ${spreadSheetId}, parentResId: ${parentResId}, answer: ${res.answer}`,
    )
    await Promise.all(
      ChatGptApiUtils.extractCode(res.answer).map(async (blockCode) => {
        await SheetsApiUtils.updateSpreadsheets(spreadSheetId, blockCode)
      }),
    )
    return res.id
  }
}
