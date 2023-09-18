import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'

dotenv.config()

export type GPTResponse = {
  response: string
  id: string
}

export default abstract class ChatGptApiUtils {
  private static chatGptApi = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    completionParams: {
      model: process.env.OPENAI_DEFAULT_MODEL ?? '',
    },
  })

  static async startConv(message: string): Promise<GPTResponse> {
    const res = await this.chatGptApi.sendMessage(message)
    return {
      response: res.text,
      id: res.id,
    }
  }

  static async pursueExistingConv(
    parentMessageId: string,
    message: string,
  ): Promise<GPTResponse> {
    const res = await this.chatGptApi.sendMessage(message, {
      parentMessageId,
    })
    return {
      response: res.text,
      id: res.id,
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
}
