import dotenv from 'dotenv'
import { logger } from '../logging/logger'
import { CustomError } from '../errors/CustomError'
import { OpenAI } from 'openai'
import { ChatCompletion } from 'openai/resources'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { OpenAIError } from 'openai/error'

dotenv.config()

export default abstract class GptApiUtils {
  // use default env values
  static openai = new OpenAI()
  // Available models here : https://platform.openai.com/docs/models/
  static defaultModel = 'gpt-3.5-turbo-1106'

  static async startConv(
    messages: ChatCompletionMessageParam[],
    options?: {
      previousMessages?: ChatCompletionMessageParam[]
      returnJson?: boolean
    },
  ): Promise<ChatCompletion> {
    try {
      // Chat completion documentation : https://platform.openai.com/docs/api-reference/chat/create
      const start = performance.now()
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [...(options?.previousMessages ?? []), ...messages],
        model: this.defaultModel,
        response_format: { type: options?.returnJson ? 'json_object' : 'text' },
      })
      const end = performance.now()
      // TODO full logs in debug only and add costs ?
      logger.info(
        `answer size : ${JSON.stringify(chatCompletion.usage)},
      execution time: ${((end - start) / 1000).toFixed(0)}, 
      answer: ${JSON.stringify(chatCompletion.choices[0].message)},
      prompt: ${JSON.stringify(messages).substring(0, 500)}`,
      )
      return chatCompletion
    } catch (err) {
      if (err instanceof OpenAIError) {
        logger.error(err)
        throw new CustomError('ERROR_OPENAI', err.message, err.name)
      }
      throw err
    }
  }

  static async getStatus(): Promise<boolean> {
    try {
      await this.openai.chat.completions.create(
        {
          messages: [{ role: 'user', content: `Are you up ?` }],
          model: this.defaultModel,
        },
        { timeout: 5000 },
      )
      return true
    } catch (err) {
      if (err instanceof OpenAIError) {
        logger.error(err)
        throw new CustomError('ERROR_OPENAI', err.message, err.name)
      }
      throw err
    }
  }
}
