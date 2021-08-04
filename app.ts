import express, { Application, Request, Response } from 'express'
import * as path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import HttpResponse from './utils/http'

import indexRouter from './routes/index'

import * as ChildProcess from 'child_process'
import { job } from './utils/cron'

console.log('[env] NODE_APP_UPLOADMAXCOUNT', process.env.NODE_APP_UPLOADMAXCOUNT)
console.log('[env] NODE_APP_LIMITFILESIZE', process.env.NODE_APP_LIMITFILESIZE)
console.log('[env] NODE_APP_AZURE_CONTAINER', process.env.NODE_APP_AZURE_CONTAINER)
console.log('[env] NODE_APP_AZURE_STORAGEACCOUNT', process.env.NODE_APP_AZURE_STORAGEACCOUNT)
console.log('[env] NODE_APP_AZURE_STORAGEURI', process.env.NODE_APP_AZURE_STORAGEURI)
console.log('[env] NODE_APP_AZURE_STORAGEACCOUNTPW', process.env.NODE_APP_AZURE_STORAGEACCOUNTPW)
console.log()

ChildProcess.execSync('[ -d static ] || mkdir static')

job.start()

const app: Application = express()

// cors
const corsOptions = {
  origin: process.env.NODE_APP_CORS_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routers
app.use('/', indexRouter)

// 403 all other routes
app.use('*', function(req: Request, res: Response, next: Function): void {
  res.send(new HttpResponse(403, 'forbidden'))
})

export default app
