import { DriveFileUrls } from '../controllers/SheetsController'
import { InitialPrompt } from '../controllers/ModelController'
import { SheetsService } from './SheetsService'

export class ModelService {
  readonly sheetsService
  constructor() {
    this.sheetsService = new SheetsService()
  }

  async createSpreadsheet(data: InitialPrompt): Promise<DriveFileUrls> {
    // await ChatGptApiUtils.startConv(data.prompt)
    // TODO implement service
    return this.sheetsService.getById('123')
  }
}
