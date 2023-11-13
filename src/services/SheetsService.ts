import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import DriveApiUtils from '../utils/google/DriveApiUtils'
import { DriveFileInfo } from '../controllers/SheetsController'

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
    const file = (await DriveApiUtils.retrieveFile(id)).data
    return {
      spreadSheetsId: id,
      webContentLink: file.webContentLink,
      webViewLink: file.webViewLink,
    }
  }
}
