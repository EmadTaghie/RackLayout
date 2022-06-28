const xlsx = require("xlsx-style");

const wb = xlsx.readFile("Kerman_RKLYOT_991113(OCM Placement).xlsx");
const ws = wb.Sheets['Rack Layout'];

// const data = xlsx.utils.sheet_to_json(ws);
console.log(ws[xlsx.utils.encode_cell({r: 37, c: 172})].s);
// console.log(alphaToNum("FP"));
// console.log("func = ", ws)
// let workB = {SheetNames: [], Sheets: {}};
// workB.SheetNames = ['Rack Layout'];
// workB.Sheets = {'Rack Layout': xlsx.utils.json_to_sheet(data)};
// xlsx.writeFile(workB, "out1.xlsx");
// console.log("wb = ", xlsx.utils.sheet_to_json(ws));
// console.log(xlsx.utils.json_to_sheet(xlsx.utils.sheet_to_json(ws)));
// let k = Object.keys(ws);
// let reg = /[A-B]?[A-Z]\d+|C[A-B]\d+/;
// let s = "ALUC";
// let AK = k.filter(key => {
//     const res = key.match(reg);
//     return res !== null && res["index"] ===0;
// });
// let t = new Object();
// AK.forEach(data => t[data] = ws[data])
// console.log(t);
//
function alphaToNum(alpha) {

    var i = 0,
        num = 0,
        len = alpha.length;

    for (; i < len; i++) {
        num = num * 26 + alpha.charCodeAt(i) - 0x40;
    }

    return num - 2;
}

