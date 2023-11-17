import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, {
  ChartData,
  SpreadsheetData,
} from '../utils/google/SheetsApiUtils'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'
import { logger } from '../utils/logging/logger'

export const spreadsheetExample: SpreadsheetData = {
  title: 'My spreadsheet title',
  sheetsData: [
    {
      name: 'MySheet1',
      values: [
        ['Product', 'Month', 'Vendor', 'Amount'],
        ['Cheese', 'January', 'John', '150'],
        ['Cheese', 'February', 'John', '50'],
        ['Milk', 'January', 'John', '200'],
        ['Lamb', 'March', 'John', '15'],
        ['Cheese', 'February', 'Robert', '25'],
        ['Milk', 'January', 'Robert', '50'],
        ['Milk', 'February', 'Robert', '100'],
        ['Milk', 'March', 'Robert', '100'],
      ],
      comment: 'Here you can find some useful comments.',
    },
    {
      name: 'MySheet2',
      values: [
        ['Name', 'Total Sales (€)'],
        ['John', '=SUM(FILTER(MySheet1!D2:D9,A2=MySheet1!C2:C9))'],
        ['Robert', '=SUM(FILTER(MySheet1!D2:D9,A3=MySheet1!C2:C9))'],
        ['Total', '=SUM(B2:B3)'],
      ],
      comment: 'Here you can find some useful comments.',
    },
  ],
}

export const chartExample: ChartData = {
  title: 'My chart title',
  chartType: 'BAR',
  axes: [
    {
      title: 'Sales',
      position: 'BOTTOM_AXIS',
    },
    {
      title: 'Names',
      position: 'LEFT_AXIS',
    },
  ],
  series: [
    {
      series: {
        sourceRange: {
          sources: [
            {
              sheetName: 'MySheet1',
              startRowIndex: 0,
              endRowIndex: 3,
              startColumnIndex: 1,
              endColumnIndex: 2,
            },
          ],
        },
      },
      targetAxis: 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED',
    },
  ],
}

export class ModelService {
  readonly sheetsService

  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: Conv): Promise<SpreadSheetInfo> {
    const initialPrompt = `I want you to act as my advisor for the creation of a spreadsheet.
    First I will give you a prompt and you will reply with an exhaustive list of information I could put in that spreadsheet (like tables, sheets, formulas or graphs) related to that prompt.
    Additionally I also want you to act as a translator if needed, indeed if my prompt is not in english then it is imperative for your answers to reflect the language used in the prompt for all your answers.
    The prompt is "${data.initialPrompt}"`
    const gptRes = await ChatGptApiUtils.startConv(initialPrompt)

    const prompt = `Now I want to create a spreadsheet using the Sheets API. 
    The spreadsheet must contain the information that you gave me previously and it must be populated with examples and comment. 
    The goal for the spreadsheet is to be easily modifiable by anybody so that they can adapt it to their needs. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    It is mandatory for the JSON in your answer to be inside a JSON block that start with \`\`\`json.
    First I want you to return me a JSON object following the example that I will give you and that will contain the information you mentioned previously. 
    The example serves as a baseline to give you the structure of the JSON object I'm expecting, but its content will usually be vastly different.
    It is imperative for the spreadsheet (which include the sheets, the labels, the formulas, the way information are presented, etc.) to reflect the information you gave me previously as much as possible while keeping the exact same JSON structure.
    That means that for example you can add as much elements in array properties as you want, but you cannot add or remove properties.
    
    Pay a particular attention to the property comment, it is intended for you to provides inputs on your answer. 
    It is expected for you to provides lot of information here. 
    Here's a list of possible things you can put :
      - Useful URLs related to the content of the sheet
      - An explanation of the content of the sheet
      - Explanations on how to efficiently use and adapt this sheet for your use-case, what to modify, add, remove, etc.
    
    And here's the example : ${JSON.stringify(spreadsheetExample)}.
    Also don't forget your role as a translator.`
    const res = await ChatGptApiUtils.pursueExistingConv(gptRes.id, prompt)

    const spreadsheetData = ChatGptApiUtils.extractJson<SpreadsheetData>(
      res.answer,
    )
    data.spreadSheetsId = await SheetsApiUtils.createSpreadSheets(
      spreadsheetData.title,
    )
    logger.info(
      `spreadsheetId: ${data.spreadSheetsId}, prompt: ${initialPrompt}`,
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
    const prompt = `Now I want to add a chart to my Sheets file. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    I want you to return me the a JSON object following the example but that will instead use what we've added in our Sheets file previously :
    ${JSON.stringify(chartExample)}
    Moreover here's additional information :
    - the property chartType can take the following values : 'BAR', 'LINE', 'AREA', 'COLUMN', 'SCATTER' or 'STEPPED_AREA'; you're free to decide what's most adapted
    - the property position of the axes object can take the following values : 'BOTTOM_AXIS', 'LEFT_AXIS' or 'RIGHT_AXIS': you're free to decide what's most adapted
    - the property targetAxis must always be 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED'
    - the property sheetName must stay as it is and correspond to one of the sheets we've created previously, does not replace it with sheetId
    - the rest of the properties must be related to what we've created previously`
    const res = await ChatGptApiUtils.pursueExistingConv(
      data.parentResId,
      prompt,
    )

    const chartData = ChatGptApiUtils.extractJson<ChartData>(res.answer)
    if (chartData) {
      await SheetsApiUtils.addCharts(data.spreadSheetsId, chartExample)
    }

    return {
      parentResId: data.parentResId,
      driveFileInfo: await this.sheetsService.getById(data.spreadSheetsId),
    }
  }
}
