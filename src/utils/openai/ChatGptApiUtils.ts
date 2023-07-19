import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'

dotenv.config()

export default abstract class ChatGptApiUtils {
  private static chatGptApi = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    completionParams: {
      model: process.env.OPENAI_DEFAULT_MODEL ?? '',
    },
  })
  private static convID: string

  static async startConv(message: string): Promise<string> {
    const res = await this.chatGptApi.sendMessage(message)
    this.convID = res.id
    return res.text
  }

  static async pursueExistingConv(message: string): Promise<string> {
    const res = await this.chatGptApi.sendMessage(message, {
      parentMessageId: this.convID,
    })
    this.convID = res.id
    return res.text
  }
}
