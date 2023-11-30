import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { errorGoogleApi } from '../errors/CustomError'

export type DocumentData = {
  title: string
  content: ParagraphData[]
}

type ParagraphData = {
  order: number
  sectionName?: string
  text: string
}

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

  static async insertParagraphs(
    documentId: string,
    paragraphs: ParagraphData[],
  ): Promise<void> {
    const sortedParagraphs = paragraphs.sort((a, b) => a.order - b.order)
    let endIndex = 1
    for (const paragraph of sortedParagraphs) {
      await Promise.resolve(
        this.insertParagraph(documentId, paragraph, endIndex),
      )
      endIndex +=
        (paragraph.sectionName ? paragraph.sectionName.length + 2 : 0) +
        paragraph.text.length +
        2
    }
  }

  static async insertParagraph(
    documentId: string,
    paragraph: ParagraphData,
    previousIndex = 1,
  ): Promise<void> {
    if (paragraph.sectionName) {
      await this.docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                text: `${paragraph.sectionName}\n\n`,
                endOfSegmentLocation: {
                  segmentId: '',
                },
              },
            },
            {
              updateTextStyle: {
                textStyle: {
                  bold: true,
                  fontSize: {
                    magnitude: 14,
                    unit: 'PT',
                  },
                },
                range: {
                  startIndex: previousIndex,
                  endIndex: previousIndex + paragraph.sectionName.length + 2,
                },
                fields: 'bold,fontSize,foregroundColor',
              },
            },
          ],
        },
      })
    }
    await this.docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              text: `${paragraph.text}\n\n`,
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
