const RegexUtils = require("./utils/RegexUtils");
const InstructionUtils = require("./utils/InstructionUtils");
const CompilerError = require("./CompilerError");

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
