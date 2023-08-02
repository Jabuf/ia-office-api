import SheetsApiUtils from '../utils/google/SheetsApiUtils'
import DriveApiUtils from '../utils/google/DriveApiUtils'
import { GaxiosPromise } from 'googleapis-common'
import { drive_v3 } from 'googleapis'
import Schema$File = drive_v3.Schema$File

export class SheetsService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async create(data: Record<string, string>): GaxiosPromise<Schema$File> {
    const id = await SheetsApiUtils.createSpreadSheets(data.fileName)
    return DriveApiUtils.retrieveFile(id)
  }
}
