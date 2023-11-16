import { Conv, SpreadSheetInfo } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'
import SheetsApiUtils, {
  ChartData,
  SpreadsheetData,
} from '../utils/google/SheetsApiUtils'
import ChatGptApiUtils from '../utils/openai/ChatGptApiUtils'

export const spreadsheetExample: SpreadsheetData = {
  title: 'My spreadsheet title',
  sheetsData: [
    {
      name: 'MySheet1',
      values: [
        ['Name', 'Sales (€)'],
        ['John', '10000'],
        ['Robert', '5000'],
        ['Total', '=SUM(B2:B3)'],
      ],
    },
    {
      name: 'MySheet2',
      values: [
        ['Sales', 'January', 'February', 'March', 'Total'],
        ['Cheese', '100', '150', '100', '=SUM(B2:C2)'],
        ['Milk', '200', '300', '300', '=SUM(B3:C3)'],
        ['Lamb', '50', '25', '25', '=SUM(B4:C4)'],
      ],
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
