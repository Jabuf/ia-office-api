import { google, sheets_v4 } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { CustomError } from '../errors/CustomError'
import { GaxiosError } from 'gaxios'

export type SpreadsheetData = {
  title: string
  sheetsData: SheetData[]
}

type SheetData = {
  name: string
  values: string[][]
}

type BasicCharType =
  | 'BAR'
  | 'LINE'
  | 'AREA'
  | 'COLUMN'
  | 'SCATTER'
  | 'STEPPED_AREA'

type SourceData = {
  sheetName?: string
  sheetId?: number
  startRowIndex: number
  endRowIndex: number
  startColumnIndex: number
  endColumnIndex: number
}

export type ChartData = {
  title: string
  chartType: BasicCharType
  axes: {
    title: string
    position: 'BOTTOM_AXIS' | 'LEFT_AXIS' | 'RIGHT_AXIS'
  }[]
  series: {
    series: {
      sourceRange: {
        sources: SourceData[]
      }
    }
    targetAxis: 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED'
  }[]
}

export default abstract class SheetsApiUtils extends GoogleApiUtils {
  static sheets = google.sheets({
    version: 'v4',
    auth: this.client,
  })

  static async createSpreadSheets(fileName: string): Promise<string> {
    const spreadSheets = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: fileName,
        },
      },
    })

    // We make add permissions to the spreadsheet for everyone
    // https://developers.google.com/drive/api/guides/ref-roles
    await DriveApiUtils.drive.permissions.create({
      fileId: spreadSheets.data.spreadsheetId ?? '',
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    })
    return spreadSheets.data.spreadsheetId || ''
  }

  static async createSheets(
    spreadsheetId: string,
    sheetNames: string[],
  ): Promise<void> {
    const { data } = await this.sheets.spreadsheets.get({
      spreadsheetId,
    })
    const existingSheetTitles =
      data.sheets?.map((sheet) => sheet.properties?.title) || []
    const sheetsToCreate = sheetNames.filter(
      (sheetName) => !existingSheetTitles.includes(sheetName),
    )

    if (sheetsToCreate.length > 0) {
      const requests: sheets_v4.Schema$Request[] = sheetsToCreate.map(
        (sheetName) => ({
          addSheet: {
            properties: {
              title: sheetName,
            },
          },
        }),
      )
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests,
        },
      })
    }
  }

  static async updateSheet(
    spreadsheetId: string,
    sheetsData: SheetData[],
  ): Promise<void> {
    await Promise.all(
      sheetsData.map(async (sheetData) => {
        const sheetId = await this.getSheetIdByName(
          spreadsheetId,
          sheetData.name,
        )
        try {
          if (sheetId) {
            const range = `${sheetData.name}!A1:${String.fromCharCode(
              'A'.charCodeAt(0) + sheetData.values[0].length,
            )}${sheetData.values.length}`
            await this.sheets.spreadsheets.values.update({
              spreadsheetId,
              range,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: sheetData.values,
              },
            })
          }
        } catch (err) {
          if (err instanceof GaxiosError) {
            throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
          }
          if (err instanceof Error) {
            throw new CustomError('UNKNOWN_ERROR', err.message, err.name)
          }
        }
      }),
    )
  }

  static async addCharts(
    spreadsheetId: string,
    chartData: ChartData,
  ): Promise<void> {
    try {
      await Promise.all(
        chartData.series.map(
          async (series) =>
            await Promise.all(
              series.series.sourceRange.sources.map(async (chartData) => {
                if (chartData.sheetName) {
                  chartData.sheetId = await this.getSheetIdByName(
                    spreadsheetId,
                    chartData.sheetName,
                  )
                  delete chartData.sheetName
                }
              }),
            ),
        ),
      )
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addChart: {
                chart: {
                  spec: {
                    title: chartData.title,
                    basicChart: {
                      chartType: chartData.chartType,
                      axis: [
                        ...chartData.axes.map((axis) => {
                          return {
                            title: axis.title,
                            position: axis.position,
                          }
                        }),
                      ],
                      series: chartData.series,
                    },
                  },
                  position: {
                    newSheet: true,
                  },
                },
              },
            },
          ],
        },
      })
    } catch (err) {
      if (err instanceof GaxiosError) {
        throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
      }
      if (err instanceof Error) {
        throw new CustomError('UNKNOWN_ERROR', err.message, err.name)
      }
    }
  }

  static async getSheetIdByName(
    spreadsheetId: string,
    sheetName: string,
  ): Promise<number | undefined> {
    const sheets = (
      await this.sheets.spreadsheets.get({
        spreadsheetId,
      })
    ).data.sheets

    let sheetId
    if (sheets) {
      const sheet = sheets.find(
        (sheet) => sheet.properties?.title === sheetName,
      )
      if (sheet) {
        sheetId = sheet.properties?.sheetId ?? undefined
      }
    }

    return sheetId
  }

  static async removeInitialSheet(spreadsheetId: string): Promise<void> {
    const spreadSheet = await this.sheets.spreadsheets.get({ spreadsheetId })
    if (
      spreadSheet &&
      spreadSheet.data.sheets?.length &&
      spreadSheet.data.sheets.length > 1
    ) {
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteSheet: {
                sheetId: 0,
              },
            },
          ],
        },
      }
      await this.sheets.spreadsheets.batchUpdate(request)
    }
  }
}
