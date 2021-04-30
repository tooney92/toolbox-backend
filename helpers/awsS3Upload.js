const BUCKET_NAME = "toolzboxx"
const IAM_USER_KEY = process.env.aws_access_key_id
const IAM_USER_SECRET = process.env.aws_secret_access_key

const s3 = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
})

const mimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/pdf',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/html',
    'text/plain',
    'application/rtf'
]

const uploadFile = (params) => {
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                filepath = data.Location
                console.log("hello");
                return resolve(data)
            }
        });
    })
}


let extension = path.extname(files.name)
let filename = uuid() + extension

const params = {
    Bucket: BUCKET_NAME,
    Key: filename, // File name you want to save as in S3
    Body: files.data,
    ContentEncoding: 'base64',
    ContentType: files.mimetype,
    ACL: 'public-read'
};
const result = await uploadFile(params)