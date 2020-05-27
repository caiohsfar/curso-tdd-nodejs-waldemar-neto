import express from 'express'
import productsRoute from './products'
import rootRoute from './root'

const router = express.Router()

router.use('/products', productsRoute)
router.get('/', rootRoute)

export default router