const pathHelper = require('../pathHelper');
const fileNames = require('../fileNames');

module.exports.set = (opts, options, s3) => {
    console.log('certificates.set for ', opts.subject);

    var pems = {
        cert: opts.pems.cert
        , chain: opts.pems.chain
        , privkey: opts.pems.privkey
    }

    var certPath = pathHelper.certificatesPath(options, opts.subject, fileNames.cert);
    var chainPath = pathHelper.certificatesPath(options, opts.subject, fileNames.chain);
    var fullchainPath = pathHelper.certificatesPath(options, opts.subject, fileNames.fullchain);
    var bundlePath = pathHelper.certificatesPath(options, opts.subject, fileNames.bundle);

    var fullchainPem = [pems.cert, pems.chain].join('\n'); // for Apache, Nginx, etc
    var bundlePem = [pems.privkey, pems.cert, pems.chain].join('\n'); // for HAProxy

    return Promise.all([
        s3.putObject({ Key: certPath, Body: pems.cert, Bucket: options.bucketName }).promise().then((data) => {
            console.log('Successfully set', certPath);
        }).catch((err) => {
            console.error('There was an error setting cert.pem:', err.message);
            throw err;
        }),
        s3.putObject({ Key: chainPath, Body: pems.chain, Bucket: options.bucketName }).promise().then((data) => {
            console.log('Successfully set', chainPath);
        }).catch((err) => {
            console.error('There was an error setting chain.pem:', err.message);
            throw err;
        }),
        s3.putObject({ Key: fullchainPath, Body: fullchainPem, Bucket: options.bucketName }).promise().then((data) => {
            console.log('Successfully set', fullchainPath);
        }).catch((err) => {
            console.error('There was an error setting fullchain.pem:', err.message);
            throw err;
        }),
        s3.putObject({ Key: bundlePath, Body: bundlePem, Bucket: options.bucketName }).promise().then((data) => {
            console.log('Successfully set', bundlePath);
        }).catch((err) => {
            console.error('There was an error setting bundle.pem:', err.message);
            throw err;
        })
    ]).then((values) => {
        return null;
    }).catch((err) => {
        console.error('There was an error setting the certificates:', err.message);
        throw err;
    });
}