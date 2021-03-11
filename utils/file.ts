export function configurefileFormat(filename: string, mimetype: string): string {
  switch(mimetype) {
    case 'image/png' :
      filename += '.png'
      break
    case 'image/jpeg':
      filename += '.jpg'
      break
    case 'application/pdf':
      filename += '.pdf'
      break
    case 'application/vnd.ms-excel':
    case 'application/msexcel':
    case 'application/x-msexcel':
    case 'application/x-ms-excel':
    case 'application/x-excel':
    case 'application/x-dos_ms_excel':
    case 'application/xls':
    case 'application/x-xls':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      filename += '.xlsx'
      break
    case 'application/msword':
      filename += '.doc'
      break
    case 'application/vnd.openxmlformats-officedocument.wordprocessingm':
      filename += '.docx'
      break
    default:
      break
  }
  return filename
}
