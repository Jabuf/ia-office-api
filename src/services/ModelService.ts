import { DriveFileUrls } from '../controllers/SheetsController'
import { InitialPrompt } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import { customLogger } from '../utils/logging/customLogger'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: InitialPrompt): Promise<DriveFileUrls> {
    const id = await SheetsApiUtils.createSpreadSheets(
      new Date().toLocaleDateString(),
    )
    const initialPrompt = `I will give you a prompt that have for goal the creation of a spreadsheet.
        I want you to give me an exhaustive list of information I could put in that spreadsheet, like tables, sheets or graphs.
        I want the label in your answers to use the same language used in the prompt while you'll continue to converse with me in English.
        The prompt is : "${data.prompt}"`
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)
    // Step 1
    const codePrompt = `Now I want to put all the information you just provided to me in a spreadsheet, including graphs, sheets and examples for values. 
      We'll proceed in steps, I'll now give you instructions that you must respect for each steps.
      We'll be using the Sheets API in nodejs. I have already a sheets object that is responsible for the connection to the API client, so use it directly and don't create one.
      The spreadsheet is already created and has the id : ${id}. Can you provide me the code I need to do that.
      I'll give you some tips for your code : 
        don't forget to use the await keyword; 
        be careful to escape special characters, especially the ' symbol;
        start by first creating the sheets you need, then deleting the initial one named "Sheet1". 
      I want your answer to be : in one block code, as short as possible (for example you can omit comments in the code), to contain all the information included in your previous answer.
      For the first step I want you to create the sheets.
    `
    let res = await ChatGptApiUtils.pursueExistingConv(parentRes.id, codePrompt)
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )
    // Step 2
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      'For the second step I want you to populate the sheets with tables.',
    )
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )

    // Step 3
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      'For the third step I want you to populate these tables with dummy values.',
    )
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )

    // Step 4
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      `For the fourth step I want you to add graphs when it's relevant.`,
    )
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )

    return this.sheetsService.getById(id)
  }
}
