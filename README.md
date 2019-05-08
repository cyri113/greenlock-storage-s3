[![CircleCI](https://circleci.com/gh/cderche/greenlock-storage-s3.svg?style=svg)](https://circleci.com/gh/cderche/greenlock-storage-s3)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5698848a7ffc4781a46f7094513cb1d5)](https://www.codacy.com/app/c.derche/greenlock-storage-s3?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cderche/greenlock-storage-s3&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/cderche/greenlock-storage-s3/badge.svg)](https://snyk.io/test/github/cderche/greenlock-storage-s3)
[![BCH compliance](https://bettercodehub.com/edge/badge/cderche/greenlock-storage-s3?branch=master)](https://bettercodehub.com/)
!["Lifetime Downloads"](https://img.shields.io/npm/dt/greenlock-storage-s3.svg "Lifetime Download Count can't be shown")
!["Monthly Downloads"](https://img.shields.io/npm/dm/greenlock-storage-s3.svg "Monthly Download Count can't be shown")
!["Weekly Downloads"](https://img.shields.io/npm/dw/greenlock-storage-s3.svg "Weekly Download Count can't be shown")

# greenlock-storage-s3
S3 backed storage strategy for greenlock-express.js (and greenlock.js)

## Requirements

You will need a s3 bucket and the corresponding credentials.

## Integration

### greenlock-express.js

```javascript

let store = require('greenlock-storage-s3').create({
    accessKeyId: accessKeyId                // Replace with your accessKeyId
    , secretAccessKey: secretAccessKey      // Replace with your secretAccessKey
    , regionName: regionName                // Replace with your regionName
    , bucketName: bucketName                // Replace with your bucketName
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
AWS_ACCESS_KEY_ID=abc           // Replace with your accessKeyId
AWS_SECRET_ACCESS_KEY=abc       // Replace with your secretAccessKey
AWS_BUCKET_REGION=abc           // Replace with your regionName
AWS_BUCKET_NAME=abc             // Replace with your bucketName
```

Run the following command: 
```console
$ npm run clean && npm run test && npm run clean
```

## License

ISC
