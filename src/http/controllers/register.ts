import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '../../use-cases'
import { PrismaUsersRepository } from '../../repositories'
import { UserAlreadyExistsError } from '../../use-cases/errors'

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
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute(userRequest)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: err.message })

    throw err
  }

  return reply.status(201).send()
}
