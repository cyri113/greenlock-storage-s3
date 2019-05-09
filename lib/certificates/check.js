const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.check = (opts, options, s3) => {
    var id = opts.certificate && opts.certificate.id || opts.subject;
    console.log("certificates.check for", opts.subject);

    let paths = [
        pathHelper.certificatesPath(options, id, fileNames.privkey.pem)
        , pathHelper.certificatesPath(options, id, fileNames.cert)
        , pathHelper.certificatesPath(options, id, fileNames.chain)
    ]

    var promises = [];

    for (let i = 0; i < paths.length; i++) {
        const key = paths[i];
        const promise = s3.getObject({ Key: key, Bucket: options.bucketName }).promise().then((data) => {
            console.log("Successfully retrieved certificate", key);
            return data.Body.toString();
        }).catch((err) => {
            console.error("There was an error retrieving your certificate", key);
            throw err;
        })
        promises.push(promise);
    }

    return Promise.all(promises).then((values) => {
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