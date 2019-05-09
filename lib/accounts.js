module.exports = (options) => {

    const handlers = {
        check: (opts) => {
            return require("./accounts/check").check(opts, options);
        },
        checkKeypair: (opts) => {
            return require("./accounts/checkKeypair").checkKeypair(opts, options);
        },
        setKeypair: (opts) => {
            return require("./accounts/setKeypair").setKeypair(opts, options);
        },
        set: (opts) => {
            return require("./accounts/set").set(opts, options);
        }
    };
    return handlers;
};