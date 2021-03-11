import express, { Router, Request, Response } from "express"
import HttpResponse from "../utils/http"
import * as ChildProcess from 'child_process'
import { uploadFiles } from '../utils/multer'

const router: Router = express.Router()

const container: string = process.env.NODE_APP_AZURE_CONTAINER || ''
const storageAccount: string = process.env.NODE_APP_AZURE_STORAGEACCOUNT || ''
const storageAccountPw: string = process.env.NODE_APP_AZURE_STORAGEACCOUNTPW || ''
const storageUri: string = `${process.env.NODE_APP_AZURE_STORAGEURI}`

/* POST upload. */
router.post('/upload', function(req: Request, res: Response, next: Function): void {
  try {
    const { uuid: id } = req.query
    if(!id) throw new Error('Input Error')

    ChildProcess.execSync(`mkdir ${id} && cp -R ${id} static && rmdir ${id}`)

    function uploadCb(): void {
      ChildProcess.execSync(`bash ./azure-deploy-data.sh all ${container} ${storageAccount} ${storageAccountPw} ${id}`)

      const storageFullPath: string = `${storageUri}/${container}/static/${id}/`

      // @ts-ignore
      const blobDataArr: any[] = Array(...req.files)
      .map((file: any) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        encoding: file.encoding,
        accessUrl: storageFullPath.concat(file.filename)
      }))
      const responseData: { storageUri: string, storageFullPath: string, blobData: any[] } = {
        storageUri,
        storageFullPath,
        blobData: [...blobDataArr]
      }

      res.send(new HttpResponse(200, 'success', responseData))
    }
    uploadFiles(req, res, 'blobs', uploadCb)
  } catch(e) {
    if(e.message === 'Input Error') {
      res.send(new HttpResponse(400, e.message))
    } else {
      res.send(new HttpResponse(500, e.message))
    }
  }
})

/* GET server health. */
router.get('/health', function(req: Request, res: Response, next: Function): void {
  res.send(new HttpResponse(200, 'success'))
})

export default router
