import * as aws from 'aws-sdk'
import readline from '../src'
import path from 'path'

aws.config.loadFromPath(path.resolve(__dirname, '../.aws-credentials.json'))
const s3 = new aws.S3({ apiVersion: '2006-03-01' })
const bucket = 'vbranden'
const key='test.txt'

const reader = (bucket, key) => readline.createInterface({
  input: s3.getObject({Bucket: bucket, Key: key}).createReadStream()
})

const run = async(bucket, key) => {
const testfile = reader(bucket, key)
 await testfile.forEach(line => console.log(`"${line}"`))
}

run(bucket, key)