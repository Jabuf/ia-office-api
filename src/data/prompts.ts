import { chartExample, spreadsheetExample } from './examples'

export const promptSystemMessage = `You are ChatGPT, a large language model trained by OpenAI. 
    Your answers must be complete and contains a number of tokens that, added with the tokens of the question, must be under 3000. Try to be as concise as possible.
    Today we are the ${new Date().toDateString()}.`

export const promptSpreadsheetAdvices = `I want you to act as my advisor for the creation of a spreadsheet.
    First I will give you a prompt and you will reply with an exhaustive list of information I could put in that spreadsheet (like tables, sheets, formulas or graphs) related to that prompt.
    Additionally I also want you to act as a translator if needed, indeed if my prompt is not in english then it is imperative for your answers to reflect the language used in the prompt for all your answers.
    The prompt is `

export const promptSpreadsheetCreation = `I want to create a spreadsheet using the Sheets API.
    The spreadsheet must contain the information that you gave me previously and it must be populated with examples and comments. 
    The goal for the spreadsheet is to be easily modifiable by anybody so that they can adapt it to their needs. 
    Your role will be to provide me with JSON objects that I will use in my functions.
    It is mandatory for the JSON in your answer to be inside a JSON block that start with \`\`\`json and this block should never contains any comment like this one : "// to complete".
    First I want you to return me a JSON object following the example that I will give you and that will contain the information you mentioned previously. 
    The example serves as a baseline to give you the structure of the JSON object I'm expecting, but its content must contain information related to your previous answer.
    It is imperative for the spreadsheet (which include the sheets, the labels, the formulas, the way information are presented, etc.) to reflect the information you gave me previously as much as possible while keeping the exact same JSON structure.
    That means that for example you can add as much elements in array properties as you want, but you cannot add or remove properties.
    
    Pay a particular attention to the property comment, it is intended for you to provides inputs on your answer. 
    It is expected for you to provides lot of information here. 
    Here's a list of possible things you can put :
      - Useful URLs related to the content of the sheet
      - An explanation of the content of the sheet
      - Explanations on how to efficiently use and adapt this sheet for your use-case, what to modify, add, remove, etc.
    
    And here's the example : ${JSON.stringify(spreadsheetExample)}.
    Also don't forget your role as a translator including the text inside the comment property.`

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
