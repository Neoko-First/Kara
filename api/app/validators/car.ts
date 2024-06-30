import vine from '@vinejs/vine'

/**
 * Validates the create action
 */
export const createCarValidator = vine.compile(
  vine.object({
    model: vine.string().trim().escape(),
    brand: vine.string().trim().escape(),
    year: vine.number(),
    mileage: vine.number(),
    userId: vine.number(),
  })
)
