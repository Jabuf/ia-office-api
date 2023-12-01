import { ConvDocument, DocumentInfo } from '../controllers/DocumentController'
import { getPromptsDocument } from '../data/prompts'
import { errorOpenAi } from '../utils/errors/CustomError'
import DocsApiUtils, { DocumentData } from '../utils/google/DocsApiUtils'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { DriveService } from './FileService'

export class DocumentService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createDocument(data: ConvDocument): Promise<DocumentInfo> {
    const chatCompletion = await GptApiUtils.startConv(
      getPromptsDocument(data.initialPrompt),
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
        ...getPromptsDocument(data.initialPrompt),
        chatCompletion.choices[0].message,
      ],
      driveFileInfo: await this.driveService.getFileById(documentId),
    }
  }
}
