import GptApiUtils from '../../src/utils/openai/GptApiUtils'
import { expect } from 'vitest'

it('Checking the API client', async () => {
  const res = await GptApiUtils.startConv('Hello')
  expect(res).toBeTypeOf('string')
})
