const _ = require("lodash");
const Excel = require("exceljs");

class writeExcel {
    wb = new Excel.Workbook();
    ws = this.wb.addWorksheet("Rack Layout", {properties: {defaultRowHeight: 21, defaultColWidth: 3.1}});

    creatStation(name) {
        
    }
}


