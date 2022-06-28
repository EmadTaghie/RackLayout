import StationUtility from "./StationUtility";

const _ = require("lodash");
const Excel = require("exceljs");
const stationUtility = require("./StationUtility");

class writeExcel {
    constants = {
        RackCells: 20,
        center: {vertical: "middle", horizontal: "center"},
        calibri: "Calibri",
        stationFontSize: 22,
        row2Height: 110,
        marginCols: 4.6,
        solidPaint: {type: "pattern", pattern: "solid"},
        RackHeaderColor: {fgColor: {argb: "07030A0"}},
        RackHeaderFontSize: 14,
        RackHeaderFontColor: {argb: "FFFFFFF"},
        fillBlack: {type: "pattern", pattern: "solid", fgColor:{argb: "00000000"}},
        RackBorderUpperRow: 6,
        RackBorderLowerRow: 47,
        mediumStyle: {style: "medium"},
        mediumBorder: {top: {style: "medium"}, left: {style: "medium"}, bottom: {style: "medium"}, right: {style: "medium"}},
        PDUColor: {fgColor: {argb: "00D9D9D9"}},
        PDUFontSize: 10,
        LayoutFooterSize: 18,
        powerFooterSize: 16,
        shelfHeight: 8,
        shelfWidth: 14,
        startRowShelf: 44,
        RackMargin: 3,
        cardCells: 6,
        portFontSize: 7,
        cardFontSize: 10,
        FANFontSize: 8,
        shelfPowerColor: {fgColor: {argb: "00FFFFCC"}},
        shelfPowerFontSize: 22
    };

    wb = new Excel.Workbook();
    ws = {
        RackLayoutWS: this.wb.addWorksheet("Rack Layout", {properties: {defaultRowHeight: 21, defaultColWidth: 3.1}}),
        PowerWS: this.wb.addWorksheet("Power Consumption", {properties: {defaultRowHeight: 21, defaultColWidth: 3.1}})
    };

    creatCity(city) {
        this.stationUtil = new StationUtility(city);
        city.forEach(station => {
            this.creatStation(station);
        })
    }

    creatStation(data) {
        console.log("station data = ", data)
        for (const [__, WS] of Object.entries(this.ws)) {
            const starterCell = WS.getRow(1).cellCount + 1;
            WS.mergeCells(1, starterCell, 2, starterCell + this.constants.RackCells * Math.max(1, data.Racks.length) - 1);
            const headerCell = WS.getCell(1, starterCell);
            this.setCellText(headerCell, data.name, this.constants.stationFontSize, false, true);
            headerCell.alignment = {...headerCell.alignment, wrapText: true};
            WS.getRow(2).height = this.constants.row2Height;
            data.Racks.forEach(Rack => {
                this.creatRack(Rack, starterCell + (Rack.id - 1) * this.constants.RackCells, WS);
            });
        }
    }

    creatRack(data, startColl, WS) {
        [0, 1, this.constants.RackCells - 1, this.constants.RackCells - 2].forEach(item =>
            WS.getColumn(startColl + item).width = this.constants.marginCols
        );
        WS.mergeCells(5, startColl + 2, 5, startColl + 17);
        const RackHeader = WS.getCell(5, startColl + 2);
        this.setCellText(RackHeader, "Rack" + data.id, this.constants.RackHeaderFontSize, false, true);
        RackHeader.font = {...RackHeader.font, color: this.constants.RackHeaderFontColor};
        RackHeader.fill = {...this.constants.solidPaint, ...this.constants.RackHeaderColor};
        WS.mergeCells(this.constants.RackBorderUpperRow, startColl + 3, this.constants.RackBorderUpperRow, startColl + 16);
        WS.getCell(this.constants.RackBorderUpperRow, startColl + 3).fill = this.constants.fillBlack;
        WS.mergeCells(this.constants.RackBorderUpperRow, startColl + 2, this.constants.RackBorderLowerRow, startColl + 2);
        WS.getCell(this.constants.RackBorderUpperRow, startColl + 2).fill = this.constants.fillBlack;
        WS.mergeCells(this.constants.RackBorderLowerRow, startColl + 3, this.constants.RackBorderLowerRow, startColl + 16);
        WS.getCell(this.constants.RackBorderLowerRow, startColl + 3).fill = this.constants.fillBlack;
        WS.mergeCells(this.constants.RackBorderUpperRow, startColl + 17, this.constants.RackBorderLowerRow, startColl + 17);
        WS.getCell(this.constants.RackBorderUpperRow, startColl + 17).fill = this.constants.fillBlack;

        WS.mergeCells(7, startColl + 3, 7, startColl + 16);
        const PDU = WS.getCell(7, startColl + 3);
        this.setCellText(PDU, "PDU", this.constants.PDUFontSize, true);
        PDU.fill = {...this.constants.solidPaint, ...this.constants.PDUColor};

        WS.mergeCells(45, startColl + 3, 46, startColl + 16);

        WS.mergeCells(49, startColl + 2, 50, startColl + 17);
        const footer = WS.getCell(49, startColl + 3);
        if(WS.name === "Rack Layout") {
            this.setCellText(footer, "Rack Address: " + data.address, this.constants.LayoutFooterSize, false, true);
        } else if(WS.name === "Power Consumption") {
            this.setCellText(
                footer,
                "Power Consumption of Rack " + data.id + ": " + this.stationUtil.calcRackPowerByRack(data) + " W",
                this.constants.powerFooterSize,
                false,
                true
            );
        }

        WS.mergeCells(8, this.constants.RackMargin + startColl,
            12, this.constants.RackMargin + startColl + this.constants.shelfWidth - 1);

        _.range(1, 5).forEach(shelfId => {
            const shelf = data.shelves.find(shelf => shelf.id === shelfId);
            if(typeof shelf === "undefined"){
                WS.mergeCells(this.constants.startRowShelf - shelfId*this.constants.shelfHeight + 1, startColl + this.constants.RackMargin,
                    this.constants.startRowShelf - (shelfId - 1)*this.constants.shelfHeight, startColl + this.constants.RackMargin + this.constants.shelfWidth - 1);
            }
            else if (WS.name === "Rack Layout") {
                console.log("rackData = ", data)
                this.creatShelfLayout(shelf, startColl);
            } else if (WS.name === "Power Consumption") {
                this.creatPowerLayout(shelf, startColl);
            }
        })
        // data.shelves.forEach(shelf => {
        //     if (WS.name === "Rack Layout") {
        //         this.creatShelfLayout(shelf, startColl);
        //     } else if (WS.name === "Power Consumption") {
        //         this.creatPowerLayout(shelf, startColl);
        //     }
        // })
    }

