import { FastifyError } from 'fastify'

export class CustomError implements FastifyError {
  code: string
  message: string
  name: string
  statusCode: number

  constructor(code: string, message: string, name: string, statusCode = 500) {
    this.code = code
    this.message = message
    this.name = name
    this.statusCode = statusCode
  }
}

export const errorOpenAi = new CustomError(
  'ERROR_OPENAI',
  'There was a problem while communicating with ChatGPT',
  'ERROR_OPENAI',
  500,
)
