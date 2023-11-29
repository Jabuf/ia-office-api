import { google } from 'googleapis'
import GoogleApiUtils from './GoogleApiUtils'
import DriveApiUtils from './DriveApiUtils'
import { errorGoogleApi } from '../errors/CustomError'

export type SlideData = {
  id: string
  text: string
  layout: PredefinedLayout
  position: number
}

// TODO add the remaining layout : https://developers.google.com/apps-script/reference/slides/predefined-layout
export type PredefinedLayout = 'TITLE_ONLY' | 'MAIN_POINT'
export default abstract class SlidesApiUtils extends GoogleApiUtils {
  static slides = google.slides({
    version: 'v1',
    auth: this.client,
  })

  static async createPresentation(fileName: string): Promise<string> {
    const slide = await this.slides.presentations.create({
      requestBody: {
        title: fileName,
      },
    })

    if (!slide.data.presentationId) {
      throw errorGoogleApi
    }

    await DriveApiUtils.addPermissions(slide.data.presentationId)
    return slide.data.presentationId
  }

  static async insertSlides(
    presentationId: string,
    slides: SlideData[],
  ): Promise<void> {
    await Promise.all(
      slides.map(async (slide, index) => {
        await this.slides.presentations.batchUpdate({
          presentationId,
          requestBody: {
            requests: [
              {
                createSlide: {
                  objectId: slide.id,
                  insertionIndex: 1,
                  slideLayoutReference: {
                    predefinedLayout: slide.layout,
                  },
                  placeholderIdMappings: [
                    {
                      layoutPlaceholder: {
                        type: 'TITLE',
                        index: 0,
                      },
                      objectId: 'title_id' + index.toString(),
                    },
                  ],
                },
              },
            ],
          },
        })

        await this.slides.presentations.batchUpdate({
          presentationId,
          requestBody: {
            requests: [
              {
                insertText: {
                  objectId: 'title_id' + index.toString(),
                  text: slide.text,
                  insertionIndex: 0,
                },
              },
            ],
          },
        })
      }),
    )
  }
}
