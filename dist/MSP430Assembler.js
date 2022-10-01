!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.MSP430Assembler=e():t.MSP430Assembler=e()}(self,(()=>(()=>{"use strict";var t={d:(e,s)=>{for(var n in s)t.o(s,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:s[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{default:()=>a});class s{static ID="[a-zA-Z]+\\w*";static HEXADECIMAL="0[xX][0-9a-fA-F]+";static INTEGER="[-+]?\\d+";static BINARY="0[bB][01]+";static REGISTER="\\R[0-9]+";static LABEL="@ID@:";static ADDRESS="\\[@HEX@\\]";static IMMEDIATE="\\#((@HEX@)|(@BIN@)|(@INT@))";static ADD="(@ID@:)?\\s*(ADD)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";static SUB="(@ID@:)?\\s*(SUB)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";static CMP="(@ID@:)?\\s*(CMP)\\s+((@REGISTER@)|(@IMMEDIATE@))\\s*\\,\\s*(@REGISTER@)";static MOV="(@ID@:)?\\s*(MOV)\\s+((@REGISTER@)|(@IMMEDIATE@)|(@ADDRESS@))\\s*\\,\\s*((@REGISTER@)|(@ADDRESS@))";static JMP="(@ID@:)?\\s*(JMP)\\s+((@ID@)|(@ADDRESS@))";static JN="(@ID@:)?\\s*(JN)\\s+((@ID@)|(@ADDRESS@))";static JZ="(@ID@:)?\\s*(JZ)\\s+((@ID@)|(@ADDRESS@))";static INT="(@ID@:)?\\s*(INT)\\s+([0-9]+h)";static test(t,e){return t=this.replaceVariables(t),new RegExp(`^${t}$`).test(e)}static match(t,e){return t=this.replaceVariables(t),new RegExp(`^${t}$`).exec(e)}static replaceVariables(t){return(t=(t=(t=(t=(t=(t=(t=t.replaceAll("@LABEL@",s.LABEL)).replaceAll("@ADDRESS@",s.ADDRESS)).replaceAll("@IMMEDIATE@",s.IMMEDIATE)).replaceAll("@ID@",s.ID)).replaceAll("@HEX@",s.HEXADECIMAL)).replaceAll("@BIN@",s.BINARY)).replaceAll("@INT@",s.INTEGER)).replaceAll("@REGISTER@",s.REGISTER)}static isBinary(t){return s.test(s.BINARY,t)}static isHexadecimal(t){return s.test(s.HEXADECIMAL,t)}static isInteger(t){return s.test(s.INTEGER,t)}static isAddress(t){return s.test(s.ADDRESS,t)}static isImmediate(t){return s.test(s.IMMEDIATE,t)}static isRegister(t){return s.test(s.REGISTER,t)}static isLabel(t){return s.test(s.LABEL,t)}static isJmp(t){return s.test(s.JMP,t)}static isJn(t){return s.test(s.JN,t)}static isJz(t){return s.test(s.JZ,t)}static isAdd(t){return s.test(s.ADD,t)}static isSub(t){return s.test(s.SUB,t)}static isCmp(t){return s.test(s.CMP,t)}static isMov(t){return s.test(s.MOV,t)}static isInt(t){return s.test(s.INT,t)}}class n extends Error{type;lineNumber;constructor(t,e,s){super(s),this.type=t,this.lineNumber=e}}class r{label;mnemonic;operands;constructor(t,e,s=[]){this.label=t&&t.replaceAll(":",""),this.mnemonic=e,this.operands=s}toString(){return`${this.mnemonic} ${this.operands.join(",")}`}toStringWithLabels(){return`${this.label||""} ${this.mnemonic} ${this.operands.join(",")}`}}class i{static getInstruction(t){if(s.isLabel(t[1])){const e=s.match(s.LABEL,t[1]);return[t[0],new r(e[0],"LABEL")]}if(s.isMov(t[1])){const e=s.match(s.MOV,t[1]);return[t[0],new r(e[1],e[2],[e[3],e[11]])]}if(s.isAdd(t[1])){const e=s.match(s.ADD,t[1]);return[t[0],new r(e[1],e[2],[e[3],e[10]])]}if(s.isSub(t[1])){const e=s.match(s.SUB,t[1]);return[t[0],new r(e[1],e[2],[e[3],e[10]])]}if(s.isCmp(t[1])){const e=s.match(s.CMP,t[1]);return[t[0],new r(e[1],e[2],[e[3],e[10]])]}if(s.isJmp(t[1])){const e=s.match(s.JMP,t[1]);return[t[0],new r(e[1],e[2],[e[3]])]}if(s.isJz(t[1])){const e=s.match(s.JZ,t[1]);return[t[0],new r(e[1],e[2],[e[3]])]}if(s.isJn(t[1])){const e=s.match(s.JN,t[1]);return[t[0],new r(e[1],e[2],[e[3]])]}if(s.isJn(t[1])){const e=s.match(s.JN,t[1]);return[t[0],new r(e[1],e[2],[e[3]])]}if(s.isInt(t[1])){const e=s.match(s.INT,t[1]);return[t[0],new r(e[1],e[2],[e[3]])]}throw new n("lexical",t[0],`Line ${t[0]}: the instruction is invalid`)}static print(t){let e=[];for(const s of t)e.push(`${s[0]} ${s[1].toStringWithLabels()}`);console.log(e.join("\n"))}}const a={Assembler:class{parseToLines(t){if(!t)throw new Error("String should not be undefined");return t.trim().split("\n").map((t=>t.trim())).map(((t,e)=>[e,t])).map((t=>[t[0],t[1].replace(/;(.*)/g,"")])).map((t=>[t[0],t[1].trim()])).filter((t=>0!==t[1].length))}sintaxAnalysis(t){if("MOV"===t[1].mnemonic){const e=t[1].operands;if(s.isAddress(e[0])&&s.isAddress(e[1]))throw new Error(`There is a error on line ${t[0]} ${t[1]}. You may not move inside memory`)}}findNextInstructions(t,e){for(let s=e;s<t.length;s++){const e=t[s];if("LABEL"!==e[1].mnemonic)return e[0]}throw new n("labels",-1,`Label ${t[e]} is not associated to an instruction`)}runLexicalAnalysis(t){let e=[],s=[];for(const n of t)try{s.push(i.getInstruction(n))}catch(t){e.push(t)}if(e.length>0)throw e;return s}runSyntaticAnalysis(t){let e=[];for(const s of t)try{this.sintaxAnalysis(s)}catch(t){e.push(new n("syntax",s[0],t.message))}if(e.length>0)throw e;return t}runLinesReArrangement(t){let e=0;for(let s=0;s<t.length;s++){let n=t[s];"LABEL"===n[1].mnemonic?n[0]=-1:n[0]=e++}return t}runLabelMaps(t){let e={},s=[];for(let r=0;r<t.length;r++){const i=t[r];let a=i[1].label;if(a)if(e[a])s.push(new n("labels",i[0],`Line ${i[0]}: Label '${a}' is duplicated`));else try{e[a]=this.findNextInstructions(t,r)}catch(t){s.push(t)}}if("main"in e||s.push(new n("labels",1,"Missing the 'main' label")),s.length>0)throw s;return e}runReplaceLabels(t,e){let s=[];for(let r=0;r<t.length;r++){const i=t[r];if(["JN","JZ","JMP"].includes(i[1].mnemonic)){const t=i[1].operands[0];t in e?i[1].operands[0]=e[t]:s.push(new n("labels",i[0],`Line ${i}: Label '${t}' not found`))}}if(s.length>0)throw s;return t}runRemoveAllLabels(t){let e=[];for(const s of t)"LABEL"!==s[1].mnemonic&&e.push(s[1]);return e}compile(t){let e=this.parseToLines(t);if(0===e.length)throw new Error("String should not be empty");let s=[],n=[];try{s=this.runLexicalAnalysis(e),s=this.runSyntaticAnalysis(s),s=this.runLinesReArrangement(s);const t=this.runLabelMaps(s);s=this.runReplaceLabels(s,t),s=this.runRemoveAllLabels(s)}catch(t){n=t}return{instructions:s,errors:n}}},CompilerError:n,Instruction:r,InstructionUtils:i,RegexUtils:s};return e})()));