import { ConvDocument, DocumentInfo } from '../controllers/DocumentController'
import { errorOpenAi } from '../utils/errors/CustomError'
import DocsApiUtils, { DocumentData } from '../utils/google/DocsApiUtils'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { DriveService } from './FileService'
import PromptDocumentUtils from '../utils/openai/PromptDocumentUtils'
import { documentExamples, letterExample } from '../utils/openai/examples'
import { logger } from '../utils/logging/logger'

export class DocumentService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createDocument(data: ConvDocument): Promise<DocumentInfo> {
    const example: DocumentData =
      documentExamples[data.documentType] || letterExample

    logger.info(example)
    const chatCompletion = await GptApiUtils.startConv(
      PromptDocumentUtils.getJsonCreation(data.initialPrompt, example),
      {
        returnJson: true,
      },
    )

    if (!chatCompletion.choices[0].message.content) {
      throw errorOpenAi
    }

    const documentData = JSON.parse(
      chatCompletion.choices[0].message.content,
    ) as DocumentData

    const documentId = await DocsApiUtils.createDocument(documentData.title)
    await DocsApiUtils.insertParagraphs(documentId, documentData.content)
    return {
      messages: [
        ...PromptDocumentUtils.getJsonCreation(data.initialPrompt, example),
        chatCompletion.choices[0].message,
      ],
      driveFileInfo: await this.driveService.getFileById(documentId),
    }
  }
}
