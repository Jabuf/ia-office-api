import { SlideInfo } from '../controllers/SlideController'
import SlidesApiUtils, {
  PredefinedLayout,
} from '../utils/google/SlidesApiUtils'
import { DriveService } from './FileService'

export class SlideService {
  readonly driveService

  constructor() {
    this.driveService = new DriveService()
  }

  async createSlide(data: { text: string }): Promise<SlideInfo> {
    const slideId = await SlidesApiUtils.createPresentation(
      data.text.substring(0, 15),
    )
    const slidesPlaceholder = [
      {
        id: '12345',
        layout: 'TITLE_ONLY' as PredefinedLayout,
        text: data.text,
        position: 1,
      },
    ]
    await SlidesApiUtils.insertSlides(slideId, slidesPlaceholder)
    return {
      messages: [],
      driveFileInfo: await this.driveService.getFileById(slideId),
    }
  }
}
