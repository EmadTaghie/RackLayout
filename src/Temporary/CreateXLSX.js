const xlsx = require("xlsx-style");

// const wb = xlsx.utils.book_new();
// wb.SheetNames.push("Test Sheet");
// const data = [['Hello' , 'World']];
// const ws = xlsx.utils.aoa_to_sheet(data);
// ws["A1"].s = {
//     patternType: 'italic',
//     bgColor: { indexed: 64 }
// }
// // console.log(ws["A1"])
// wb.Sheets["Test Sheet"] = ws;
// xlsx.writeFile(wb, "Me.xlsx");
const wb = xlsx.readFile("Me.xlsx");
console.log(wb)
const wb1 = {...wb};
wb1.Sheets[wb1.SheetNames[0]]["A1"].s = {
    patternType: 'solid',
    fgColor: { rgb: 'FF0000' },
    bgColor: { indexed: 64 }
}
// console.log(wb1.Sheets[wb1.SheetNames[0]]["A1"]);
xlsx.writeFile(wb1, 'Me1.xlsx');