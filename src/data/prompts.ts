import { chartExample, spreadsheetExample } from './examples'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import OpenAI from 'openai'
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam

const promptSystem: ChatCompletionSystemMessageParam = {
  role: 'system',
  content: `You are ChatGPT, a large language model trained by OpenAI. Today we are the ${new Date().toDateString()}.`,
}

const getPromptSystemSpreadsheetCreation = (
  prompt: string,
): ChatCompletionSystemMessageParam => {
  return {
    role: 'system',
    content: `${promptSystem.content ?? ''}. 
      You will act as a advisor for the creation of a spreadsheet and will output JSON.
      You will also act as a translator. Indeed, if the following extract is not in english, then you must translate all your answers to this language, even if I continue to talk to you in english.
      The extract : ${prompt.substring(0, 50)}`,
  }
}

export const getPromptsSpreadsheetCreationA = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    getPromptSystemSpreadsheetCreation(prompt),
    {
      role: 'user',
      content: `I will give you a prompt that have for goal the creation of a spreadsheet using the Sheets API.
      The prompt is : "${prompt}".
      
      I will now give you an example of a JSON object that will serve as a baseline for the structure of the JSON object I'm expecting.
      It is imperative for the JSON in your answer to have the same structure as my example, which means that you cannot add or remove properties but you can add as much elements as you want in array properties.
      The values in my example are placeholder meant to be replaced, they shouldn't be present in your answer.
      Here's the example : ${JSON.stringify(spreadsheetExample)}.
      
      I want you to return this JSON with a content related to the prompt above. It is imperative for the language of the content to respect your role as a translator and be in the same language as the prompt. 
      If specific instructions were given about sheets or tables, they must be respected.
      Here's a quick rundown of some properties of the JSON object :
          - tables : each element of this array represent a table inside the same sheet, feel free to choose the correct number of element
          - values : the values of a table, each element of this array represent a row with the first element being the header. All elements inside a same table should have the same length.
          - comment : intended for you to provides inputs on your answer. This is mandatory and should lengthy. 
            It includes : if you have used formulas where they are and what they do, general information about the tables, instructions on how to adapt the sheet to similar use-cases, urls providing explanation on how to fill the data if relevant.`,
    },
  ]
}

export const getPromptsSpreadsheetCreationB = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    getPromptSystemSpreadsheetCreation(prompt),
    {
      role: 'user',
      content: `I will give you a prompt that have for goal the creation of a spreadsheet using the Sheets API.
      The prompt is : "${prompt}".
      
      I will now give you an example of a JSON object that will serve as a baseline for the structure of the JSON object I'm expecting.
      It is imperative for the JSON in your answer to have the same structure as my example, which means that you cannot add or remove properties but you can add as much elements as you want in array properties.
      The values in my example are placeholder meant to be replaced, they shouldn't be present in your answer.
      Here's the example : ${JSON.stringify(spreadsheetExample)}.
      
      I want you to return this JSON with a content related to the prompt above. It is imperative for the language of the content to respect your role as a translator and be in the same language as the prompt. 
      If specific instructions were given about sheets or tables, they must be respected.
      Here's a quick rundown of some properties of the JSON object :
          - tables : each element of this array represent a table inside the same sheet, feel free to choose the correct number of element
          - values : the values of a table, each element of this array represent a row with the first element being the header. All elements inside a same table should have the same length.
          - comment : intended for you to provides inputs on your answer. This is mandatory and should lengthy. 
            It includes : if you have used formulas where they are and what they do, general information about the tables, instructions on how to adapt the sheet to similar use-cases, urls providing explanation on how to fill the data if relevant.`,
    },
  ]
}
export const promptChartsCreation = `Now I want to add a chart to my Sheets file. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    I want you to return me the a JSON object following the example but that will instead use what we've added in our Sheets file previously :
    ${JSON.stringify(chartExample)}
    Moreover here's additional information :
    - the property chartType can take the following values : 'BAR', 'LINE', 'AREA', 'COLUMN', 'SCATTER' or 'STEPPED_AREA'; you're free to decide what's most adapted
    - the property position of the axes object can take the following values : 'BOTTOM_AXIS', 'LEFT_AXIS' or 'RIGHT_AXIS': you're free to decide what's most adapted
    - the property targetAxis must always be 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED'
    - the property sheetName must stay as it is and correspond to one of the sheets we've created previously, does not replace it with sheetId
    - the rest of the properties must be related to what we've created previously`
