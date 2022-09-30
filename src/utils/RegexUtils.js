export default class RegexUtils {

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
