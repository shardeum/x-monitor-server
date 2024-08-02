import express, { Request, Response, Router } from 'express'
import { nestedCountersInstance } from '../class/profiler/nestedCounters'

export const healthCheckRouter: Router = express.Router()

healthCheckRouter.get('/is-alive', (req: Request, res: Response) => {
  nestedCountersInstance.countEvent('endpoint', 'is-alive', 1)
  return res.sendStatus(200)
})

healthCheckRouter.get('/is-healthy', (req: Request, res: Response) => {
  // TODO: Add actual health check logic
  nestedCountersInstance.countEvent('endpoint', 'health-check', 1)
  return res.sendStatus(200)
})
