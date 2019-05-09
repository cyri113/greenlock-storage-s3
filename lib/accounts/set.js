const AWS = require("aws-sdk");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const pathHelper = require("../pathHelper");
const fileNames = require("../fileNames");

module.exports.set = (opts, options) => {
    console.log("accounts.set");
};