import { hashSync } from 'bcryptjs'
import { prisma } from '../lib/prisma'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = hashSync(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({ where: { email } })

    if (userWithSameEmail) throw new Error('E-mail already exists.')

    await this.usersRepository.create({ name, email, password_hash })
  }
}
