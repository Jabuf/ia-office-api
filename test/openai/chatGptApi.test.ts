import ChatGptApiUtils from '../../src/utils/openai/ChatGptApiUtils'
import { expect } from 'vitest'

it('Checking the API client', async () => {
  const res = await ChatGptApiUtils.startConv('Hello')
  expect(res).toBeTypeOf('string')
})
