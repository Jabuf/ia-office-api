import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'

export default abstract class SheetsApiUtils extends GoogleApiUtils {
  static sheets = google.sheets({
    version: 'v4',
    auth: this.client,
  })

  static async createSpreadSheets(fileName: string) {
    const spreadSheets = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: fileName,
        },
      },
    })
    return spreadSheets.data.spreadsheetId
  }
}
