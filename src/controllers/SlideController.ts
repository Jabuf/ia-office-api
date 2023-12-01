import { FastifyReply, FastifyRequest } from 'fastify'
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions'
import { DriveFileInfo } from '../services/FileService'
import { SlideService } from '../services/SlideService'
import { HttpControllerUtils } from '../utils/HttpControllerUtils'

export type SlideInfo = {
  messages: ChatCompletionMessageParam[]
  driveFileInfo: DriveFileInfo
}

export class SlideController {
  createSlide = async (
    req: FastifyRequest<{ Body: { text: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    const slideService = new SlideService()
    const slideInfo = await slideService.createSlide(req.body)
    await HttpControllerUtils.sendPostResponse<SlideInfo>(res, slideInfo)
  }
}
