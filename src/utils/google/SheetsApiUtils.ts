import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import vm from 'vm'
import DriveApiUtils from './DriveApiUtils'

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

  static async updateSpreadsheets(code: string) {
    const codeToRun = `const { sheets } = this;
      ${code}`
    const context = {
      sheets: this.sheets,
      codeToRun,
    }

    const script = new vm.Script(codeToRun)
    await script.runInNewContext(context)
  }
}
