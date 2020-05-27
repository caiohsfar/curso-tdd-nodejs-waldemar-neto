import express from 'express'
import RootController from "../controllers/root"

const rootController = new RootController()
const router = express.Router()

router.get('/', (req, res) => rootController.index(req, res))

export default router