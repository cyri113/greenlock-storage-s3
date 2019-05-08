# greenlock-storage-s3
S3 backed storage strategy for greenlock-express.js (and greenlock.js)

### Requirements

- AWS Account
- S3 Bucket
- Access to S3 Bucket via the AWS CLI (accessKeyId, secretAccessKey)

For more information see https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-access-control.html

### Get started

Please look at the file `test.js` for an example.

#### Example using greenlock.

```nodejs

var store = require('greenlock-storage-s3').create({
    debug: false
    , accessKeyId: // fill-in
    , secretAccessKey: // fill-in
    , bucketName: // fill-in
    , bucketRegion: // fill-in
    , configDir: 'acme/' // recommended
    , accountDir: 'accounts/' // recommended
})

var Greenlock = require("greenlock");

var greenlock = Greenlock.create({
  // Other options
  , store: store
  // Other options
});
```

### License

ISC