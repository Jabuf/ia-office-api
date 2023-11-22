import { chartExample, spreadsheetExample } from './examples'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'

export const promptSystem: ChatCompletionMessageParam = {
  role: 'system',
  content: `You are ChatGPT, a large language model trained by OpenAI. Today we are the ${new Date().toDateString()}.`,
}

export const promptJson: ChatCompletionMessageParam = {
  role: 'system',
  content: `You are a helpful assistant designed to output JSON.`,
}

export const getPromptsSpreadsheetAdvices = (
  prompt: string,
): ChatCompletionMessageParam[] => {
  return [
    {
      role: 'system',
      content: `I want you to act as my advisor for the creation of a spreadsheet.`,
    },
    {
      role: 'user',
      content: `First I will give you a prompt and you will reply with an exhaustive list of information I could put in that spreadsheet (like tables, sheets, formulas or graphs) related to that prompt.
    Additionally I also want you to act as a translator if needed, indeed if my prompt is not in english then it is imperative for your answers to reflect the language used in the prompt for all your answers.
    The prompt is ${prompt}`,
    },
  ]
}

export const getPromptsSpreadsheetCreation =
  (): ChatCompletionMessageParam[] => {
    return [
      {
        role: 'user',
        content: `I want to create a spreadsheet using the Sheets API.
    The goal is for the spreadsheet to contain the information that you gave me previously, populated with examples and comments. 
    Also it should be easily modifiable by anybody so that they can adapt it to their needs. 
    
    Your role will be to provide me with a JSON object that I will use in my code.
    It is mandatory for the JSON in your answer to be inside a JSON block that start with \`\`\`json.
    I will give you an example of a JSON object that will serve as a baseline for the structure of the JSON object I'm expecting.
    It is imperative for the JSON in your answer to have the same structure that my example, which means that you cannot add or remove properties but you can add as much elements as you want in array properties.
    The values in my example are placeholder meant to be replaced and it is important for your answer to reflect the information you gave me previously about the creation of a spreadsheet.
    Also don't forget your role as a translator, the language used inside the JSON object must reflect the language used in the initial prompt.
    Here's a quick rundown of some properties :
        - tables : each element of this array represent a table inside the same sheet, feel free to choose the correct number of element
        - values : the values of a table, each element of this array represent a row with the first element being the header. All elements inside a same table should have the same length.
        - comment : intended for you to provides inputs on your answer, notably explanations on how to efficiently use and adapt the corresponding sheet for a different use-case
    
    Here's the example : ${JSON.stringify(spreadsheetExample)}.`,
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
