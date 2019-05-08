const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.checkKeypair = (opts, options, s3) => {
    console.log("certificates.checkKeypair for", opts.subject);

    let id = opts.certificate.kid || opts.certificate.id || opts.subject;

    let pemKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
    let jwkKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.jwk);

    return s3.getObject({ Key: pemKeyPath, Bucket: options.bucketName }).promise().then((data) => {
        console.log("Successfully retrieved certificate PEM keypair.");
        return {
            privateKeyPem: data.Body.toString()
        }
    }).catch((err) => {
        console.error("There was an error retrieving your certificate PEM keypair:", err.message);
        return null;
    });
};