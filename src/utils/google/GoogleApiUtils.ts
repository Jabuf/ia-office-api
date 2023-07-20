import { JWT } from 'google-auth-library'
import keys from './ia-office-keys.json'
import { google } from 'googleapis'

export default abstract class GoogleApiUtils {
  private static client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  static initSheets() {
    return google.sheets({
      version: 'v4',
      auth: this.client,
    })
  }
}
