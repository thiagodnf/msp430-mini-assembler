import RegexUtils from "../../src/utils/RegexUtils";

test("string is integer", () => {

    // Valid Numbers

    expect(RegexUtils.isInteger("0")).toBe(true);
    expect(RegexUtils.isInteger("1")).toBe(true);
    expect(RegexUtils.isInteger("12")).toBe(true);
    expect(RegexUtils.isInteger("123")).toBe(true);
    expect(RegexUtils.isInteger("0001")).toBe(true);
    expect(RegexUtils.isInteger("-1")).toBe(true);
    expect(RegexUtils.isInteger("-12")).toBe(true);
    expect(RegexUtils.isInteger("-123")).toBe(true);
    expect(RegexUtils.isInteger("-0001")).toBe(true);
    expect(RegexUtils.isInteger("+1")).toBe(true);
    expect(RegexUtils.isInteger("+12")).toBe(true);
    expect(RegexUtils.isInteger("+123")).toBe(true);
    expect(RegexUtils.isInteger("+0001")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isInteger(undefined)).toBe(false);
    expect(RegexUtils.isInteger(null)).toBe(false);
    expect(RegexUtils.isInteger("")).toBe(false);
    expect(RegexUtils.isInteger("a")).toBe(false);
    expect(RegexUtils.isInteger("1a")).toBe(false);
    expect(RegexUtils.isInteger("a1")).toBe(false);
    expect(RegexUtils.isInteger("-a")).toBe(false);
    expect(RegexUtils.isInteger("-1a")).toBe(false);
    expect(RegexUtils.isInteger("-a1")).toBe(false);

    expect(RegexUtils.isInteger(" a")).toBe(false);
    expect(RegexUtils.isInteger("#a")).toBe(false);
    expect(RegexUtils.isInteger("--1")).toBe(false);
    expect(RegexUtils.isInteger("func 123 bar")).toBe(false);

});

test("string is label", () => {

    // Valid Numbers

    expect(RegexUtils.isLabel("a:")).toBe(true);
    expect(RegexUtils.isLabel("a0123:")).toBe(true);
    expect(RegexUtils.isLabel("a012_3:")).toBe(true);
    expect(RegexUtils.isLabel("a__0123:")).toBe(true);
    expect(RegexUtils.isLabel("a0__123:")).toBe(true);
    expect(RegexUtils.isLabel("a:")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isLabel(undefined)).toBe(false);
    expect(RegexUtils.isLabel(null)).toBe(false);
    expect(RegexUtils.isLabel("")).toBe(false);
    expect(RegexUtils.isLabel("0aaaa:")).toBe(false);
    expect(RegexUtils.isLabel("a")).toBe(false);
    expect(RegexUtils.isLabel("_")).toBe(false);
    expect(RegexUtils.isLabel("_:")).toBe(false);
    expect(RegexUtils.isLabel("_b:")).toBe(false);
    expect(RegexUtils.isLabel("_b")).toBe(false);
    expect(RegexUtils.isLabel("a")).toBe(false);


});

test("string is JMP", () => {

    // Valid Numbers

    expect(RegexUtils.isJmp("JMP [0x123]")).toBe(true);
    expect(RegexUtils.isJmp("JMP    [0xFFF]")).toBe(true);
    expect(RegexUtils.isJmp("JMP main")).toBe(true);
    expect(RegexUtils.isJmp("JMP    main")).toBe(true);
    expect(RegexUtils.isJmp("main: JMP [0x123]")).toBe(true);
    expect(RegexUtils.isJmp("main:    JMP    [0xFFF]")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isJmp(undefined)).toBe(false);
    expect(RegexUtils.isJmp(null)).toBe(false);
    expect(RegexUtils.isJmp("")).toBe(false);
    expect(RegexUtils.isJmp("JM 0x123")).toBe(false);
    expect(RegexUtils.isJmp("JMP")).toBe(false);
    expect(RegexUtils.isJmp("JMP 0123")).toBe(false);
    expect(RegexUtils.isJmp("JMP0123")).toBe(false);
    expect(RegexUtils.isJmp("JMP 123")).toBe(false);
    expect(RegexUtils.isJmp("main:")).toBe(false);
    expect(RegexUtils.isJmp("main: main: JMP 123")).toBe(false);
});

test("string is JN", () => {

    // Valid Numbers

    expect(RegexUtils.isJn("JN [0x123]")).toBe(true);
    expect(RegexUtils.isJn("JN    [0xFFF]")).toBe(true);
    expect(RegexUtils.isJn("JN main")).toBe(true);
    expect(RegexUtils.isJn("JN    main")).toBe(true);
    expect(RegexUtils.isJn("main: JN [0x123]")).toBe(true);
    expect(RegexUtils.isJn("main:    JN    [0xFFF]")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isJn(undefined)).toBe(false);
    expect(RegexUtils.isJn(null)).toBe(false);
    expect(RegexUtils.isJn("")).toBe(false);
    expect(RegexUtils.isJn("JM 0x123")).toBe(false);
    expect(RegexUtils.isJn("JN")).toBe(false);
    expect(RegexUtils.isJn("JN 0123")).toBe(false);
    expect(RegexUtils.isJn("JN0123")).toBe(false);
    expect(RegexUtils.isJn("JN 123")).toBe(false);
    expect(RegexUtils.isJn("main:")).toBe(false);
    expect(RegexUtils.isJn("main: main: JN 123")).toBe(false);
});

