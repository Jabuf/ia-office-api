import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { chartExample, documentExample, spreadsheetExample } from './examples'
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam

const promptSystem: ChatCompletionSystemMessageParam = {
  role: 'system',
  content: `You are ChatGPT, a large language model trained by OpenAI. Today we are the ${new Date().toDateString()}`,
}

const getPromptSystemSpreadsheetCreation = (
  prompt: string,
): ChatCompletionSystemMessageParam => {
  return {
    role: 'system',
    content: `${promptSystem.content ?? ''}. 
      You will act as a advisor for the creation of a spreadsheet and will output JSON.
      You are allowed to use 4000 tokens to produce the output.
      You will also act as a translator. Indeed, if the following extract is not in english, then you must translate all your answers to this language, even if I continue to talk to you in english.
      The extract : ${prompt.substring(0, 50)}`,
  }
}

const getPromptSystemDocumentCreation = (
  prompt: string,
): ChatCompletionSystemMessageParam => {
  return {
    role: 'system',
    content: `${promptSystem.content ?? ''}. 
      You will act as a writer for the creation of a text document and will output JSON.
      You will also act as a translator. Indeed, if the following extract is not in english, then you must translate all your answers to this language, even if I continue to talk to you in english.
      The extract : ${prompt.substring(0, 50)}`,
  }
}

const getJsonInstructions = (jsonExample: Record<string, unknown>): string => {
  return `I will now give you an example of a JSON object that will serve as a baseline for the structure of the JSON I'm expecting.
      It is imperative for the JSON in your answer to have the same structure as my example, which means that you cannot add or remove properties but you can add as much elements as you want in array properties.
      The values in my example are placeholder meant to be replaced, they shouldn't be the same in your answer.
      Also, it is to be noted that the JSON will be used automatically to generate a file and that this file will then be used by a person.
      This person will not only be unable to modify it due to a physical disability, but also for this file to be complete and functional is a life threatening issue for them.
      Here's the example : ${JSON.stringify(jsonExample)}.`
}

export const getPromptsSpreadsheetAssisted = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    getPromptSystemSpreadsheetCreation(prompt),
    {
      role: 'user',
      content: `I will give you a prompt that contain a general idea for a spreadsheet. 
      The goal is to create a spreadsheet from this idea using the Sheets API and you will help me by providing a JSON object filled with data related to this idea.
      The prompt is : "${prompt}".
      
      ${getJsonInstructions(spreadsheetExample)}
      
     `,
    },
  ]
}

export const getPromptsSpreadsheetInstructions = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    getPromptSystemSpreadsheetCreation(prompt),
    {
      role: 'user',
      content: `I will give you a prompt that contain instructions that have for goal the creation of a spreadsheet using the Sheets API and you will return a JSON object.
      The prompt is : "${prompt}".
      
      ${getJsonInstructions(spreadsheetExample)}
      
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

export const getPromptsDocument = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    getPromptSystemDocumentCreation(prompt),
    {
      role: 'user',
      content: `I will give you a prompt that contain a general idea of a text document I would like to produce and you will return a JSON object.
      The prompt is : "${prompt}" and would I like you to return a exhaustive and lengthy example of what this document could look like. 
      The language of your answer must respect your role as a translator.
      
      ${getJsonInstructions(documentExample)}
      
      Here's a quick rundown of some properties of the JSON object :
        - content : an array of paragraphs separated with titles, if you consider that there's no need for such a separation (for example in a letter), then this array should only include one element
        - sectionName : an optional property for the title of a paragraph, if there's only one element in the content array, then usually you'll leave this empty
        - text: formatted text
`,
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
