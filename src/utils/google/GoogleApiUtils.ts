import { JWT } from 'google-auth-library'
import keys from './ia-office-keys.json'

export default abstract class GoogleApiUtils {
  protected static client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  })
}
