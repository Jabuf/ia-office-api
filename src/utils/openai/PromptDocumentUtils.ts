import dotenv from 'dotenv'
import OpenAI from 'openai'
import PromptUtils from './PromptUtils'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { DocumentData } from '../google/DocsApiUtils'
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam

dotenv.config()

export default abstract class PromptDocumentUtils extends PromptUtils {
  private static getSystemCreation = (
    prompt: string,
  ): ChatCompletionSystemMessageParam => {
    return {
      role: 'system',
      content: `${this.promptSystem.content ?? ''}. 
      You will act as a writer for the creation of a text document and will output JSON.
      You will also act as a translator. Indeed, if the following extract is not in english, then you must translate all your answers to this language, even if I continue to talk to you in english.
      The extract : ${prompt.substring(0, 50)}`,
    }
  }

  static getJsonCreation = (
    prompt: string,
    example: DocumentData,
  ): ChatCompletionMessageParam[] => {
    return [
      this.getSystemCreation(prompt),
      {
        role: 'user',
        content: `I will give you a prompt that contain a general idea of a text document I would like to produce and you will return a JSON object.
      The prompt is : "${prompt}" and would I like you to return a exhaustive and lengthy example of what this document could look like. 
      You will also act as a translator. Indeed, if the prompt is not in english, then your answer must be in this language, even if I continue to talk to you in english.
      The content of your answer shouldn't be in english unless it is the language used in the prompt I gave you.
      
      ${this.getJsonInstructions(example)}`,
      },
    ]
  }
}
