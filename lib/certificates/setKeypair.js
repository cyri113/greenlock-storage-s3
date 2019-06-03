const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.setKeypair = (opts, options) => {
    let id = (opts.certificate && (opts.certificate.kid || opts.certificate.id)) || opts.subject;
    console.log("certificates.setKeypair for", id);

    let pemKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
    // let jwkKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.jwk);

    return s3.putObject({ Key: pemKeyPath, Body: opts.keypair.privateKeyPem, Bucket: options.bucketName }).promise().then((data) => {
        console.log("Successfully set the PEM privateKey.");
        return null;
    }).catch((err) => {
        console.error("There was an error setting your PEM privateKey:", err.message);
        throw err;
    });
};