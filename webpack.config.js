const path = require("path");

module.exports = {
    mode: "none",
    entry: {
        app: "./src/index.js",
    },
    output: {
        filename: "MSP430Assembler.js",
        library: "MSP430Assembler",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
};
