import dotenv from 'dotenv'
import OpenAI from 'openai'
import PromptUtils from './PromptUtils'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { chartExample, spreadsheetExample } from './examples'
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam

dotenv.config()

export default abstract class PromptSpreadsheetUtils extends PromptUtils {
  private static getSystemCreation = (
    prompt: string,
  ): ChatCompletionSystemMessageParam => {
    return {
      role: 'system',
      content: `${this.promptSystem.content ?? ''}. 
      You will act as a advisor for the creation of a spreadsheet and will output JSON.
      You are allowed to use 4000 tokens to produce the output.
      You will also act as a translator. Indeed, if the following extract is not in english, then you must translate all your answers to this language, even if I continue to talk to you in english.
      The extract : ${prompt.substring(0, 50)}`,
    }
  }

  static getSuggestions = (prompt: string): ChatCompletionMessageParam[] => {
    return [
      {
        role: 'user',
        content: `I will give you a prompt that contain a general idea for a spreadsheet and want you to act as my advisor.
      Your role will be to provide me with an exhaustive list of what I could put in that spreadsheet.
      You will also act as a translator. Indeed, if the prompt is not in english, then your answer must be in this language, even if I continue to talk to you in english.
      You must start your answer by explicitly indicate the language that should be used in the file, like 'Ce fichier doit être en français'.
      The prompt is : "${prompt}"
      
      A good approach would be to first try to determine if it corresponds to a spreadsheet that is commonly produced.
        If that's the case, then return everything we need to recreate this common spreadsheet. For example it could be about project planning, financial statements or taxes declaration.
        If that's not the case, then try to understand what's the goal of the author of the prompt and provide not only what's related to the prompt, but also things that they did not necessarily think about. 
      Your answer must be exhaustive and contain as much data as you think can be potentially useful.`,
      },
    ]
  }

  static getJsonCreationFromSuggestions = (
    prompt: string,
  ): ChatCompletionMessageParam[] => {
    return [
      this.getSystemCreation(prompt),
      {
        role: 'user',
        content: `Following the suggestions you provided me earlier, I now want you to build a JSON object that will contain all these suggestions.
        It is imperative for your answer to respect your role as a translator and be in the language indicated in our prior exchange. 
        The content of your answer shouldn't be in english unless explicitly stated.
      
      ${this.getJsonInstructions(spreadsheetExample)}
      
      Here's a quick rundown of some properties of the JSON object :
          - tables : each element of this array represent a table inside the same sheet, feel free to choose the correct number of element
          - values : the values of a table, each element of this array represent a row with the first element being the header. All elements inside a same table should have the same length.
          - comment : intended for you to provides inputs on your answer. This is mandatory, should be lengthy and formatted (with line breaks). 
            It can includes mention of the commonly spreadsheet the user is trying to produce;
            if you have used formulas where they are and what they do;
            general information about the tables;
            instructions on how to adapt the sheet to similar use-cases; 
            urls providing sources of why this is an important information for the spreadsheet;
            urls providing explanations on how to fill the data if relevant.`,
      },
    ]
  }

  static getJsonCreationFromPrompt = (
    prompt: string,
  ): ChatCompletionMessageParam[] => {
    return [
      this.getSystemCreation(prompt),
      {
        role: 'user',
        content: `I will give you a prompt that contain instructions that have for goal the creation of a spreadsheet using the Sheets API and you will return a JSON object.
      The prompt is : "${prompt}".
      
      ${this.getJsonInstructions(spreadsheetExample)}
      
      I want you to return this JSON with a content related to the prompt above. It is imperative for the language of the content to respect your role as a translator and be in the same language as the prompt. 
      Instructions about sheets or tables must be respected as much as possible. Your answer must be exhaustive and contain as much data as you think can be potentially useful.
      That means for example that if the prompt ask for a table with the months of a full year for columns, then your answer must contain all the months, not just some of them. Same for the number of rows or sheets. 
      
      Here's a quick rundown of some properties of the JSON object :
          - tables : each element of this array represent a table inside the same sheet, feel free to choose the correct number of element
          - values : the values of a table, each element of this array represent a row with the first element being the header. All elements inside a same table should have the same length.
          - comment : leave it empty`,
      },
    ]
  }

  static getChartsCreation = `Now I want to add a chart to my Sheets file. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    I want you to return me the a JSON object following the example but that will instead use what we've added in our Sheets file previously :
    ${JSON.stringify(chartExample)}
    Moreover here's additional information :
    - the property chartType can take the following values : 'BAR', 'LINE', 'AREA', 'COLUMN', 'SCATTER' or 'STEPPED_AREA'; you're free to decide what's most adapted
    - the property position of the axes object can take the following values : 'BOTTOM_AXIS', 'LEFT_AXIS' or 'RIGHT_AXIS': you're free to decide what's most adapted
    - the property targetAxis must always be 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED'
    - the property sheetName must stay as it is and correspond to one of the sheets we've created previously, does not replace it with sheetId
    - the rest of the properties must be related to what we've created previously`
}
