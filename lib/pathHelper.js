const path = require('path');

tameWild = (wild) => {
    return wild.replace(/\*/g, '_');
}

module.exports = {

    certificatesPath: (options, id, fileName) => {
        var filePath = path.join(options.configDir, 'live', tameWild(id), fileName);
        console.log('filePath:', filePath);
        return filePath;
    },

    accountsPath: (options, id) => {
        var filePath = path.join(options.configDir, options.accountsDir, tameWild(id) + '.json');
        console.log('filePath:', filePath);
        return filePath;
    }

}