test("string is JZ", () => {

    // Valid Numbers

    expect(RegexUtils.isJz("JZ [0x123]")).toBe(true);
    expect(RegexUtils.isJz("JZ    [0xFFF]")).toBe(true);
    expect(RegexUtils.isJz("JZ main")).toBe(true);
    expect(RegexUtils.isJz("JZ    main")).toBe(true);
    expect(RegexUtils.isJz("main: JZ [0x123]")).toBe(true);
    expect(RegexUtils.isJz("main:    JZ    [0xFFF]")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isJz(undefined)).toBe(false);
    expect(RegexUtils.isJz(null)).toBe(false);
    expect(RegexUtils.isJz("")).toBe(false);
    expect(RegexUtils.isJz("JM 0x123")).toBe(false);
    expect(RegexUtils.isJz("JZ")).toBe(false);
    expect(RegexUtils.isJz("JZ 0123")).toBe(false);
    expect(RegexUtils.isJz("JZ0123")).toBe(false);
    expect(RegexUtils.isJz("JZ 123")).toBe(false);
    expect(RegexUtils.isJz("main:")).toBe(false);
    expect(RegexUtils.isJz("main: main: JZ 123")).toBe(false);
});

test("string is immediate", () => {

    // Valid Numbers

    expect(RegexUtils.isImmediate("#0x123")).toBe(true);
    expect(RegexUtils.isImmediate("#0b1111")).toBe(true);
    expect(RegexUtils.isImmediate("#1")).toBe(true);
    expect(RegexUtils.isImmediate("#-1")).toBe(true);
    expect(RegexUtils.isImmediate("#0")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isImmediate(undefined)).toBe(false);
    expect(RegexUtils.isImmediate(null)).toBe(false);
    expect(RegexUtils.isImmediate("")).toBe(false);
    expect(RegexUtils.isImmediate("#0hff")).toBe(false);
    expect(RegexUtils.isImmediate("#")).toBe(false);
    expect(RegexUtils.isImmediate("#0x")).toBe(false);
    expect(RegexUtils.isImmediate("#0b")).toBe(false);
    expect(RegexUtils.isImmediate("0b1111")).toBe(false);
    expect(RegexUtils.isImmediate("0x123f")).toBe(false);

});

test("string is register", () => {

    // Valid Numbers

    expect(RegexUtils.isRegister("R1")).toBe(true);
    expect(RegexUtils.isRegister("R0")).toBe(true);
    expect(RegexUtils.isRegister("R12")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isRegister(undefined)).toBe(false);
    expect(RegexUtils.isRegister(null)).toBe(false);
    expect(RegexUtils.isRegister("")).toBe(false);
    expect(RegexUtils.isRegister("R")).toBe(false);
    expect(RegexUtils.isRegister("R-1")).toBe(false);
    expect(RegexUtils.isRegister("12")).toBe(false);
    expect(RegexUtils.isRegister("RF")).toBe(false);
});

test("string is ADD", () => {

    // Valid Numbers

    expect(RegexUtils.isAdd("ADD R1, R2")).toBe(true);
    expect(RegexUtils.isAdd("ADD #1, R2")).toBe(true);
    expect(RegexUtils.isAdd("ADD #0x123F, R2")).toBe(true);
    expect(RegexUtils.isAdd("ADD #0b111, R2")).toBe(true);
    expect(RegexUtils.isAdd("ADD #-1, R2")).toBe(true);
    expect(RegexUtils.isAdd("ADD #-1   ,    R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD R1, R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD #1, R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD #0x123F, R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD #0b111, R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD #-1, R2")).toBe(true);
    expect(RegexUtils.isAdd("main: ADD #-1   ,    R2")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isAdd(undefined)).toBe(false);
    expect(RegexUtils.isAdd(null)).toBe(false);
    expect(RegexUtils.isAdd("")).toBe(false);
    expect(RegexUtils.isAdd("ADD 0x123")).toBe(false);
    expect(RegexUtils.isAdd("ADD 0x123,")).toBe(false);
    expect(RegexUtils.isAdd("ADD R1 R2")).toBe(false);
    expect(RegexUtils.isAdd("ADD#2, R2")).toBe(false);
    expect(RegexUtils.isAdd("ADD R2, #2")).toBe(false);
    expect(RegexUtils.isAdd("ADD R2, 2")).toBe(false);
    expect(RegexUtils.isAdd("ADD [0x12], R2")).toBe(false);
});

