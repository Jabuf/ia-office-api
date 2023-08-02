import { FastifyReply } from 'fastify'

type GeneralDetailsResData = Record<string, unknown> | Record<string, unknown>[]

/**
 * TODO
 */
export abstract class HttpControllerUtils {
  static sendGetResponse<ResData extends GeneralDetailsResData>(
    res: FastifyReply,
    data: ResData,
  ) {
    return this.sendResponse(res, 200, data)
  }

  static sendPostResponse<T extends object>(res: FastifyReply, data: T) {
    return this.sendResponse(res, 201, data)
  }

  static sendPutResponse<ResData extends GeneralDetailsResData>(
    res: FastifyReply,
    data: ResData,
  ) {
    return this.sendResponse(res, 201, data)
  }

  static sendErrorResponse(res: FastifyReply, data: object = {}) {
    return this.sendResponse(res, 500, data)
  }

  static sendAuthenticateResponse<ResData extends GeneralDetailsResData>(
    res: FastifyReply,
    data: ResData,
  ) {
    return this.sendResponse(res, 200, data)
  }

  private static sendResponse(
    res: FastifyReply,
    code: number,
    data: object = {},
  ) {
    return res.status(code).send({
      code,
      data,
    })
  }
}
