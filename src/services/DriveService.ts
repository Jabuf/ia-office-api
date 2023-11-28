import DriveApiUtils from '../utils/google/DriveApiUtils'
import { GaxiosError } from 'gaxios'
import { CustomError } from '../utils/errors/CustomError'

export type DriveFileInfo = {
  fileId: string
  webContentLink: string | undefined | null
  webViewLink: string | undefined | null
}

export class DriveService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async getById(id: string): Promise<DriveFileInfo> {
    try {
      const file = (await DriveApiUtils.retrieveFile(id)).data
      return {
        fileId: id,
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
}
