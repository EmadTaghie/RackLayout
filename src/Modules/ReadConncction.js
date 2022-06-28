const Excel = require("exceljs");

class ReadConnection {
    wb = new Excel.Workbook();
    ws = {};

    constructor(file) {
        return this.readConnectionWS(file);
    }

    async readConnectionWS(file) {
        const fileBuffer = await this.convToBuff(file)
        await this.wb.xlsx.load(fileBuffer);
        this.ws = this.wb.worksheets;
        return this.ws.map(ws => {
            return {
                id: this.ws.findIndex(workSheet => workSheet.name === ws.name) + 1,
                name: ws.name,
                data: this.readRows(ws)
            }
        });
    }

    readRows(ws) {
        const connection = [];
        let counter = 0;
        ws.getRows(3, ws.rowCount).forEach(data => {
            const fromCell = this.convRichText2Text(data.getCell(1).value);
            const toCell = this.convRichText2Text(data.getCell(2).value);
            const descrCell = this.convRichText2Text(data.getCell(3).value);
            if(fromCell !== null && data.getCell(1).master !== data.getCell(2).master) {
                connection.push(
                    {
                        id: counter,
                        description: {from: descrCell.split(/ to | TO /)[0], to: descrCell.split(/ to | TO /)[1]},
                        connection: {from: fromCell, to: toCell}

                    }
                );
                counter++;
            }
        });
        return connection;
    }

    convToBuff(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (ev) => resolve(ev.target.result);
            fileReader.onerror = (err) => reject(err);
        })
    }

    convRichText2Text(text) {
        let buff = "";
        if(text !== null && typeof text.richText !== "undefined"){
            text.richText.forEach(item => buff += item.text);
        } else {
            buff = text;
        }
        return buff
    }
}

export default ReadConnection;

// const reader = new ReadConnection();
// reader.readConnectionWS().then(data => {
//     console.log(data[0].data)
// });
