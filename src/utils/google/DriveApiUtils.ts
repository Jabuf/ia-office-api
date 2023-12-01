import { drive_v3, google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import Schema$File = drive_v3.Schema$File

export default abstract class DriveApiUtils extends GoogleApiUtils {
  static drive = google.drive({
    version: 'v3',
    auth: this.client,
  })

  static async getFileById(id: string): Promise<Schema$File> {
    return (
      await this.drive.files.get({
        fileId: id,
        fields: 'webContentLink, webViewLink',
      })
    ).data
  }

  static async getFiles(): Promise<Schema$File[]> {
    return (
      // https://developers.google.com/drive/api/guides/fields-parameter
      (
        await DriveApiUtils.drive.files.list({
          fields:
            'files(id, createdTime, name, mimeType, webContentLink, webViewLink)',
          q: 'trashed=false',
        })
      ).data.files ?? []
    )
  }

  static async addPermissions(fileId: string): Promise<void> {
    // We add permissions to the document for everyone
    // https://developers.google.com/drive/api/guides/ref-roles
    await DriveApiUtils.drive.permissions.create({
      fileId,
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    })
  }
}
