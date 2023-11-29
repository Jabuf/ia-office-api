import { ConvDocument, DocumentInfo } from '../controllers/DocumentController'
import DocsApiUtils from '../utils/google/DocsApiUtils'
import { DriveService } from './DriveService'
import GptApiUtils from '../utils/openai/GptApiUtils'
import { getPromptsDocument } from '../data/prompts'
import { CustomError } from '../utils/errors/CustomError'

export class DocumentService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createDocument(data: ConvDocument): Promise<DocumentInfo> {
    const chatCompletion = await GptApiUtils.startConv(
      getPromptsDocument(data.initialPrompt),
    )

    if (!chatCompletion.choices[0].message.content) {
      // TODO improves errors
      throw new CustomError(
        'ERROR_GPT_DOC',
        `The answer does not contain a valid string : ${JSON.stringify(
          chatCompletion.choices[0].message,
        )}`,
        'ERROR_GPT_DOC',
      )
    }

    const documentId = await DocsApiUtils.createDocument('Test creation docs')
    await DocsApiUtils.insertText(
      documentId,
      chatCompletion.choices[0].message.content,
    )
    return {
      messages: [
        ...getPromptsDocument(data.initialPrompt),
        chatCompletion.choices[0].message,
      ],
      driveFileInfo: await this.driveService.getById(documentId),
    }
  }
}
