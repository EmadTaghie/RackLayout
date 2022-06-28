const Excel = require("exceljs");
const wb = new Excel.Workbook();
const sheet = wb.addWorksheet("my sheet", {properties: {tabColor: {argb: 'FFC0000'}}});
// sheet.getColumn(6).values = [,,2,3,,5,,7,,,,11];
// sheet.columns = [
//     { header: 'Id', key: 'id', width: 10 },
//     { header: 'Name', key: 'name', width: 32 },
//     { header: 'D.O.B.', key: 'dob', width: 10, outlineLevel: 1 }
// ];
// // sheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
// // sheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
//
// sheet.insertRow(5, {id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
// sheet.insertRow(5, {id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

// sheet.getCell('A1').note = 'Hello, ExcelJS!';
// sheet.getCell('B1').note = {
//     texts: [
//         {'font': {'size': 12, 'color': {'theme': 0}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': 'This is '},
//         {'font': {'italic': true, 'size': 12, 'color': {'theme': 0}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'a'},
//         {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' '},
//         {'font': {'size': 12, 'color': {'argb': 'FFFF6600'}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'colorful'},
//         {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' text '},
//         {'font': {'size': 12, 'color': {'argb': 'FFCCFFCC'}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'with'},
//         {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' in-cell '},
//         {'font': {'bold': true, 'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': 'format'},
//     ],
//     margins: {
//         insetmode: 'custom',
//         inset: [0.25, 0.25, 0.35, 0.35]
//     },
//     protection: {
//         locked: true,
//         lockText: false
//     },
//     editAs: 'twoCells',
// };
// sheet.addTable({
//     name: 'MyTable',
//     ref: 'A1',
//     headerRow: true,
//     totalsRow: true,
//     style: {
//         theme: 'TableStyleDark3',
//         showRowStripes: true,
//     },
//     columns: [
//         {name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
//         {name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
//     ],
//     rows: [
//         [new Date('2019-07-20'), 70.10],
//         [new Date('2019-07-21'), 70.60],
//         [new Date('2019-07-22'), 70.10],
//     ],
// });

// sheet.getCell("A3").value = "Emad";
// sheet.getCell("A3").alignment = {horizontal: 'center', vertical: 'middle', textRotation: -90};


// fill A1 with red darkVertical stripes
sheet.getCell('A1').fill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FFFF0000'},
    bgColor: {argb:'00000000'}
};

// fill A2 with yellow dark trellis and blue behind
sheet.getCell('A2').fill = {
    type: 'pattern',
    pattern:'darkTrellis',
    fgColor:{argb:'FFFFFF00'},
    bgColor:{argb:'FF0000FF'}
};

// fill A3 with blue-white-blue gradient from left to right
sheet.getCell('A3').fill = {
    type: 'gradient',
    gradient: 'angle',
    degree: 0,
    stops: [
        {position:0, color:{argb:'FF0000FF'}},
        {position:0.5, color:{argb:'FFFFFFFF'}},
        {position:1, color:{argb:'FF0000FF'}}
    ]
};


// fill A4 with red-green gradient from center
sheet.getCell('A4').fill = {
    type: 'gradient',
    gradient: 'path',
    center:{left:0.5,top:0.5},
    stops: [
        {position:0, color:{argb:'FFFF0000'}},
        {position:1, color:{argb:'FF00FF00'}}
    ]
};

wb.xlsx.writeFile("test.xlsx");

// wb.xlsx.readFile('test.xlsx').then(function (){
//     const sheet = wb.getWorksheet("my sheet");
//     console.log(sheet.columns[0].width);
// });