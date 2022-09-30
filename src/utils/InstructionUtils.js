import CompilerError from "../CompilerError";
import RegexUtils from "./RegexUtils";
import Instruction from "../Instruction";

export default class InstructionUtils {

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
