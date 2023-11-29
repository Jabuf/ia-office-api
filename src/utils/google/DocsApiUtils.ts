import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { errorGoogleApi } from '../errors/CustomError'

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

    // TODO improves the errors
    if (!document.data.documentId) {
      throw errorGoogleApi
    }

    await DriveApiUtils.addPermissions(document.data.documentId)
    return document.data.documentId
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
