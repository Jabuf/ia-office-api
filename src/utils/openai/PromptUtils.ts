import dotenv from 'dotenv'
import OpenAI from 'openai'
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam

dotenv.config()

export default abstract class PromptUtils {
  protected static promptSystem: ChatCompletionSystemMessageParam = {
    role: 'system',
    content: `You are ChatGPT, a large language model trained by OpenAI. Today we are the ${new Date().toDateString()}`,
  }

  protected static getJsonInstructions = (
    jsonExample: Record<string, unknown>,
  ): string => {
    return `I will now give you an example of a JSON object that will serve as a baseline for the structure of the JSON I'm expecting.
      It is imperative for the JSON in your answer to have the same structure as my example, which means that you cannot add or remove properties but you can add as much elements as you want in array properties.
      The values in my example are placeholder meant to be replaced, they shouldn't be the same in your answer.
      Also, it is to be noted that the JSON will be used automatically to generate a file and that this file will then be used by a person.
      This person will not only be unable to modify it due to a physical disability, but also for this file to be complete and functional is a life threatening issue for them.
      Here's the example : ${JSON.stringify(jsonExample)}.`
  }
}