    creatPowerLayout(data, startCol) {
        const startCell = {
            row: this.constants.startRowShelf - this.constants.shelfHeight * data.id + 1,
            col: startCol + this.constants.RackMargin
        };
        this.ws.PowerWS.mergeCells(startCell.row, startCell.col, startCell.row + this.constants.shelfHeight - 1, startCell.col + this.constants.shelfWidth - 1);
        const shelf = this.ws.PowerWS.getCell(startCell.row, startCell.col);
        this.setCellText(shelf, "", 10, true);
        shelf.fill = {...this.constants.solidPaint, ...this.constants.shelfPowerColor};
        shelf.value = {
            richText:
                [
                    {font: {size: this.constants.LayoutFooterSize, name: this.constants.calibri, bold:true}, text: "Shelf " + data.id + "\n\r\n\r"},
                    {font: {size: 14, name: this.constants.calibri, bold:true}, text: "Power Consumption: "  +this.stationUtil.calcShelfPowerByShelf(data) + " W"}
                ]
        };
        shelf.alignment = {...this.constants.center, wrapText: true}
    }

    creatShelfLayout(data, startCol) {
        console.log("data = ", data)
        const firstPortAddr = {
            row: this.constants.startRowShelf - this.constants.shelfHeight * data.id + 1,
            col: startCol + this.constants.RackMargin + this.constants.shelfWidth - 1
        };
        _.range(1, this.constants.shelfWidth + 1).forEach(num =>  {
            const port = this.ws.RackLayoutWS.getCell(firstPortAddr.row, firstPortAddr.col - num + 1);
            this.setCellText(port, num, this.constants.portFontSize, true)
        });
        data.cards.forEach(card => {
            const cardAddr = {
                row:firstPortAddr.row + 1,
                col: firstPortAddr.col - card.id - Math.ceil(card.size) + 2
            };
            const transformedSize = Math.ceil(1/card.size);
            _.range(0, transformedSize).forEach(slot => {
                this.ws.RackLayoutWS.mergeCells(cardAddr.row + slot*this.constants.cardCells/transformedSize, cardAddr.col,
                    cardAddr.row + (1 + slot)*this.constants.cardCells/transformedSize - 1, firstPortAddr.col - card.id + 1);
                const cardCell = this.ws.RackLayoutWS.getCell(cardAddr.row + slot*this.constants.cardCells/transformedSize, cardAddr.col);
                this.setCellText(cardCell, card.name, this.constants.cardFontSize, true, true, true);
                cardCell.fill = card.fill;
            })

            // this.ws.RackLayoutWS.mergeCells(cardAddr.row, cardAddr.col, cardAddr.row + this.constants.shelfHeight - 3, firstPortAddr.col - card.id + 1);
            //
            // const cardCell = this.ws.RackLayoutWS.getCell(cardAddr.row, cardAddr.col);
            // this.setCellText(cardCell, card.name, this.constants.cardFontSize, true, true, true);
            // cardCell.fill = card.fill;
        });

        const FANAddr = {
            row: firstPortAddr.row + this.constants.shelfHeight - 1,
            col: firstPortAddr.col - this.constants.shelfWidth + 1
        };
        this.ws.RackLayoutWS.mergeCells(FANAddr.row, FANAddr.col, FANAddr.row, firstPortAddr.col);
        const FANCell = this.ws.RackLayoutWS.getCell(FANAddr.row, FANAddr.col);
        this.setCellText(FANCell, "FAN / HB", this.constants.FANFontSize, true, true);
    }

    setCellText(cell, value, fontSize, border, bold, vertical){
        cell.value = value;
        cell.border = border ? this.constants.mediumBorder : {};
        cell.alignment = {...this.constants.center, textRotation: vertical ? 90 : 0};
        cell.font = {name: this.constants.calibri, size: fontSize, bold: bold};
    };

    write() {
        return this.wb.xlsx.writeBuffer();
    }
}

export default writeExcel;