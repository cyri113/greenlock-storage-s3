const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.check = (opts, options, s3) => {
    var id = opts.certificate && opts.certificate.id || opts.subject;
    console.log("certificates.check for", opts.subject);

    var privkeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
    var certPath = pathHelper.certificatesPath(options, id, fileNames.cert);
    var chainPath = pathHelper.certificatesPath(options, id, fileNames.chain);

    return Promise.all([
        s3.getObject({ Key: privkeyPath, Bucket: options.bucketName }).promise().then((data) => {
            console.log("Successfully retrieved certificate privkey.pem");
            return data.Body.toString();
        }).catch((err) => {
            console.error("There was an error retrieving your certificate privkey.pem:", err.message);
            throw err;
        }),
        s3.getObject({ Key: certPath, Bucket: options.bucketName }).promise().then((data) => {
            console.log("Successfully retrieved certificate cert.pem");
            return data.Body.toString();
        }).catch((err) => {
            console.error("There was an error retrieving your certificate cert.pem:", err.message);
            throw err;
        }),
        s3.getObject({ Key: chainPath, Bucket: options.bucketName }).promise().then((data) => {
            console.log("Successfully retrieved certificate chain.pem");
            return data.Body.toString();
        }).catch((err) => {
            console.error("There was an error retrieving your certificate chain.pem:", err.message);
            throw err;
        })
    ]).then((values) => {
        return {
            privkey: values[0]
            , cert: values[1]
            , chain: values[2]
        };
    }).catch((err) => {
        console.error("There was an error checking the ceritifcates:", err.message);
        return null;
    });
};