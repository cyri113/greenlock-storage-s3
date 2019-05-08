var path = require("path");
var Promise = require("bluebird");

const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(Promise);

const defaultOptions = {
    accessKeyId: null
    , secretAccessKey: null
    , bucketName: null
    , bucketRegion: null
    , accountsDir: "accounts/"
    , configDir: "acme/"
};

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const pathHelper = require("./lib/pathHelper");
const fileNames = require("./lib/fileNames");

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
                return require("./lib/certificates/check").check(opts, options, s3);
            },
            checkKeypair: (opts) => {
                return require("./lib/certificates/checkKeypair").checkKeypair(opts, options, s3);
            },
            setKeypair: (opts) => {
                return require("./lib/certificates/setKeypair").setKeypair(opts, options, s3);
            },
            set: (opts) => {
                return require("./lib/certificates/set").set(opts, options, s3);
            }
        },
        accounts: {
            check: (opts) => {
                return require("./lib/accounts/check").check(opts, options, s3);
            },
            checkKeypair: (opts) => {
                return require("./lib/accounts/checkKeypair").checkKeypair(opts, options, s3);
            },
            setKeypair: (opts) => {
                return require("./lib/accounts/setKeypair").setKeypair(opts, options, s3);
            },
            set: (opts) => {
                return require("./lib/accounts/set").set(opts, options, s3);
            }
        }
    }

    return handlers;

};