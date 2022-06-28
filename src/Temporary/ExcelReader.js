const _ = require("lodash");
const Excel = require("exceljs");
const StationUtility = require("../Modules/StationUtility").default;

class ExcelReader {
    #RackCells = 20;
    #shelvesInRack = 4;
    #RackAddrRow = 49;
    #stations = [];
    #cardRows = [37, 29, 21, 13];
    #file = {};
    #sheetName = "Sheet1";
    #wb = new Excel.Workbook();
    #ws = {};
    cardStorage = [];
    stationUtil = new StationUtility([]);


    constructor(file) {
        this.#file = file;
        return (async () => {
            await this.prepareExcel(file, this.#sheetName);
            this.prepareStations();
            return this;
        })();
    }

    convToBuff(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (ev) => resolve(ev.target.result);
            fileReader.onerror = (err) => reject(err);
        })
    }

    getCell(row, col) {
        return this.#ws.getCell(row, col);
    }

    async prepareExcel(file, sheetName) {
        const fileBuff = await this.convToBuff(file);
        await this.#wb.xlsx.load(fileBuff);
        this.#ws = this.#wb.getWorksheet(sheetName);
    }

    prepareStations() {
        _.range(1, this.#ws.columns.length + 1).forEach(col => {
            if(this.getCell(1, col).master.address === this.getCell(1, col).address) {
                this.#stations.push({name: this.getCell(1, col).value, col: col});
            }
        });
    }

    readShelf(startColRack, shelfId) {
        const portRow = this.#cardRows[shelfId - 1];
        //If there is no shelf return null
        if (this.getCell(portRow, startColRack + 16).value === null) return null;

        const shelf = {id: shelfId, cards: []};
        for (let cardIter = startColRack + 16; cardIter > startColRack + 2; cardIter--) {
            let size = 1;
            if(this.getCell(portRow + 1, cardIter).master !== this.getCell(portRow + 4, cardIter).master){
                size = 1/2;
            } else {
                size = cardIter - this.getCell(portRow + 1, cardIter).master.col + 1;
            }

            let color = "00" + this.stationUtil.getCard(this.getCell(portRow + 1, cardIter).value||"").bgColor.split("#")[1];
            shelf.cards.push({
                id: this.getCell(portRow, cardIter).value,
                name: this.getCell(portRow + 1, cardIter).value||"",
                size: size,
                fill:{type: "pattern", pattern: "solid", fgColor:{argb: color}},
                addr: {row: portRow + 1, col: cardIter}
            });
            if(typeof this.cardStorage.find(value => value === (this.getCell(portRow + 1, cardIter).value||"")) === "undefined") {
                this.cardStorage.push(this.getCell(portRow + 1, cardIter).value || "");
            }
            //Do not read the next col if the size of the current card is greater than 1
            if (this.getCell(portRow + 1, cardIter).master.address !== this.getCell(portRow + 1, cardIter).address) cardIter--;
        }
        return {...shelf};
    }

    readRack(startCol, RackId){
        const Rack = {
            id: RackId,
            shelves: [],
            address: this.getCell(this.#RackAddrRow, startCol + 3).value.split(': ')[1]
        };
        _.range(0, this.#shelvesInRack).forEach(shelf => {
            let shelfBuf = this.readShelf(startCol, shelf + 1);
            if (shelfBuf !== null) Rack.shelves.push({...shelfBuf});
        });
        return {...Rack};
    }

    readStation(stationItem, stationId) {
        const name = typeof(stationItem.name) === "string" ? stationItem.name : stationItem.name.richText[0].text + stationItem.name.richText[1].text;
        const station = {id: stationId, name: name, Racks: []};
        const index = this.#stations.indexOf(stationItem);
        const endCol = index + 1 === this.#stations.length ?
            this.#ws.columns.length + 1 : this.#stations[index + 1].col;
        const RacksOfStation = (endCol - stationItem.col)/this.#RackCells;
        _.range(0, RacksOfStation).forEach(Rack => {
            station.Racks.push(this.readRack(
                stationItem.col + Rack*this.#RackCells,
                Rack + 1)
            );
        });
        return {...station};
    }

    readCity() {
        return this.#stations.map(station =>
            this.readStation(station, this.#stations.indexOf(station) + 1)
        ).concat();
    }

    readConnectionWS(connectionAddr) {
        const connectionWS = this.#wb.getWorksheet(connectionAddr);
        return {name: connectionAddr, data: this.readRows(connectionWS)};
    }

    readRows(ws) {
        const connection = [];
        ws.getRows(3, ws.rowCount).forEach(data => {
            let fromCell = data.getCell(1).value;
            if(fromCell !== null) {
                fromCell = this.convRichText2Text(fromCell);
                const toCell = this.convRichText2Text(data.getCell(2).value);
                const descrCell = this.convRichText2Text(data.getCell(3).value);
                connection.push(
                    {
                        description: {from: descrCell.split(/ to | TO /)[0], to: descrCell.split(/ to | TO /)[1]},
                        connection: {from: fromCell, to: toCell}
                    }
                );
            }
        });
        return connection;
    }
    convRichText2Text(text) {
        let buff = "";
        if(typeof text.richText !== "undefined"){
            text.richText.forEach(item => buff += item.text);
        } else {
            buff = text;
        }
        return buff
    }
}

export default ExcelReader;

// const mainClass = async function () {
//     const c = await new ExcelReader();
//     console.log(c.readCity());
// }
//
// mainClass().then();