const _ = require("lodash");
const Excel = require("exceljs");

class ExcelJsSecond {
    #RackCells = 20;
    #shelvesInRack = 4;
    #RackAddrRow = 49;
    #stations = [];
    #cardRows = [37, 29, 21, 13];
    #fileName = "Kerman_Rack_Layout.xlsx";
    #sheetName = "Sheet1";
    #wb = new Excel.Workbook();
    #ws = {};

    constructor() {
        return (async () => {
            await this.prepareExcel(this.#fileName, this.#sheetName);
            this.prepareStations();
            return this;
        })();
    }

    getCell(row, col) {
        return this.#ws.getCell(row, col);
    }

    async prepareExcel(fileName, sheetName) {
        await this.#wb.xlsx.readFile(fileName);
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
            shelf.cards.push({
                id: this.getCell(portRow, cardIter).value,
                name: this.getCell(portRow + 1, cardIter).value,
                addr: {row: portRow + 1, col: cardIter}
            });
            //Do not read the next col if the size of the current card is greater than 1
            if (this.getCell(portRow + 1, cardIter).master.address !== this.getCell(portRow + 1, cardIter).address) cardIter--;
        }
        return {...shelf};
    }

    readRack(startCol, RackId){
        const Rack = {
            id: RackId,
            shelves:[],
            address: this.getCell(this.#RackAddrRow, startCol + 3).value.split(': ')[1]
        };
        _.range(0, this.#shelvesInRack).forEach(shelf => {
            let shelfBuf = this.readShelf(startCol, shelf + 1);
            if (shelfBuf !== null) Rack.shelves.push({...shelfBuf});
        });
        return {...Rack};
    }

    readStation(stationItem, stationId) {
        const station = {id: stationId, Racks: []};
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
}

const mainClass = async function () {
    const c = await new ExcelJsSecond();
    console.log(c.readCity());
}

mainClass().then();