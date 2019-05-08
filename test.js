console.log('Testing the strategy.');

require('dotenv').config();

let accessKeyId = process.env.AWS_ACCESS_KEY_ID
    secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    regionName = process.env.AWS_BUCKET_REGION
    bucketName = process.env.AWS_BUCKET_NAME

let tester = require('greenlock-store-test');

let store = require('./index').create({
    accessKeyId: accessKeyId
    , secretAccessKey: secretAccessKey
    , regionName: regionName
    , bucketName: bucketName
    , configDir: 'acme/'
    , accountsDir: 'accounts/'
    , debug: true
});

// All of these tests can pass locally, standalone without any ACME integration.
tester.test(store).then(() => {
  console.info("Test completed successfully.");
}).catch((err) => {
    console.error(err.message);
    throw err;
});