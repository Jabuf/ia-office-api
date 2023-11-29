import { ConvDocument, DocumentInfo } from '../controllers/DocumentController'
import DocsApiUtils, { DocumentData } from '../utils/google/DocsApiUtils'
import { DriveService } from './DriveService'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { getPromptsDocument } from '../data/prompts'
import { errorOpenAi } from '../utils/errors/CustomError'

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
    await DocsApiUtils.insertText(documentId, documentData.formattedText)
    return {
      messages: [
        ...getPromptsDocument(data.initialPrompt),
        chatCompletion.choices[0].message,
      ],
      driveFileInfo: await this.driveService.getById(documentId),
    }
  }
}
