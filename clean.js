console.log('Cleaning the project.');
console.log('Cleaning the project.');

require('dotenv').config();

var accessKeyId = process.env.AWS_ACCESS_KEY_ID
    secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    regionName = process.env.AWS_BUCKET_REGION
    bucketName = process.env.AWS_BUCKET_NAME

var AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);
AWS.config.update({
    region: regionName
    , credentials: new AWS.Credentials({
        accessKeyId: accessKeyId
        , secretAccessKey: secretAccessKey
    })
});

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

s3.listObjects({ Bucket: bucketName }).promise().then(function(data){

    if (data.Contents.length <= 0) {
        console.log('Your bucket is already empty :)');
        return
    }

    var objectKeys = [];

    for(let i = 0; i < data.Contents.length; i++){
        objectKeys.push({
            Key: data.Contents[i].Key
        })
     }
    
    s3.deleteObjects({ Delete: { Objects: objectKeys }, Bucket: bucketName }).promise().then(function (data) {
        console.log('Your bucket was emptied :)');
    }).catch( function(err) {
        console.error(err.message);
        throw err;
    });
}).catch( function(err) {
    console.error(err.message);
    throw err;
});