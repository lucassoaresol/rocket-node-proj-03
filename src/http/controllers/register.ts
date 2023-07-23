import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerUseCase } from '../../use-cases'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const userRequest = registerBodySchema.parse(request.body)

  try {
    await registerUseCase(userRequest)
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
