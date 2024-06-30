import vine from '@vinejs/vine'

/**
 * Validates the register action
 */
export const registerValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(6).maxLength(20).escape(),
    email: vine.string().trim().email().escape(),
    password: vine.string().trim().minLength(6).escape(),
  })
)

/**
 * Validates the login action
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().escape(),
    password: vine.string().trim().minLength(6).escape(),
  })
)
