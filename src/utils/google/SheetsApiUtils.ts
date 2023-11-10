import vm from 'vm'
import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { logger } from '../logging/logger'
import { CustomError } from '../errors/CustomError'

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

    const script = new vm.Script(codeToRun)
    try {
      await script.runInNewContext(context)
    } catch (e) {
      if (e instanceof Error) {
        throw new CustomError('ERROR_RUN_CODE', e.message, e.name)
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
