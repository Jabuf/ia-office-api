import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import DriveApiUtils from '../utils/google/DriveApiUtils'
import { DriveFileInfo } from '../controllers/SheetsController'
import { GaxiosError } from 'gaxios'
import { CustomError } from '../utils/errors/CustomError'

export class SheetsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async create(data: Record<string, string>): Promise<DriveFileInfo> {
    const id = await SheetsApiUtils.createSpreadSheets(data.fileName)
    const file = (await DriveApiUtils.retrieveFile(id)).data
    return {
      spreadSheetsId: id,
      webContentLink: file.webContentLink,
      webViewLink: file.webViewLink,
    }
  }

  async getById(id: string): Promise<DriveFileInfo> {
    try {
      const file = (await DriveApiUtils.retrieveFile(id)).data
      return {
        spreadSheetsId: id,
        webContentLink: file.webContentLink,
        webViewLink: file.webViewLink,
      }
    } catch (err) {
      if (err instanceof GaxiosError) {
        throw new CustomError('ERROR_GOOGLE_API', err.message, err.name)
      }
      if (err instanceof Error) {
        throw new CustomError('ERROR_RUN_CODE', err.message, err.name)
      }
    }
  }
}
