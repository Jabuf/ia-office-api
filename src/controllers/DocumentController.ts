import { FastifyReply, FastifyRequest } from 'fastify'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { DocumentService } from '../services/DocumentService'
import { DriveFileInfo } from '../services/FileService'
import { HttpControllerUtils } from '../utils/HttpControllerUtils'

export type ConvDocument = {
  initialPrompt: string
  documentType: 'letter' | 'mail' | 'block' | 'presentation'
}

export type DocumentInfo = {
  messages: ChatCompletionMessageParam[]
  driveFileInfo: DriveFileInfo
}

export class DocumentController {
  createSpreadsheet = async (
    req: FastifyRequest<{ Body: ConvDocument }>,
    res: FastifyReply,
  ): Promise<void> => {
    const documentService = new DocumentService()
    const documentInfo = await documentService.createDocument(req.body)
    await HttpControllerUtils.sendPostResponse<DocumentInfo>(res, documentInfo)
  }
}
