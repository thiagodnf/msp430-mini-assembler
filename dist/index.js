require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const RegexUtils = __nccwpck_require__(857);

class MSP430Assembler {

    parseToLines(str) {

        return str
            .split("\n")
            .map(e => e.trim())
            .map((el, i) => [i, el])
            .map(e => [e[0], e[1].replace(/;(.*)/g, "")])
            .map(e => [e[0], e[1].trim()])
            .filter(el => el[1].length !== 0);
    }

    isValid(str) {

        if (
            RegexUtils.isLabel(str) ||
            RegexUtils.isAdd(str) ||
            RegexUtils.isSub(str) ||
            RegexUtils.isCmp(str) ||
            RegexUtils.isMov(str) ||
            RegexUtils.isJn(str) ||
            RegexUtils.isJz(str) ||
            RegexUtils.isJmp(str)) {
            return true;
        }

        return false;
    }

    syntaxAnalysis(line) {

        if (!this.isValid(line[1])) {
            throw new Error(`There is a error on line ${line[0]} ${line[1]}`);
        }
    }

    compile(str) {

        if (!str) {
            throw new Error("String should not be undefined");
        }

        str = str.trim();

        let lines = this.parseToLines(str);

        if (lines.length === 0) {
            throw new Error("String should not be empty");
        }

        let errors = [];

        for (const line of lines) {
            try {
                this.syntaxAnalysis(line);
            } catch (error) {
                errors.push({
                    "type": "syntax",
                    "lineNumber": line[0],
                    "message": error.message
                });
            }
        }

        return {
            errors: errors
        };
    }
}

module.exports = MSP430Assembler;


/***/ }),

/***/ 857:
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

    static ADD = "(@ID@:)?\\s*ADD\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static SUB = "(@ID@:)?\\s*SUB\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static CMP = "(@ID@:)?\\s*CMP\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";

    static MOV = "(@ID@:)?\\s*MOV\\s+((@REGISTER@)|(@IMMEDIATE@)|(@ADDRESS@))\\s*\\,\\s*((@REGISTER@)|(@ADDRESS@))";

    static JMP = "(@ID@:)?\\s*JMP\\s+((@ID@)|(@ADDRESS@))";

    static JN = "(@ID@:)?\\s*JN\\s+((@ID@)|(@ADDRESS@))";

    static JZ = "(@ID@:)?\\s*JZ\\s+((@ID@)|(@ADDRESS@))";

    static test(pattern, str) {

        // We need to fist replace the compounded

        pattern = pattern.replaceAll("@LABEL@", RegexUtils.LABEL);
        pattern = pattern.replaceAll("@ADDRESS@", RegexUtils.ADDRESS);
        pattern = pattern.replaceAll("@IMMEDIATE@", RegexUtils.IMMEDIATE);

        pattern = pattern.replaceAll("@ID@", RegexUtils.ID);
        pattern = pattern.replaceAll("@HEX@", RegexUtils.HEX);
        pattern = pattern.replaceAll("@BIN@", RegexUtils.BIN);
        pattern = pattern.replaceAll("@INT@", RegexUtils.INT);
        pattern = pattern.replaceAll("@REGISTER@", RegexUtils.REGISTER);

        return new RegExp(`^${pattern}$`).test(str);
    }

    static isInteger(str) {
        return RegexUtils.test(RegexUtils.INT, str);
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(129);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map