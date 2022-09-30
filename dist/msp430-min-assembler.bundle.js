(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["msp430-min-assembler"] = factory();
	else
		root["msp430-min-assembler"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const RegexUtils = __webpack_require__(1);
const InstructionUtils = __webpack_require__(2);
const CompilerError = __webpack_require__(3);

class MSP430Assembler {

    parseToLines(str) {

        if (!str) {
            throw new Error("String should not be undefined");
        }

        return str
            .trim()
            .split("\n")
            .map(e => e.trim())
            .map((el, i) => [i, el])
            .map(e => [e[0], e[1].replace(/;(.*)/g, "")])
            .map(e => [e[0], e[1].trim()])
            .filter(el => el[1].length !== 0);
    }

    sintaxAnalysis(line) {

        if (line[1].mnemonic === "MOV") {

            const op = line[1].operands;

            if (RegexUtils.isAddress(op[0]) && RegexUtils.isAddress(op[1])) {
                throw new Error(`There is a error on line ${line[0]} ${line[1]}. You may not move inside memory`);
            }
        }
    }

    findNextInstructions(instructions, startIndex) {

        for (let i = startIndex; i < instructions.length; i++) {

            const instruction = instructions[i];

            if (instruction[1].mnemonic === "LABEL") {
                continue;
            }

            return instruction[0];
        }

        throw new CompilerError("labels", -1, `Label ${instructions[startIndex]} is not associated to an instruction`);
    }

    runLexicalAnalysis(lines) {

        let errors = [];
        let instructions = [];

        for (const line of lines) {
            try {
                instructions.push(InstructionUtils.getInstruction(line));
            } catch (error) {
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            throw errors;
        }

        return instructions;
    }

    runSyntaticAnalysis(instructions) {

        let errors = [];

        for (const instruction of instructions) {
            try {
                this.sintaxAnalysis(instruction);
            } catch (error) {
                errors.push(new CompilerError("syntax", instruction[0], error.message));
            }
        }

        if (errors.length > 0) {
            throw errors;
        }

        return instructions;
    }

    runLinesReArrangement(instructions) {

        let lineNumber = 0;

        for (let i = 0; i < instructions.length; i++) {

            let instruction = instructions[i];

            if (instruction[1].mnemonic === "LABEL") {
                instruction[0] = -1;
            } else {
                instruction[0] = lineNumber++;
            }
        }

        return instructions;
    }

    runLabelMaps(instructions) {

        let labels = {};
        let errors = [];

        for (let i = 0; i < instructions.length; i++) {

            const instruction = instructions[i];

            let label = instruction[1].label;

            if (label) {

                if (labels[label]) {
                    errors.push(new CompilerError("labels", instruction[0], `Line ${instruction[0]}: Label '${label}' is duplicated`));
                } else {
                    try {
                        labels[label] = this.findNextInstructions(instructions, i);
                    } catch (error) {
                        errors.push(error);
                    }
                }
            }
        }

        if (!("main" in labels)) {
            errors.push(new CompilerError("labels", 1, "Missing the 'main' label"));
        }

        if (errors.length > 0) {
            throw errors;
        }

        return labels;
    }

    runReplaceLabels(instructions, labels) {

        let errors = [];

        for (let i = 0; i < instructions.length; i++) {

            const instruction = instructions[i];

            if (["JN", "JZ", "JMP"].includes(instruction[1].mnemonic)) {

                const dest = instruction[1].operands[0];

                if (dest in labels) {
                    instruction[1].operands[0] = labels[dest];
                } else {
                    errors.push(new CompilerError("labels", instruction[0], `Line ${instruction}: Label '${dest}' not found`));
                }
            }
        }

        if (errors.length > 0) {
            throw errors;
        }

        return instructions;
    }

    runRemoveAllLabels(instructions) {

        let output = [];

        for (const instruction of instructions) {

            if (instruction[1].mnemonic !== "LABEL") {
                output.push(instruction[1]);
            }
        }

        return output;
    }

    compile(str) {

        let lines = this.parseToLines(str);

        if (lines.length === 0) {
            throw new Error("String should not be empty");
        }

        let instructions = [];
        let errors = [];

        try {

            instructions = this.runLexicalAnalysis(lines);
            instructions = this.runSyntaticAnalysis(instructions);
            instructions = this.runLinesReArrangement(instructions);
            const labels = this.runLabelMaps(instructions);
            instructions = this.runReplaceLabels(instructions, labels);
            instructions = this.runRemoveAllLabels(instructions);

        } catch (errs) {
            errors = errs;
        }

        return {
            instructions: instructions,
            errors: errors
        };
    }
}

module.exports = MSP430Assembler;


/***/ }),
/* 1 */
/***/ ((module) => {

class RegexUtils {

    static ID = "[a-zA-Z]+\\w*";

    static HEX = "0[xX][0-9a-fA-F]+";

    static INT = "[-+]?\\d+";

    static BIN = "0[bB][01]+";

    static REGISTER = "\\R[0-9]+";

    static LABEL = "@ID@:";

    static ADDRESS = "\\[@HEX@\\]";

    static IMMEDIATE = "\\#((@HEX@)|(@BIN@)|(@INT@))";

    static ADD = "(@ID@:)?\\s*(ADD)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static SUB = "(@ID@:)?\\s*(SUB)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static CMP = "(@ID@:)?\\s*(CMP)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static MOV = "(@ID@:)?\\s*(MOV)\\s+((@REGISTER@)|(@IMMEDIATE@)|(@ADDRESS@))\\s*\\,\\s*((@REGISTER@)|(@ADDRESS@))";

    static JMP = "(@ID@:)?\\s*(JMP)\\s+((@ID@)|(@ADDRESS@))";

    static JN = "(@ID@:)?\\s*(JN)\\s+((@ID@)|(@ADDRESS@))";

    static JZ = "(@ID@:)?\\s*(JZ)\\s+((@ID@)|(@ADDRESS@))";

    static test(pattern, str) {

        pattern = this.replaceVariables(pattern);

        return new RegExp(`^${pattern}$`).test(str);
    }

    static match(pattern, str) {

        pattern = this.replaceVariables(pattern);

        return new RegExp(`^${pattern}$`).exec(str);
    }

    static replaceVariables(pattern) {

        // We need to fist replace the composed

        pattern = pattern.replaceAll("@LABEL@", RegexUtils.LABEL);
        pattern = pattern.replaceAll("@ADDRESS@", RegexUtils.ADDRESS);
        pattern = pattern.replaceAll("@IMMEDIATE@", RegexUtils.IMMEDIATE);

        pattern = pattern.replaceAll("@ID@", RegexUtils.ID);
        pattern = pattern.replaceAll("@HEX@", RegexUtils.HEX);
        pattern = pattern.replaceAll("@BIN@", RegexUtils.BIN);
        pattern = pattern.replaceAll("@INT@", RegexUtils.INT);
        pattern = pattern.replaceAll("@REGISTER@", RegexUtils.REGISTER);

        return pattern;
    }

    static isInteger(str) {
        return RegexUtils.test(RegexUtils.INT, str);
    }

    static isAddress(str) {
        return RegexUtils.test(RegexUtils.ADDRESS, str);
    }

    static isImmediate(str) {
        return RegexUtils.test(RegexUtils.IMMEDIATE, str);
    }

    static isRegister(str) {
        return RegexUtils.test(RegexUtils.REGISTER, str);
    }

    static isLabel(str) {
        return RegexUtils.test(RegexUtils.LABEL, str);
    }

    static isJmp(str) {
        return RegexUtils.test(RegexUtils.JMP, str);
    }

    static isJn(str) {
        return RegexUtils.test(RegexUtils.JN, str);
    }

    static isJz(str) {
        return RegexUtils.test(RegexUtils.JZ, str);
    }

    static isAdd(str) {
        return RegexUtils.test(RegexUtils.ADD, str);
    }

    static isSub(str) {
        return RegexUtils.test(RegexUtils.SUB, str);
    }

    static isCmp(str) {
        return RegexUtils.test(RegexUtils.CMP, str);
    }

    static isMov(str) {
        return RegexUtils.test(RegexUtils.MOV, str);
    }
}

module.exports = RegexUtils;


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const CompilerError = __webpack_require__(3);
const RegexUtils = __webpack_require__(1);
const Instruction = __webpack_require__(4);

class InstructionUtils {

    static getInstruction(line) {

        if (RegexUtils.isLabel(line[1])) {

            const p = RegexUtils.match(RegexUtils.LABEL, line[1]);

            return [line[0], new Instruction(p[0], "LABEL")];
        }
        if (RegexUtils.isMov(line[1])) {

            const p = RegexUtils.match(RegexUtils.MOV, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3], p[11]])];
        }
        if (RegexUtils.isAdd(line[1])) {

            const p = RegexUtils.match(RegexUtils.ADD, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3], p[10]])];
        }
        if (RegexUtils.isSub(line[1])) {

            const p = RegexUtils.match(RegexUtils.SUB, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3], p[10]])];
        }
        if (RegexUtils.isCmp(line[1])) {

            const p = RegexUtils.match(RegexUtils.CMP, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3], p[10]])];
        }
        if (RegexUtils.isJmp(line[1])) {

            const p = RegexUtils.match(RegexUtils.JMP, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3]])];
        }
        if (RegexUtils.isJz(line[1])) {

            const p = RegexUtils.match(RegexUtils.JZ, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3]])];
        }
        if (RegexUtils.isJn(line[1])) {

            const p = RegexUtils.match(RegexUtils.JN, line[1]);

            return [line[0], new Instruction(p[1], p[2], [p[3]])];
        }


        throw new CompilerError("lexical", line[0], `Line ${line[0]}: the instruction is invalid`);
    }

    static print(instructions){

        let lines = [];

        for (const instruction of instructions) {
            lines.push(`${instruction[0]} ${instruction[1].toStringWithLabels()}`);
        }

        console.log(lines.join("\n"));
    }
}

module.exports = InstructionUtils;


/***/ }),
/* 3 */
/***/ ((module) => {

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


/***/ }),
/* 4 */
/***/ ((module) => {

class Instruction {

    label;

    mnemonic;

    operands;

    constructor(label, mnemonic, operands = []){

        this.label = label && label.replaceAll(":", "");
        this.mnemonic = mnemonic;
        this.operands = operands;
    }

    toString() {
        return `${this.mnemonic}\t${this.operands.join(",")}`;
    }

    toStringWithLabels() {
        return `${this.label || ""}\t${this.mnemonic} ${this.operands.join(",")}`;
    }
}

module.exports = Instruction;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});