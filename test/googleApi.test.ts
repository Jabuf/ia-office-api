import DocsApiUtils from '../src/utils/google/DocsApiUtils'
import SheetsApiUtils from '../src/utils/google/SheetsApiUtils'
import SlidesApiUtils from '../src/utils/google/SlidesApiUtils'
import DriveApiUtils from '../src/utils/google/DriveApiUtils'
import { GaxiosError } from 'gaxios'
import { afterAll } from 'vitest'

const ids: string[] = []
describe('google api', () => {
  it('createDocument', async () => {
    const id = await DocsApiUtils.createDocument('test docs')
    ids.push(id)
    expect(id).not.toBeNull()
  })
  it('createSpreadSheet', async () => {
    const id = await SheetsApiUtils.createSpreadSheet('test sheets')
    ids.push(id)
    expect(id).not.toBeNull()
  })
  it('createPresentation', async () => {
    const id = await SlidesApiUtils.createPresentation('test slides')
    ids.push(id)
    expect(id).not.toBeNull()
  })
  it('delete', () => {
    afterAll(async () => {
      expect(ids.length).toBe(3)
      await Promise.all(
        ids.map(async (id) => {
          await DriveApiUtils.drive.files.delete({ fileId: id })
        }),
      )
      try {
        await DriveApiUtils.getFileById(ids[0])
      } catch (err) {
        if (err instanceof GaxiosError) {
          expect(err.code).toBe(404)
        }
      }
    })
  })
})
