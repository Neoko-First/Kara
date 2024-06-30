import Car from '#models/car'
import { createCarValidator } from '#validators/car'
import type { HttpContext } from '@adonisjs/core/http'

export default class CarsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    const cars = await Car.all()
    return cars
  }

  /**
   * Create a new record
   */
  async create({ response, request }: HttpContext) {
    const data = request.all()
    const payload = await createCarValidator.validate(data)
    await Car.create(payload)
    return response.created('Car created successfully')
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const car = await Car.find(params.id)

    if (!car) {
      return response.notFound('Car not found')
    }

    return car
  }

  /**
   * Edit individual record
   */
  async update({ params }: HttpContext) {}

  /**
   * Delete individual record
   */
  async destroy({ params }: HttpContext) {}
}
