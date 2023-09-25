import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import DriveApiUtils from '../utils/google/DriveApiUtils'
import { DriveFileUrls } from '../controllers/SheetsController'
import { logger } from '../utils/logging/logger'

export class SheetsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async create(data: Record<string, string>): Promise<DriveFileUrls> {
    const id = await SheetsApiUtils.createSpreadSheets(data.fileName)
    const file = (await DriveApiUtils.retrieveFile(id)).data
    logger.info(id)
    return {
      webContentLink: file.webContentLink,
      webViewLink: file.webViewLink,
    }
  }

  async getById(id: string): Promise<DriveFileUrls> {
    const file = (await DriveApiUtils.retrieveFile(id)).data
    return {
      webContentLink: file.webContentLink,
      webViewLink: file.webViewLink,
    }
  }
}
