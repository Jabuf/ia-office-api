import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'

export default abstract class DriveApiUtils extends GoogleApiUtils {
  static drive = google.drive({
    version: 'v3',
    auth: this.client,
  })
}
