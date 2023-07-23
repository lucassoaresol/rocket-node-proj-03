import { hashSync } from 'bcryptjs'
import { UsersRepository } from '../repositories'
import { UserAlreadyExistsError } from './errors'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = hashSync(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    await this.usersRepository.create({ name, email, password_hash })
  }
}
