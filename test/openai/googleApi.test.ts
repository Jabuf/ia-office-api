import { expect } from 'vitest'
import GoogleApiUtils from '../../src/utils/google/GoogleApiUtils'

it('Checking the API client', async () => {
  const sheets = GoogleApiUtils.initSheets()
  const file = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'Test',
      },
    },
  })
  // Should add a step to delete the file
  expect(file.status).toBe(200)
})
