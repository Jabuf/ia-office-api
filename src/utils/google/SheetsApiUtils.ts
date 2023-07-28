import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import vm from 'vm'

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
