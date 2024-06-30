import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        pseudo: 'John Doe',
        email: 'john@doe.com',
        password: 'john',
      },
    ])
  }
}
