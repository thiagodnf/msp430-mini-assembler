const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        filename: "MSP430Assembler.js",
        libraryTarget: "umd",
        library: {
            name: "MSP430Assembler",
            type: "umd",
        },
        path: path.resolve(__dirname, "dist")
    },
};
