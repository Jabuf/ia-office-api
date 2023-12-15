import GptApiUtils from '../src/utils/openai/GptApiUtils'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
describe('gpt api', () => {
  it('startConv', async () => {
    const message: ChatCompletionMessageParam = {
      role: 'user',
      content: 'Respond ok if you can read me.',
    }
    const res = await GptApiUtils.startConv([message])
    expect(res.choices[0].message.content).not.toBeNull()
  })
})
