const _ = require("lodash");
const CardData = require("../components/CardData").default;

class StationUtility {
    city = [];
    cardData = new CardData();
    // "SC"/, "OS5"/, "IFC"/, "HKP"/, "OA-BAP2"/, "OA-PAP2"/, "OAR-RAM2"/, "OCM"/, "WS4"/, "SM2"/, "TP2X"/, "TP2X-A"/,
    // "MP2X"/, "MP2X Plus"/, "MP2X+", "MD48"/, "MD48-E"/, "MD48-O"/, "MP1H"/, "DCM"/, "PWR"/, "OA"/,"FIM"/,"WS9"/,""/,
    cardStorageArr = this.cardData.getCardArr();

    cardNum = 14;

    constructor(city) {
        this.setCity(city);
    }

    setCity = (city) => {
        this.city = city.concat();
    }

    getCard = (cardName) => {
        return _.cloneDeep(this.cardStorageArr.find(item => item.textLabel === cardName));
    }

    getEnums() {
        return this.cardData.getEnums();
    }

    convHexToArgb = (hex) =>{
        return "00" + hex.split("#")[1];
    }

    makeEmptyCard = () => {
        const emptyCard = this.getCard("");
        return {
            name: emptyCard.textLabel,
            size: emptyCard.size,
            fill: {type: "pattern", pattern: "solid", fgColor:{argb: this.convHexToArgb(emptyCard.bgColor)}}
        };
    }

    makeEmptyShelf = (shelfCap) => {
        return _.range(1, shelfCap + 1).map(num => {
            return {
                id: num,
                ...this.makeEmptyCard()
            }
        })
    }

    find = (stationId, RackId, shelfId) => {
        return _.cloneDeep(this.findByReference(stationId, RackId, shelfId));
    }

    findByReference= (stationId, RackId, shelfId) => {
        let data = this.city.find(item => item.id === stationId)||{name: "", Racks: []};
        data = typeof RackId === "undefined" ? data : data.Racks.find(item => item.id === RackId)||{address: "", shelves:[]};
        data = typeof shelfId === "undefined" ? data : data.shelves.find(item => item.id === shelfId)||{cards: []};
        return data;
    }

    isEmpty(stationId, RackId, shelfId) {
        if(stationId ===0 || RackId ===0 || shelfId === 0) return true;
        let counter = 0;
        this.find(stationId, RackId, shelfId).cards.forEach(card => counter += card.name === "" ? 1 : 0);
        return counter === this.cardNum
    }

    isEmptyByShelf(shelf) {
        let counter = 0;
        shelf.cards.forEach(card => counter += card.name === "" ? 1 : 0);
        return counter === this.cardNum
    }

    calcRackPower = (selectedStation, selectedRack, selectedShelf) => {
        const RackData = this.find(selectedStation, selectedRack);
        let sum = 0;
        if (RackData.shelves.length === 0) return sum;
        RackData.shelves.forEach(shelf => {
            if (shelf.id !== selectedShelf) {
                sum += this.calcShelfPower(selectedStation, selectedRack, shelf.id);
            }
        });
        return sum;
    }
    calcRackPowerByRack = (Rack) => {
        let sum = 0;
        if (Rack.shelves.length === 0) return sum;
        Rack.shelves.forEach(shelf => sum += this.calcShelfPowerByShelf(shelf));
        return sum;
    }

    calcShelfPower = (selectedStation, selectedRack, selectedShelf) => {
        if (this.isEmpty(selectedStation, selectedRack, selectedShelf)) return 0;
        let sum = 100;
        this.find(selectedStation, selectedRack, selectedShelf).cards.forEach(card => sum += this.getCard(card.name).power);
        return sum;
    }

    calcShelfPowerByShelf = (shelf) => {
        if(this.isEmptyByShelf(shelf)) return 0;
        let sum = 100;
        shelf.cards.forEach(card => sum += this.getCard(card.name).power);
        return sum;
    }

    findConnectedCards(connections, selectedCard){
        const RackAddr = this.find(selectedCard.address[0], selectedCard.address[1]).address;
        const connectionDetails = {from: [], to: []};
        connections.forEach(connection => {
            const {from, to} = connection;
            if(from.type === "card" && from.RackAddr === RackAddr && from.shelfAddr === selectedCard.address[2].toString() && from.cardAddr === selectedCard.address[3].toString()){
                const station = this.find(selectedCard.address[0]);
                console.log("to = ", to);
                connectionDetails.to.push(to.type === "card" ? {
                    station: station.name.split(" - ")[1],
                    RackNum: station.Racks.find(Rack => Rack.address === to.RackAddr).id,
                    ...to
                } : {
                    ...to
                });
            }
        })
    };
}

export default StationUtility;
