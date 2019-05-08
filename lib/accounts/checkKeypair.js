const pathHelper = require('../pathHelper');
const fileNames = require('../fileNames');

module.exports.checkKeypair = (opts, options, s3) => {
    var id = opts.account.id || opts.email || 'single-user';
    console.log('accounts.checkKeypair for', id);

    key = pathHelper.accountsPath(options, id)

    return s3.getObject({ Key: key, Bucket: options.bucketName }).promise().then((data) => {
        console.log('Successfully retrieved account keypair.');
        var keypair = JSON.parse(data.Body.toString());
        return {
            privateKeyPem: keypair.privateKeyPem // string PEM private key
            , privateKeyJwk: keypair.privateKeyJwk // object JWK private key
        };
    }).catch((err) => {
        console.error('There was an error retrieving your account keypair:', err.message);
        return null;
    });
}