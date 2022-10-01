(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MSP430Assembler"] = factory();
	else
		root["MSP430Assembler"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Assembler)
/* harmony export */ });
/* harmony import */ var _utils_RegexUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _utils_InstructionUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _CompilerError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




class Assembler {

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

            if (_utils_RegexUtils__WEBPACK_IMPORTED_MODULE_0__["default"].isAddress(op[0]) && _utils_RegexUtils__WEBPACK_IMPORTED_MODULE_0__["default"].isAddress(op[1])) {
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

        throw new _CompilerError__WEBPACK_IMPORTED_MODULE_2__["default"]("labels", -1, `Label ${instructions[startIndex]} is not associated to an instruction`);
    }

    runLexicalAnalysis(lines) {

        let errors = [];
        let instructions = [];

        for (const line of lines) {
            try {
                instructions.push(_utils_InstructionUtils__WEBPACK_IMPORTED_MODULE_1__["default"].getInstruction(line));
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
                errors.push(new _CompilerError__WEBPACK_IMPORTED_MODULE_2__["default"]("syntax", instruction[0], error.message));
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
                    errors.push(new _CompilerError__WEBPACK_IMPORTED_MODULE_2__["default"]("labels", instruction[0], `Line ${instruction[0]}: Label '${label}' is duplicated`));
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
            errors.push(new _CompilerError__WEBPACK_IMPORTED_MODULE_2__["default"]("labels", 1, "Missing the 'main' label"));
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
                    errors.push(new _CompilerError__WEBPACK_IMPORTED_MODULE_2__["default"]("labels", instruction[0], `Line ${instruction}: Label '${dest}' not found`));
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


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RegexUtils)
/* harmony export */ });
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


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InstructionUtils)
/* harmony export */ });
/* harmony import */ var _CompilerError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _RegexUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _Instruction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);




class InstructionUtils {

    static getInstruction(line) {

        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isLabel(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].LABEL, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[0], "LABEL")];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isMov(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].MOV, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3], p[11]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isAdd(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].ADD, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3], p[10]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isSub(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].SUB, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3], p[10]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isCmp(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].CMP, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3], p[10]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isJmp(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].JMP, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isJz(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].JZ, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3]])];
        }
        if (_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].isJn(line[1])) {

            const p = _RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].match(_RegexUtils__WEBPACK_IMPORTED_MODULE_1__["default"].JN, line[1]);

            return [line[0], new _Instruction__WEBPACK_IMPORTED_MODULE_2__["default"](p[1], p[2], [p[3]])];
        }


        throw new _CompilerError__WEBPACK_IMPORTED_MODULE_0__["default"]("lexical", line[0], `Line ${line[0]}: the instruction is invalid`);
    }

    static print(instructions){

        let lines = [];

        for (const instruction of instructions) {
            lines.push(`${instruction[0]} ${instruction[1].toStringWithLabels()}`);
        }

        console.log(lines.join("\n"));
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CompilerError)
/* harmony export */ });
class CompilerError extends Error {

    type;

    lineNumber;

    constructor(type, lineNumber, message){
        super(message);

        this.type = type;
        this.lineNumber = lineNumber;
    }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Instruction)
/* harmony export */ });
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Assembler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({Assembler: _Assembler__WEBPACK_IMPORTED_MODULE_0__["default"]});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});