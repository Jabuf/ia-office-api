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
    const initialPrompt = `I will give a prompt that have for goal the creation of a spreadsheet.
        I want you to give an exhaustive list of information I could put in that spreadsheet, like tables, sheets or graphs.
        The prompt may not be in English, I want the label in your answer to use the same language used in the prompt.
        The prompt is : "${data.prompt}"`
    customLogger.info(data.prompt)
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)
    customLogger.info(parentRes)
    const codePrompt = `Ok now I want to put all the information you just provided to me in a spreadsheet, including graphs, sheets and examples for values.
        I want to do that using the Sheets API in nodejs. I have already a sheets object that is responsible for the connection to the API client, so use it directly and don't create one.
        The spreadsheet is already created and has the id : ${id}. Can you provide me the code I need to do that, also don't forget to use the await keyword.
        Be careful to escape special characters in label.
        I want your answer to be : in one block code, as short as possible (for example you can omit comments in the code), to contain all the information included in your previous answer.
    `
    const res = await ChatGptApiUtils.pursueExistingConv(
      parentRes.id,
      codePrompt,
    )
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )
    customLogger.info(ChatGptApiUtils.extractCode(res.response)[0])

    return this.sheetsService.getById(id)
  }
}
