import { FastifyReply, FastifyRequest } from 'fastify'
import { hashSync } from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { z } from 'zod'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  const password_hash = hashSync(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

  if (userWithSameEmail) return reply.status(409).send()

  await prisma.user.create({ data: { name, email, password_hash } })

  return reply.status(201).send()
}
