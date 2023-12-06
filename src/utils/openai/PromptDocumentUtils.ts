import dotenv from 'dotenv'
import OpenAI from 'openai'
import PromptUtils from './PromptUtils'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { documentExample } from './examples'
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

  static getJsonCreation = (prompt: string): ChatCompletionMessageParam[] => {
    return [
      this.getSystemCreation(prompt),
      {
        role: 'user',
        content: `I will give you a prompt that contain a general idea of a text document I would like to produce and you will return a JSON object.
      The prompt is : "${prompt}" and would I like you to return a exhaustive and lengthy example of what this document could look like. 
      The language of your answer must respect your role as a translator.
      
      ${this.getJsonInstructions(documentExample)}
      
      Here's a quick rundown of some properties of the JSON object :
        - content : an array of paragraphs separated with titles, if you consider that there's no need for such a separation (for example in a letter), then this array should only include one element
        - sectionName : an optional property for the title of a paragraph, if there's only one element in the content array, then usually you'll leave this empty
        - text: formatted text
`,
      },
    ]
  }
}
