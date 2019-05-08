[![CircleCI](https://circleci.com/gh/cderche/greenlock-storage-s3.svg?style=svg)](https://circleci.com/gh/cderche/greenlock-storage-s3)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0923e01ff76e403abab4637a45149155)](https://www.codacy.com/app/c.derche/greenlock-storage-s3?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cderche/greenlock-storage-s3&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/cderche/greenlock-storage-s3/badge.svg)](https://snyk.io/test/github/cderche/greenlock-storage-s3)

# greenlock-storage-s3
S3 backed storage strategy for greenlock-express.js (and greenlock.js)

## Requirements

You will need a s3 bucket and the corresponding credentials.

## Integration

### greenlock-express.js

```javascript

let store = require('greenlock-storage-s3').create({
    accessKeyId: accessKeyId                // Your accessKeyId
    , secretAccessKey: secretAccessKey      // Your secretAccessKey
    , regionName: regionName                // Your regionName
    , bucketName: bucketName                // Your bucketName
    , configDir: 'acme/'                    // Recommended
    , accountsDir: 'accounts/'              // Recommended
    , debug: true                           // Debug
});

var Greenlock = require("greenlock-express");

var greenlock = Greenlock.create({
    // Other options
    , store: store
});

// Continue your greenlock setup

```

## Testing

The strategy is tested against the greenlock-store-test [https://git.coolaj86.com/coolaj86/greenlock-store-test.js]

To run the tests yourself, create a `.env` file with the following

```
// .env file
AWS_ACCESS_KEY_ID=abc           // Your accessKeyId
AWS_SECRET_ACCESS_KEY=abc       // Your secretAccessKey
AWS_BUCKET_REGION=abc           // Your regionName
AWS_BUCKET_NAME=abc             // Your bucketName
```

Run the following command: `npm run clean && npm run test && npm run clean`

## License

ISC
