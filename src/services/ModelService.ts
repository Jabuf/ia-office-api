import { DriveFileUrls } from '../controllers/SheetsController'
import { Conv } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import { customLogger } from '../utils/logging/customLogger'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<DriveFileUrls> {
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
        We'll be using the Sheets API in nodejs and want you to provide me with blocks of code.

        We'll be proceeding in multiple steps. Here are some instructions about how these steps will work : 
          there must be only one block of code for each step;
          the code of each step must be able to run independently while also using previous information, 
            for example if you want to reuse the length of a previous variable, store it in your memory and write it directly in a later step, instead of dynamically;
          each step must respect instructions for code that'll be listed below.

        I'll now give you instructions that you must respect for each steps.
        I'll give you some instructions for your code :
          The spreadsheet is already created and has the id : ${id};
          I've already a sheets object that is responsible for the connection to the API client, so use it directly and consequently never create another variables named sheets;
          you shouldn't import packages, the sheets object is enough as an entry point;
          don't forget to use the await keyword;
          be careful to escape special characters, especially the ' symbol;
          don't forget to add data for the graphs;
          keep the code as short as possible (i.e no comments or no console.log);
          since you're not necessarily up to date, I want you to use the official documentation (https://developers.google.com/sheets/api/) as much as possible.

        For the first step I want you to only create the sheets.
      `
    let res = await ChatGptApiUtils.pursueExistingConv(parentRes.id, codePrompt)
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )
    // Step 2
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      `For the second step I want you to populate the sheets with tables. You don't need to add data to the tables yet, however I'd like if they can be stylized with colors, borders, fonts, etc.`,
    )
    customLogger.info(res)
    await SheetsApiUtils.updateSpreadsheets(
      ChatGptApiUtils.extractCode(res.response)[0],
    )

    // Step 3
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      `For the third step I want you to populate these tables with dummy values.`,
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

  async collectInformation(data: Conv): Promise<Conv> {
    const initialPrompt = `My goal is to create of a spreadsheet.
          I'll later ask you to give me an exhaustive list of information that I could put in that spreadsheet, like tables, sheets or graphs.
          But first I want you to give me a list of information that related to this creation and that I could give you to help you with this task.
          I want the answers in the list to use the same language as the one used in the purpose while you'll continue to converse with me in English.
          Your answer must contain an explicit block of code in json (starting with \`\`\`json) that will contain the list. The type inside that block must be "{answers : string[]}".
          The purpose of my spreadsheet is : "${data.prompt}"`
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)

    data.additionalInfo = ChatGptApiUtils.extractList(parentRes.response).map(
      (e) => {
        return { question: e, answer: '' }
      },
    )

    return data
  }
}
