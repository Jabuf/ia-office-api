import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'

export default abstract class DocsApiUtils extends GoogleApiUtils {
  static docs = google.docs({
    version: 'v1',
    auth: this.client,
  })

  static async createDocument(fileName: string): Promise<string> {
    const document = await this.docs.documents.create({
      requestBody: {
        title: fileName,
      },
    })

    // We make add permissions to the document for everyone
    // https://developers.google.com/drive/api/guides/ref-roles
    await DriveApiUtils.drive.permissions.create({
      fileId: document.data.documentId ?? '',
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    })
    return document.data.documentId || ''
  }

  static async insertText(documentId: string, text: string): Promise<void> {
    await this.docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              text,
              endOfSegmentLocation: {
                segmentId: '',
              },
            },
          },
        ],
      },
    })
  }
}
