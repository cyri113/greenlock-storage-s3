module.exports = (options) => {

    const handlers = {
        check: (opts) => {
            return require("./certificates/check").check(opts, options);
        },
        checkKeypair: (opts) => {
            return require("./certificates/checkKeypair").checkKeypair(opts, options);
        },
        setKeypair: (opts) => {
            return require("./certificates/setKeypair").setKeypair(opts, options);
        },
        set: (opts) => {
            return require("./certificates/set").set(opts, options);
        }
    };

    return handlers;
};