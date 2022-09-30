class CompilerError extends Error {

    type;

    lineNumber;

    constructor(type, lineNumber, message){
        super(message);

        this.type = type;
        this.lineNumber = lineNumber;
    }
}

module.exports = CompilerError;
