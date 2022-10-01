import Assembler from "../src/Assembler";

test("it should throw exception when undefined", () => {

    expect(() => {
        new Assembler().compile();
    }).toThrow(Error);
});

test("it should throw exception when empty", () => {

    expect(() => {
        new Assembler().compile("   ");
    }).toThrow(Error);
});

test("it should return all errors", () => {

    const result = new Assembler().compile(`
        ;tete
        .test //Error 1
        label1:
            MOV 1, R2 // Error 2
            MOV #0x213, R3
        label2: ADD R2, [0x] //Error 3
        MOV [0x12],[0x14] // Error 4
    `);

    expect(result.errors.length).toBe(4);
});


test("it should return errors if it is moving between memory locations", () => {

    const result = new Assembler().compile(`
        main:
            MOV [0x2], [0x34]
    `);

    expect(result.errors.length).toBe(1);
});

test("it should return errors if 'main' is missing", () => {

    const result = new Assembler().compile(`
        MOV R2, R3
    `);

    expect(result.errors.length).toBe(1);
});

test("it should return errors if labels are duplicated", () => {

    const result = new Assembler().compile(`
        main:
            CMP R2, R3
        label:
            ADD R1, R5
        label:
            SUB R4, R2
    `);

    expect(result.errors.length).toBe(1);
});

test("it should return errors if the label was not found", () => {

    const result = new Assembler().compile(`
        main:
            MOV R2, R3
            JMP label2
        label:
            MOV R4, R2
            JN label
    `);

    expect(result.errors.length).toBe(1);
});

test("it should return  no errors if the labels are correct", () => {

    const result = new Assembler().compile(`
        main:
            JZ label
        label1: MOV R2, R3
            JMP label
        label: MOV R4, R2
            JMP main
    `);

    expect(result.errors.length).toBe(0);
});

test("it should return an error because there is a label not associated to a instruction", () => {

    const result = new Assembler().compile(`
        main:
        label_1:
            MOV #1, R2
        main2:
    `);

    expect(result.errors.length).toBe(1);
});

test("it should replace correctly the labels", () => {

    const result = new Assembler().compile(`
        main:
            MOV #1, R2
        label_1: JMP label_3
            MOV #0x213, R3
        label_2: JN main
        label_3:
            JZ label_1
    `);

    expect(result.errors.length).toBe(0);
});

test("it should return no errors", () => {

    const result = new Assembler().compile(`
        main:
        label_1:
            MOV #1, R2
        label_2: MOV #1, R15
            MOV #0x213, R3
    `);

    expect(result.errors.length).toBe(0);
});
