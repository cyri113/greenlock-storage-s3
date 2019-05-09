var path = require("path");
var Promise = require("bluebird");

const defaultOptions = {
    accessKeyId: null
    , secretAccessKey: null
    , bucketName: null
    , bucketRegion: null
    , accountsDir: "accounts/"
    , configDir: "acme/"
};

const pathHelper = require("./lib/pathHelper");
const fileNames = require("./lib/fileNames");

module.exports.create = (createOptions) => {

    const options = Object.assign({}, defaultOptions, createOptions);

    require('./lib/debug')(options.debug);
    require('./lib/aws')(options);

    const handlers = {
        certificates: require("./lib/certificates")(options)
        , accounts: require("./lib/accounts")(options)
    };

    return handlers;

};