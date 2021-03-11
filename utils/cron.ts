import cron from 'cron'
import { execSync } from 'child_process'

const CronJob = cron.CronJob
const cronStr = '0 0 3 * * *'

export const job = new CronJob(cronStr, function() {
  execSync(`rm -r static && mkdir static`)
}, null, true, 'America/Los_Angeles')
