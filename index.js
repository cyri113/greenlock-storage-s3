
////////////////////////////
// File names for support //
////////////////////////////

const fileNames = {
    privkey: {
        pem: 'privkey.pem'
        , jwk: 'privkey.jwk'
    }
    , cert: 'cert.pem'
    , chain: 'chain.pem'
    , fullchain: 'fullchain.pem'
    , bundle: 'bundle.pem'
}

///////////////////////////
// Setup the environment //
///////////////////////////

var path = require('path');
var Promise = require('bluebird')

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);

const defaultOptions = {
    accessKeyId: null
    , secretAccessKey: null
    , bucketName: null
    , bucketRegion: null
    , accountsDir: 'accounts/'
    , configDir: 'acme/'
}

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const pathHelper = require('./pathHelper');

module.exports.create = (createOptions) => {

    const options = Object.assign({}, defaultOptions, createOptions);

    if (!options.debug) {
        console = console || {};
        console.log = () => { };
        console.error = () => { };
    }

    AWS.config.update({
        region: options.bucketRegion
        , credentials: new AWS.Credentials({
            accessKeyId: options.accessKeyId
            , secretAccessKey: options.secretAccessKey
        })
    });

    const handlers = {
        certificates: {
            check: (opts) => {

                var id = opts.certificate && opts.certificate.id || opts.subject;
                console.log('certificates.check for', opts.subject);

                var privkeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
                var certPath = pathHelper.certificatesPath(options, id, fileNames.cert);
                var chainPath = pathHelper.certificatesPath(options, id, fileNames.chain);

                return Promise.all([
                    s3.getObject({ Key: privkeyPath, Bucket: options.bucketName }).promise().then((data) => {
                        console.log('Successfully retrieved certificate privkey.pem');
                        return data.Body.toString();
                    }).catch((err) => {
                        console.error('There was an error retrieving your certificate privkey.pem:', err.message);
                        throw err;
                    }),
                    s3.getObject({ Key: certPath, Bucket: options.bucketName }).promise().then((data) => {
                        console.log('Successfully retrieved certificate cert.pem');
                        return data.Body.toString();
                    }).catch((err) => {
                        console.error('There was an error retrieving your certificate cert.pem:', err.message);
                        throw err;
                    }),
                    s3.getObject({ Key: chainPath, Bucket: options.bucketName }).promise().then((data) => {
                        console.log('Successfully retrieved certificate chain.pem');
                        return data.Body.toString();
                    }).catch((err) => {
                        console.error('There was an error retrieving your certificate chain.pem:', err.message);
                        throw err;
                    })
                ]).then((values) => {
                    // console.log('Promise.all(values):', values);

                    return {
                        privkey: values[0]
                        , cert: values[1]
                        , chain: values[2]
                    }
                }).catch((err) => {
                    console.error('There was an error checking the ceritifcates:', err.message);
                    return null;
                });
            },
            checkKeypair: (opts) => {
                console.log('certificates.checkKeypair for', opts.subject);

                id = opts.certificate.kid || opts.certificate.id || opts.subject;

                pemKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
                jwkKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.jwk);

                return s3.getObject({ Key: pemKeyPath, Bucket: options.bucketName }).promise().then((data) => {
                    console.log('Successfully retrieved certificate PEM keypair.');
                    return {
                        privateKeyPem: data.Body.toString()
                    }
                }).catch((err) => {
                    console.error('There was an error retrieving your certificate PEM keypair:', err.message);
                    return null
                });

            },
            setKeypair: (opts) => {
                id = opts.certificate.kid || opts.certificate.id || opts.subject;
                console.log('certificates.setKeypair for', id);

                pemKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.pem);
                jwkKeyPath = pathHelper.certificatesPath(options, id, fileNames.privkey.jwk);

                return s3.putObject({ Key: pemKeyPath, Body: opts.keypair.privateKeyPem, Bucket: options.bucketName }).promise().then((data) => {
                    console.log('Successfully set the PEM privateKey.');
                    return null;
                }).catch((err) => {
                    console.error('There was an error setting your PEM privateKey:', err.message);
                    throw err;
                });
            },
            set: (opts) => {
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
        },
        accounts: {
            check: (opts) => {
                console.log("accounts.check", opts.account.id);
                // console.log(opts);
            },
            checkKeypair: (opts) => {
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

            },
            setKeypair: (opts) => {
                console.log('accounts.setKeypair for', opts.account);

                var id = opts.account.id || opts.email || 'single-user';
                key = pathHelper.accountsPath(options, id)

                var body = JSON.stringify({
                    privateKeyPem: opts.keypair.privateKeyPem // string PEM
                    , privateKeyJwk: opts.keypair.privateKeyJwk // object JWK
                });

                return s3.putObject({ Key: key, Body: body, Bucket: options.bucketName }).promise().then((data) => {
                    console.log('Successfully created account keypair.');
                    return null;
                }).catch((err) => {
                    console.error('There was an error creating account keypair:', err.message);
                    return null;
                });

            },
            set: (opts) => {
                console.log("accounts.set");
            }
        }
    }

    return handlers;

}