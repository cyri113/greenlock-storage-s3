require('dotenv').config();
var path = require('path');

/////////////////////////////////////////////////////
//  Variables that must be passed to the strategy  //
/////////////////////////////////////////////////////

let accessKeyId = process.env.AWS_ACCESS_KEY_ID
secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
bucketName = process.env.AWS_BUCKET_NAME
bucketRegion = process.env.AWS_BUCKET_REGION
endpoint = process.env.LETSENCRYPT_ENDPOINT
configDir = 'acme/'
accountsDir = 'accounts/'

var tester = require('greenlock-store-test');

var store = require('./index').create({
    debug: true
    , accessKeyId: accessKeyId
    , secretAccessKey: secretAccessKey
    , bucketName: bucketName
    , bucketRegion: bucketRegion
    , configDir: configDir
    , endpoint: endpoint
    , accountsDir: accountsDir
});

// All of these tests can pass locally, standalone without any ACME integration.
tester.test(store).then(function () {
    console.info("PASS");
});