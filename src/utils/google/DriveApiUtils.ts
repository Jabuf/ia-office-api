import { drive_v3, google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import { GaxiosPromise } from 'googleapis-common'
import Schema$File = drive_v3.Schema$File

export default abstract class DriveApiUtils extends GoogleApiUtils {
  static drive = google.drive({
    version: 'v3',
    auth: this.client,
  })

  static async retrieveFile(id: string): Promise<GaxiosPromise<Schema$File>> {
    return this.drive.files.get({
      fileId: id,
    })
  }
}
