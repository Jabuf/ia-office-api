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
    const id = await SheetsApiUtils.createSpreadSheets(
      new Date().toLocaleDateString(),
    )
    const initialPrompt = `I will give you a prompt that have for goal the creation of a spreadsheet.
        I want you to give me an exhaustive list of information I could put in that spreadsheet, like tables, sheets or graphs.
        I want the label in your answers to use the same language used in the prompt while you'll continue to converse with me in English.
        The prompt is "${
          data.prompt
        }" and the list of additional information is "${data.additionalInfo.toString()}". Among additional information, ignore question that have no answers.`
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)
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
          The spreadsheet is already created and has the id : ${id}, start each block by declaring it;
          ensure that you have created the functions you use;
          I've already a sheets object that is responsible for the connection to the API client, so use it directly and consequently never create another variables named sheets;
          you shouldn't import packages, the sheets object is enough as an entry point;
          don't forget to use the await keyword;
          be careful to escape special characters, especially the ' symbol;
          don't forget to add data for the graphs;
          keep the code as short as possible (don't add comments or console.log);
          try to get every id dynamically, for example get the id of a sheet from its name;
          since you're not necessarily up to date, I want you to use the official documentation (https://developers.google.com/sheets/api/) as much as possible.

        For the first step I want you to only create the sheets.
      `
    let res = await ChatGptApiUtils.pursueExistingConv(parentRes.id, codePrompt)
    await this.updateSpreadsheets(res.answer)
    // Step 2
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      // `For the second step I want you to populate the sheets with tables. You don't need to add data to the tables yet, however I'd like if they can be stylized with colors, borders, fonts, etc.`,
      `For the second step I want you to populate the sheets with tables. You don't need to add data to the tables yet.`,
    )
    await this.updateSpreadsheets(res.answer)

    // Step 3
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      `For the third step I want you to populate these tables with dummy values.`,
    )
    await this.updateSpreadsheets(res.answer)

    // Step 4
    res = await ChatGptApiUtils.pursueExistingConv(
      res.id,
      `For the fourth step I want you to add graphs when it's relevant.`,
    )
    await this.updateSpreadsheets(res.answer)

    return this.sheetsService.getById(id)
  }

  async collectInformation(data: Conv): Promise<Conv> {
    const initialPrompt = `My goal is to create of a spreadsheet.
          I'll later ask you to give me exhaustive information that I could put in that spreadsheet, like tables, sheets or graphs.
          But first I want you to give me a list of shorts questions that are related to this creation and that I could answer to help you with this task.
          The answer to a question should be simple and short, otherwise don't ask for it.
          I want the answers in the list to use the same language as the one used in the purpose while you'll continue to converse with me in English.
          Your answer must contain a block of code in json which start with \`\`\`json, it will contain the list. The type inside that block must be "{answers : string[]}".
          The purpose of my spreadsheet is : "${data.prompt}"`
    const parentRes = await ChatGptApiUtils.startConv(initialPrompt)
    logger.info(`answer: ${parentRes.answer}`)

    data.additionalInfo = ChatGptApiUtils.extractList(parentRes.answer).map(
      (e) => {
        return { question: e, answer: '' }
      },
    )

    return data
  }

  private async updateSpreadsheets(answer: string): Promise<void> {
    logger.info(`answer: ${answer}`)
    await Promise.all(
      ChatGptApiUtils.extractCode(answer).map(async (blockCode) => {
        await SheetsApiUtils.updateSpreadsheets(blockCode)
      }),
    )
  }
}
