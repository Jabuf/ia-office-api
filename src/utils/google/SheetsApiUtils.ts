import vm from 'vm'
import { google, sheets_v4 } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { CustomError } from '../errors/CustomError'
import { GaxiosError } from 'gaxios'
import { logger } from '../logging/logger'

export type SpreadsheetData = {
  title: string
  sheetsData: SheetData[]
}

type SheetData = {
  name: string
  values: string[][]
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

  static async updateSpreadsheets(
    spreadsheetId: string,
    code: string,
  ): Promise<void> {
    const codeToRun = `const { sheets } = this;
    const spreadsheetId = '${spreadsheetId}';
      async function updateSpreadsheets() { ${code} }
      updateSpreadsheets();
      `
    const context = {
      sheets: this.sheets,
      codeToRun,
    }
    logger.info(`codeRun : ${codeToRun}`)

    try {
      const script = new vm.Script(codeToRun)
      await script.runInNewContext(context)
    } catch (err) {
      if (err instanceof GaxiosError) {
        throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
      }
      if (err instanceof Error) {
        throw new CustomError('ERROR_RUN_CODE', err.message, err.name)
      }
    }
  }

  static async getSheetIdByName(
    spreadsheetId: string,
    sheetName: string,
  ): Promise<number | null> {
    const sheets = (
      await this.sheets.spreadsheets.get({
        spreadsheetId,
      })
    ).data.sheets

    let sheetId = null
    if (sheets) {
      const sheet = sheets.find(
        (sheet) => sheet.properties?.title === sheetName,
      )
      if (sheet) {
        sheetId = sheet.properties?.sheetId ?? null
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
