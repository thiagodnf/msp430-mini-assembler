export default class Instruction {

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
