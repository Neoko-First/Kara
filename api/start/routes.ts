/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const CarsController = () => import('#controllers/cars_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/', [CarsController, 'index'])
    router.get('/:id', [CarsController, 'show'])
    router.post('/', [CarsController, 'create'])
    router.put('/:id', [CarsController, 'update'])
    router.delete('/:id', [CarsController, 'destroy'])
  })
  .prefix('/cars')
