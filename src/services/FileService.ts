import { GaxiosError } from 'gaxios'
import { CustomError } from '../utils/errors/CustomError'
import DriveApiUtils from '../utils/google/DriveApiUtils'

export type DriveFileInfo = {
  fileId: string
  fileName?: string
  fileType?: string
  created: string | undefined | null
  webContentLink: string | undefined | null
  webViewLink: string | undefined | null
}

export class DriveService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getFileById(id: string): Promise<DriveFileInfo> {
    try {
      // TODO could be refactored into a mapper ?
      const file = await DriveApiUtils.getFileById(id)
      return {
        fileId: id,
        created: file.createdTime,
        webContentLink: file.webContentLink,
        webViewLink: file.webViewLink,
      }
    } catch (err) {
      if (err instanceof GaxiosError) {
        throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
      }
      throw err
    }
  }

  async getFiles(): Promise<DriveFileInfo[]> {
    try {
      const files = await DriveApiUtils.getFiles()
      return files.map((file) => {
        return {
          fileId: file.id ?? '',
          // TODO convert to Date probably
          created: file.createdTime,
          fileName: file.name ?? '',
          fileType: file.mimeType ?? '',
          webContentLink: file.webContentLink,
          webViewLink: file.webViewLink,
        }
      })
    } catch (err) {
      if (err instanceof GaxiosError) {
        throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
      }
      throw err
    }
  }
}
