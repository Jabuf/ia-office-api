import { DocumentInfo } from '../controllers/DocumentController'
import DocsApiUtils from '../utils/google/DocsApiUtils'
import { DriveService } from './DriveService'

export class DocumentService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createDocument(data: { text: string }): Promise<DocumentInfo> {
    const documentId = await DocsApiUtils.createDocument('Test creation docs')
    await DocsApiUtils.insertText(documentId, data.text)
    return {
      messages: [],
      driveFileInfo: await this.driveService.getById(documentId),
    }
  }
}
