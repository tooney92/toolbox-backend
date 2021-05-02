const BUCKET_NAME = "toolzboxx"
const IAM_USER_KEY = process.env.aws_access_key_id
const IAM_USER_SECRET = process.env.aws_secret_access_key
const AWS = require('aws-sdk');
const path = require('path')
const { uuid } = require('uuidv4')

const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
})

let status = { successful: false, data: null}

const uploadFile = (params) => {
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                filepath = data.Location
                console.log("hello");
                status.successful = true
                status.data  = data
                return resolve(status)
            }
        });
    })
}

module.exports.s3Upload = async (file) => {
    try {

        let extension = path.extname(file.name)
        let filename = uuid() + extension

        const params = {
            Bucket: BUCKET_NAME,
            Key: filename, // File name you want to save as in S3
            Body: file.data,
            ContentEncoding: 'base64',
            ContentType: file.mimetype,
            ACL: 'public-read'
        };
        
        const result = await uploadFile(params)
        return result

    } catch (error) {
        console.log(error);
    }
}







