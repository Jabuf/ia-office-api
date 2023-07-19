import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

export default abstract class OpenAiApiUtils {
  private static configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })
  private static openai = new OpenAIApi(this.configuration)

  static async getEnginesList() {
    return this.openai.listEngines()
  }
}
