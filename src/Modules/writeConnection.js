//This class manages producing Excel files of BPM.
//You just need to use two functions in this class.
//First one is createConncetion() to make a Work Book containing connections
//And the second one is write() to get an Excel file as output.
//for an instance of usage, please refer to line 126 of App.js JS file.
const Excel = require("exceljs");

const constants = {
    scale: 4/3,
    firstColWidth: 40,
    firstRowHeight: 107,
    secColWidth: 40,
    thirdColWidth: 22.7,
    forthColWidth: 16.3,
    center: {vertical: "middle", horizontal: "center"},
    left: {vertical: "middle", horizontal: "left"},
    calibri: "Calibri",
    mediumBorder: {top: {style: "medium"}, left: {style: "medium"}, bottom: {style: "medium"}, right: {style: "medium"}},
    upDownBoldedBorder: {top: {style: "medium"}, left: {style: "thin"}, bottom: {style: "medium"}, right: {style: "thin"}},
    simpleBorder: {top: {style: "thin"}, left: {style: "thin"}, bottom: {style: "thin"}, right: {style: "thin"}},
    stationFont: 28,
    solidPaint: {type: "pattern", pattern: "solid"},
    row2Font: 14,
    row2Color: {fgColor: {argb: "00FFC000"}},
    dataFont: 11,
    descriptionCellColor: {fgColor: {argb: "00FFE699"}}

};
class WriteConnection {
    wb = new Excel.Workbook();

    //Gets a connection list as input and gives a Work Book as its output.
    //to see the shape of the input please run consol.log() function.
    createConnection(connections) {
        console.log("Writeconnections: ", connections);
        // try {
            connections.forEach(connection => {
                const ws = this.wb.addWorksheet(connection.name);
                const labels = this.extractLabels(connection.data);

                ws.getRow(1).height = constants.firstRowHeight * constants.scale;
                ws.getColumn(1).width = constants.firstColWidth + constants.scale;
                ws.getColumn(2).width = constants.secColWidth + constants.scale;
                ws.getColumn(3).width = constants.thirdColWidth + constants.scale;
                ws.getColumn(4).width = constants.forthColWidth + constants.scale;
                ws.mergeCells(1, 1, 1, 3);
                this.setCellText(ws.getCell(1, 1), connection.name, constants.stationFont, constants.mediumBorder,constants.center, true);

                const fromCellHeader = ws.getCell(2,1);
                fromCellHeader.fill = {...constants.solidPaint, ...constants.row2Color};
                this.setCellText(fromCellHeader, "From", constants.row2Font, constants.upDownBoldedBorder, constants.left, true);

                const toCellHeader = ws.getCell(2, 2);
                toCellHeader.fill = {...constants.solidPaint, ...constants.row2Color};
                this.setCellText(toCellHeader, "To", constants.row2Font, constants.upDownBoldedBorder, constants.left, true);

                const thirdCellHeader = ws.getCell(2, 3);
                thirdCellHeader.fill = {...constants.solidPaint, ...constants.row2Color};
                this.setCellText(thirdCellHeader, "", constants.row2Font, constants.upDownBoldedBorder);

                labels.forEach(label => {
                    const startRow = ws.rowCount + 1;
                    const from = label.split(" to ")[0];
                    const to = label.split(" to ")[1];
                    let specificConnection = connection.data.filter(res => res.from.cardName === from && res.to.cardName === to);
                    if(from === "ODF") {
                        specificConnection = specificConnection.sort((a, b) => a.from.station.localeCompare(b.from.station));
                    }
                    for(let i = 0; i < specificConnection.length; i++) {
                        const fromCell = ws.getCell(startRow + i, 1);
                        this.setCellText(fromCell, this.createValue(specificConnection[i].from), constants.dataFont, constants.simpleBorder, constants.left);
                        const toCell = ws.getCell(startRow + i, 2);
                        this.setCellText(toCell, this.createValue(specificConnection[i].to), constants.dataFont, constants.simpleBorder, constants.left);
                        if(specificConnection[i].from.type === "ODF" && (i === 0 || specificConnection[i - 1].from.station !== specificConnection[i].from.station)) {
                            const {station} = specificConnection[i].from;
                            const stationLength = specificConnection.filter(data => data.from.station === station).length;
                            ws.mergeCells(startRow + i, 4, startRow + i + stationLength - 1, 4);
                            const addressCell = ws.getCell(startRow + i, 4);
                            this.setCellText(addressCell, "To " + station.split(/ to | To /)[1], constants.dataFont, constants.mediumBorder, constants.center);
                        }
                    }
                    ws.mergeCells(startRow, 3, startRow + specificConnection.length - 1, 3);
                    const thirdCell = ws.getCell(startRow, 3);
                    this.setCellText(thirdCell, label, constants.dataFont, constants.mediumBorder, constants.center,true);
                    thirdCell.fill = {...constants.solidPaint, ...constants.descriptionCellColor};
                    ws.addRow("");
                });
            });
        // } catch (e) {
        //     alert("Please import some files.");
        // }
    }

    extractLabels(connection) {
        const labelSet = new Set;
        connection.forEach(data => {
            labelSet.add(data.from.cardName + " to " + data.to.cardName);
        });
        return[...labelSet];
    }

    setCellText(cell, value, fontSize, border, alignment, bold){
        cell.value = value;
        cell.border = border;
        cell.alignment = alignment;
        cell.font = {name: constants.calibri, size: fontSize, bold: bold};
    };
    //RackAddr, cardAddr, cardName, port, shelfAddr, size, type
    //cardName, port, station, type
    createValue(direction) {
         if(direction.type === "ODF") {
             return direction.station + "," + direction.port;
         }
         return direction.RackAddr +
             ",C" + direction.shelfAddr +
             ",S" + direction.cardAddr + (direction.size > 1 ? "~" + (parseInt(direction.cardAddr) + direction.size - 1).toString() : "") +
             "," + direction.cardName +
             "," + direction.port;
    }

    //Gives an Excel file containing the result connections.
    write = () => {
        return this.wb.xlsx.writeBuffer();
    }
}

export default WriteConnection;