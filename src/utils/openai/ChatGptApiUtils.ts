import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import { logger } from '../logging/logger'
import { CustomError, errorOpenAi } from '../errors/CustomError'
import { CreateCompletionResponseUsage } from 'openai'
import PromptUtils from './PromptUtils'

dotenv.config()

export type GPTResponse = {
  answer: string
  id: string
  usage: CreateCompletionResponseUsage | undefined
}

export default abstract class ChatGptApiUtils {
  static chatGptApi = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    debug: process.env.OPENAPI_DEBUG === 'true' ?? false,
    completionParams: {
      // Available models here : https://platform.openai.com/docs/models/
      // model: process.env.OPENAI_DEFAULT_MODEL ?? '',
      model: 'gpt-3.5-turbo-1106',
      // model: 'gpt-4',
    },
    systemMessage: `You are ChatGPT, a large language model trained by OpenAI. 
    Your answers must be complete and contains a number of tokens that, added with the tokens of the question, must be under 4000. Try to be as concise as possible.`,
  })
  static sheetsParentResId = ''

  static async startConv(message: string): Promise<GPTResponse> {
    try {
      const res = await this.chatGptApi.sendMessage(message)
      return {
        id: res.id,
        answer: res.text,
        usage: res.detail?.usage,
      }
    } catch (err) {
      logger.error(err)
      throw errorOpenAi
    }
  }

  static async pursueExistingConv(
    parentMessageId: string,
    prompt: string,
  ): Promise<GPTResponse> {
    try {
      const start = performance.now()
      const res = await this.chatGptApi.sendMessage(prompt, {
        parentMessageId,
      })
      const end = performance.now()
      logger.info(
        `parentId: ${parentMessageId}, 
      answer size : ${JSON.stringify(res.detail?.usage)},
      execution time: ${((end - start) / 1000).toFixed(0)}, 
      answer: ${res.text},
      prompt: ${prompt}`,
      )
      return {
        id: res.id,
        answer: res.text,
        usage: res.detail?.usage,
      }
    } catch (err) {
      logger.error(err)
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

  static async startSheetsApiConv(): Promise<string> {
    try {
      const res = await this.chatGptApi.sendMessage(PromptUtils.sheetsApi)
      return res.id
    } catch (err) {
      logger.error(err)
      throw errorOpenAi
    }
  }

  static extractJson<T>(chatGptAnswer: string): T | undefined {
    try {
      if (chatGptAnswer.includes('```json')) {
        return JSON.parse(this.extractCode(chatGptAnswer, 'json')[0]) as T
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new CustomError('ERROR_JSON', err.message, err.name)
      }
      if (err instanceof Error) {
        throw new CustomError('ERROR_RUN_CODE', err.message, err.name)
      }
    }
  }
}
