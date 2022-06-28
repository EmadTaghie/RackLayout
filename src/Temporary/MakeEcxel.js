const _ = require("lodash");
const Excel = require("exceljs");

const wb = new Excel.Workbook();
const ws = wb.addWorksheet("Rack Layout", {properties: {defaultRowHeight: 21, defaultColWidth: 3.1}});
ws.mergeCells(1, 1, 2, 20);
ws.getCell(1, 1).value = "(Rack Layout)\r\n\r\nNode1 - کرمان(باهنر)";
ws.getCell(1, 1).alignment = {vertical: "middle", horizontal: "center", wrapText: true};
ws.getCell(1, 1).font = {name: "Calibri", size: 22, bold: true};
ws.getRow(2).height = 110;
ws.getColumn(1).width = 4.6;
ws.getColumn(2).width = 4.6;
ws.getColumn(19).width = 4.6;
ws.getColumn(20).width = 4.6;
ws.mergeCells(5,3,5,18);
ws.getCell(5,3).fill = {type: "pattern", pattern: "solid", fgColor: {argb: "07030A0"}};
ws.getCell(5, 3).value = "Rack1";
ws.getCell(5, 3).alignment = {vertical: "middle", horizontal: "center"};
ws.getCell(5, 3).font = {name: "Calibri", size: 14, bold: true, color:{argb: "FFFFFFF"}};

fillBalck = {type: "pattern", pattern: "solid", fgColor:{argb: "00000000"}};
ws.mergeCells(6, 4, 6, 17);
ws.getCell(6, 4).fill = fillBalck;
ws.mergeCells(6, 3, 47, 3);
ws.getCell(6, 3).fill = fillBalck;
ws.mergeCells(47, 4, 47, 17);
ws.getCell(47, 4).fill = fillBalck;
ws.mergeCells(6, 18, 47, 18);
ws.getCell(6, 18).fill = fillBalck;

const style = {style: 'medium'};
const border = {top: style, left: style, bottom: style, right: style};
ws.mergeCells(7, 4, 7, 17);
ws.getCell(7,4).fill = {type: "pattern", pattern: "solid", fgColor: {argb: "00D9D9D9"}};
ws.getCell(7, 4).value = "PDU";
ws.getCell(7,4).font = {name: "Calibri", size: 10};
ws.getCell(7, 4).border = border;
ws.getCell(7, 4).alignment = {vertical: "middle", horizontal: "center"};
_.range(1, 15).forEach(num => {
    ws.getCell(37, 18 - num).value = num
    ws.getCell(37, 18 - num).border = border;
    ws.getCell(37, 18 - num).alignment = {vertical: "middle", horizontal: "center"};
    ws.getCell(37, 18 - num).font = {name: "Calibri", size: 7};
    ws.mergeCells(37 + 1, 18 - num, 37 + 6, 18 - num);
    ws.getCell(37 + 1, 18 - num).border = border;
});
ws.mergeCells(44, 4, 44, 17);
ws.getCell(44, 4).border = border;
ws.getCell(44, 4).value = "FAN / HB";
ws.getCell(44, 4).font = {name: "Calibri", size: 8, bold: true};
ws.getCell(44, 4).alignment = {vertical: "middle", horizontal: "center"};
ws.mergeCells(45, 4, 46, 17);
wb.xlsx.writeFile("makeExcel.xlsx");