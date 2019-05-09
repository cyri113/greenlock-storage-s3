const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.setKeypair = (opts, options) => {
    console.log("accounts.setKeypair for", opts.account);

    let id = opts.account.id || opts.email || "single-user";
    let key = pathHelper.accountsPath(options, id);

    var body = JSON.stringify({
        privateKeyPem: opts.keypair.privateKeyPem // string PEM
        , privateKeyJwk: opts.keypair.privateKeyJwk // object JWK
    });

    return s3.putObject({ Key: key, Body: body, Bucket: options.bucketName }).promise().then((data) => {
        console.log("Successfully created account keypair.");
        return null;
    }).catch((err) => {
        console.error("There was an error creating account keypair:", err.message);
        return null;
    });
};