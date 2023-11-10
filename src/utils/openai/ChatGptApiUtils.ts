import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import { logger } from '../logging/logger'
import { errorOpenAi } from '../errors/CustomError'

dotenv.config()

export type GPTResponse = {
  answer: string
  id: string
}

export default abstract class ChatGptApiUtils {
  private static chatGptApi = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    debug: process.env.OPENAPI_DEBUG === 'true' ?? false,
    completionParams: {
      model: process.env.OPENAI_DEFAULT_MODEL ?? '',
      // model: 'gpt-4',
    },
    systemMessage: `You are ChatGPT, a large language model trained by OpenAI, your answers must be under 3500 characters and as concise as possible.' +
        'Your information are up to date until September 2021, today we are the ${new Date().toDateString()}`,
  })

  static async startConv(message: string): Promise<GPTResponse> {
    const res = await this.chatGptApi.sendMessage(message)
    return {
      answer: res.text,
      id: res.id,
    }
  }

  static async pursueExistingConv(
    parentMessageId: string,
    message: string,
  ): Promise<GPTResponse> {
    try {
      const res = await this.chatGptApi.sendMessage(message, {
        parentMessageId,
      })
      return {
        answer: res.text,
        id: res.id,
      }
    } catch (e) {
      logger.error(e)
      throw errorOpenAi
    }
  }

  static extractCode(chatGptAnswer: string, language = 'javascript'): string[] {
    const codeBlocks: string[] = []
    const codeSeparator = '```'
    const arr = chatGptAnswer.split(codeSeparator)

    arr.forEach((str) => {
      if (str.split('\n')[0].trim() === language) {
        codeBlocks.push(str.substring(str.indexOf('\n')))
      }
    })
    return codeBlocks
  }

  /**
   * @deprecated
   */
  static extractList(chatGptAnswer: string): string[] {
    if (chatGptAnswer.includes('```json')) {
      return (
        JSON.parse(this.extractCode(chatGptAnswer, 'json')[0]) as unknown as {
          answers: string[]
        }
      ).answers
    } else {
      return (JSON.parse(chatGptAnswer) as unknown as { answers: string[] })
        .answers
    }
  }
}
