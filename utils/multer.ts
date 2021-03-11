import multer, { MulterError } from 'multer'
import { configurefileFormat } from './file'
import HttpResponse from "../utils/http"
import e from 'express'

// Default Max File Size: 1GB, Upload File Counts: 12
const limitFileSize: string = process.env.NODE_APP_LIMITFILESIZE || '1000000000'
const uploadMaxCount: string = process.env.NODE_APP_UPLOADMAXCOUNT || '12'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { uuid: id } = req.query
    cb(null, `static/${id}`)
  },
  filename: function (req, file, cb) {
    let filename: string = file.fieldname + '-' + Date.now()
    const configuredFilename = configurefileFormat(filename, file.mimetype)
    cb(null, configuredFilename)
  }
})

const multerInstance = multer({
  storage,
  limits: {
    fileSize: parseInt(limitFileSize),
    fields: 0,
    files: parseInt(uploadMaxCount)
  }
})

export function uploadFiles(req: any, res: any, fieldname: string, cb: Function): void {
  multerInstance.array(fieldname)(req, res, (err: any) => {
    if(err instanceof MulterError) {
      res.send(new HttpResponse(400, `Too Many files. Limit: ${uploadMaxCount}`))
    } else if (err) {
      res.send(new HttpResponse(500, 'Unknown Error'))
    } else {
      cb()
    }
  })
}
