import { FastifyReply, FastifyRequest } from 'fastify'
import { DriveFileInfo, DriveService } from '../services/DriveService'
import { HttpControllerUtils } from '../utils/HttpControllerUtils'

export class FileController {
  getFiles = async (
    req: FastifyRequest,
    res: FastifyReply,
  ): Promise<void> => {
    const driveService = new DriveService()
    const files = await driveService.getFiles()
    await HttpControllerUtils.sendGetResponse<DriveFileInfo[]>(res, files)
  }
}
