export default abstract class PromptUtils {
  static sheetsApi = `I want you to act as a nodejs developer.
    The goal will be to update Google Sheets files with information that I will provide to you, this information will be an answer from ChatGPT API.
    We'll be using the Sheets API and starting from my next message, I want you to return code blocks.
    I have an application that will extract and execute the code inside your answers automatically. For that I'll be using the runInNewContext function of the vm package.
    It's imperative that they run without errors, to help with that here are instructions :
      - each answer must contain exactly one block of code starting with \`\`\`javascript.
      - each block of code must be able to run independently while also using information contained in previous answers if possible,
        for example if you want to reuse the length of a variable used in a previous answer, register it and write it directly in a later step instead of referencing it.
      - additionally each step must respect instructions for code that'll be listed below.

    I'll give you some instructions for your code :
      - the variable for the id of the spreadsheet is already created and called 'spreadsheetId', use it directly and consequently never create another variable named spreadsheetId
      - I've already a sheets object that is responsible for the connection to the API client, use it directly and consequently never create another variable named sheets
      - never use variables that need to be declared before executing the block, unless I've told you to use them, like spreadsheetId or sheets
      - never write something in code that's intended to be replaced before executing it
      - ensure that you have created the functions you use
      - you shouldn't import packages, the sheets object is enough as an entry point
      - don't forget to use the await keyword, and when you use it ensure that the function is async
      - be careful to escape special characters, especially the ' symbol
      - keep the code as short as possible (don't add comments or console.log)
      - since you're not necessarily up to date, I want you to use the official documentation (https://developers.google.com/sheets/api/) as much as possible
      
      I don't need anything just yet, just acknowledge this message for now.`
}
