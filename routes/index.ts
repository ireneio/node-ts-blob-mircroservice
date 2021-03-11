import express, { Router, Request, Response } from "express"
import HttpResponse from "../utils/http"
import * as ChildProcess from 'child_process'
import multer, { MulterError } from 'multer'

const router: Router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { uuid: id } = req.query
    cb(null, `static/${id}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})

const upload = multer({ storage })

/* POST upload. */
router.post('/upload', function(req: Request, res: Response, next: Function): void {
  try {
    const { uuid: id } = req.query
    if(!id) throw new Error('input error')
    const container: string = process.env.NODE_APP_AZURE_CONTAINER || ''
    const storageAccount: string = process.env.NODE_APP_AZURE_STORAGEACCOUNT || ''
    const storageAccountPw: string = process.env.NODE_APP_AZURE_STORAGEACCOUNTPW || ''
    const storageUri: string = `${process.env.NODE_APP_AZURE_STORAGEURI}`
    const storageFullPath: string = `${process.env.NODE_APP_AZURE_STORAGEURI}/${container}/static/${id}/`
    const uploadMaxCount: string = process.env.NODE_APP_UPLOADMAXCOUNT || '12'

    ChildProcess.execSync(`mkdir ${id} && cp -R ${id} static && rmdir ${id}`)

    upload.array('blobs', Number(uploadMaxCount))(req, res, (err: any) => {
      if(err instanceof MulterError) {
        throw new Error('multer error')
      } else if (err) {
        throw new Error('unknown error')
      }

      ChildProcess.execSync(`bash ./azure-deploy-data.sh all ${container} ${storageAccount} ${storageAccountPw} ${id}`)

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
    })
  } catch(e) {
    console.log('Upload Error: ', e.message)
    res.send(new HttpResponse(400, e.message))
  }
})

/* GET server health. */
router.get('/health', function(req: Request, res: Response, next: Function): void {
  res.send(new HttpResponse(200, 'success'))
})

export default router