test("string is SUB", () => {

    // Valid Numbers

    expect(RegexUtils.isSub("SUB R1, R2")).toBe(true);
    expect(RegexUtils.isSub("SUB #1, R2")).toBe(true);
    expect(RegexUtils.isSub("SUB #0x123F, R2")).toBe(true);
    expect(RegexUtils.isSub("SUB #0b111, R2")).toBe(true);
    expect(RegexUtils.isSub("SUB #-1, R2")).toBe(true);
    expect(RegexUtils.isSub("SUB #-1   ,    R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB R1, R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB #1, R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB #0x123F, R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB #0b111, R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB #-1, R2")).toBe(true);
    expect(RegexUtils.isSub("main: SUB #-1   ,    R2")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isSub(undefined)).toBe(false);
    expect(RegexUtils.isSub(null)).toBe(false);
    expect(RegexUtils.isSub("")).toBe(false);
    expect(RegexUtils.isSub("SUB 0x123")).toBe(false);
    expect(RegexUtils.isSub("SUB 0x123,")).toBe(false);
    expect(RegexUtils.isSub("SUB R1 R2")).toBe(false);
    expect(RegexUtils.isSub("SUB#2, R2")).toBe(false);
    expect(RegexUtils.isSub("SUB R2, #2")).toBe(false);
    expect(RegexUtils.isSub("SUB R2, 2")).toBe(false);
    expect(RegexUtils.isSub("SUB [0x12], R2")).toBe(false);
});

test("string is CMP", () => {

    // Valid Numbers

    expect(RegexUtils.isCmp("CMP R1, R2")).toBe(true);
    expect(RegexUtils.isCmp("CMP #1, R2")).toBe(true);
    expect(RegexUtils.isCmp("CMP #0x123F, R2")).toBe(true);
    expect(RegexUtils.isCmp("CMP #0b111, R2")).toBe(true);
    expect(RegexUtils.isCmp("CMP #-1, R2")).toBe(true);
    expect(RegexUtils.isCmp("CMP #-1   ,    R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP R1, R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP #1, R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP #0x123F, R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP #0b111, R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP #-1, R2")).toBe(true);
    expect(RegexUtils.isCmp("main: CMP #-1   ,    R2")).toBe(true);
    expect(RegexUtils.isCmp("main:CMP #-1   ,    R2")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isCmp(undefined)).toBe(false);
    expect(RegexUtils.isCmp(null)).toBe(false);
    expect(RegexUtils.isCmp("")).toBe(false);
    expect(RegexUtils.isCmp("CMP 0x123")).toBe(false);
    expect(RegexUtils.isCmp("CMP 0x123,")).toBe(false);
    expect(RegexUtils.isCmp("CMP R1 R2")).toBe(false);
    expect(RegexUtils.isCmp("CMP#2, R2")).toBe(false);
    expect(RegexUtils.isCmp("CMP R2, #2")).toBe(false);
    expect(RegexUtils.isCmp("CMP R2, 2")).toBe(false);
    expect(RegexUtils.isCmp("CMP [0x12], R2")).toBe(false);
});

test("string is MOV", () => {

    // Valid Numbers

    expect(RegexUtils.isMov("MOV R1, R2")).toBe(true);
    expect(RegexUtils.isMov("MOV #1, R2")).toBe(true);
    expect(RegexUtils.isMov("MOV #0x123F, R2")).toBe(true);
    expect(RegexUtils.isMov("MOV #0b111, R2")).toBe(true);
    expect(RegexUtils.isMov("MOV [0xFFF], R2")).toBe(true);
    expect(RegexUtils.isMov("MOV #-1, R2")).toBe(true);
    expect(RegexUtils.isMov("MOV #-1   ,    R2")).toBe(true);
    expect(RegexUtils.isMov("MOV R1, [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV #1, [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV [0xFF], [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV #0x123F, [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV #0b111, [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV #-1, [0xFF]")).toBe(true);
    expect(RegexUtils.isMov("MOV #-1   ,    [0xFF]")).toBe(true);

    expect(RegexUtils.isMov("main: MOV R1, R2")).toBe(true);
    expect(RegexUtils.isMov("main: MOV #1, R2")).toBe(true);
    expect(RegexUtils.isMov("main: MOV #0x123F, R2")).toBe(true);
    expect(RegexUtils.isMov("main: MOV #0b111, R2")).toBe(true);
    expect(RegexUtils.isMov("main: MOV #-1, R2")).toBe(true);
    expect(RegexUtils.isMov("main: MOV #-1   ,    R2")).toBe(true);

    // Invalid Numbers

    expect(RegexUtils.isMov(undefined)).toBe(false);
    expect(RegexUtils.isMov(null)).toBe(false);
    expect(RegexUtils.isMov("")).toBe(false);
    expect(RegexUtils.isMov("MOV 0x123")).toBe(false);
    expect(RegexUtils.isMov("MOV 0x123,")).toBe(false);
    expect(RegexUtils.isMov("MOV R1 R2")).toBe(false);
    expect(RegexUtils.isMov("MOV#2, R2")).toBe(false);
    expect(RegexUtils.isMov("MOV R2, #2")).toBe(false);
    expect(RegexUtils.isMov("MOV R2, 2")).toBe(false);
    expect(RegexUtils.isMov("MOV 0xFFF, R2")).toBe(false);
    expect(RegexUtils.isMov("MOV R2, 0xFFF")).toBe(false);
    expect(RegexUtils.isMov("MOV 0xFFF, [0xFFF]")).toBe(false);
});
