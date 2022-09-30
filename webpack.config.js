const path = require("path");

module.exports = {
    mode: "none",
    entry: {
        app: "./src/MSP430Assembler.js",
    },
    output: {
        filename: "msp430-min-assembler.bundle.js",
        library: "msp430-min-assembler",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist")
    },
};
