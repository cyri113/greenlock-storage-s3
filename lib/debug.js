module.exports = (debug) => {
    if (!debug) {
        console = console || {};
        console.log = () => { };
        console.error = () => { };
    }
}