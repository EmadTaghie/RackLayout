import React, {Component} from 'react';
import './App.css';

import './components/CardStorage';
import CardStorage from "./components/CardStorage";
import Shelf from "./components/shelf";
import NavPanel from "./components/NavPanel.jsx";
import Popup from "./components/Popup";
import ExcelWriter from "./Modules/writeExcel";
import DownloadLink from "react-download-link";
import StationUtility from "./Modules/StationUtility";
import FormDialog from "./components/FormDialog";
import Card from "./components/card";
import _ from "lodash"

import ReadConnection from "./Modules/ReadConncction";
import WriteConnection from "./Modules/writeConnection";
import {withMobileDialog} from "@material-ui/core";

const constants = {
    RackCap: 4,
    stationPreText: {part1: "(Rack Layout)\n" + "\n" + "Node ", part2: " - "},
    error: "Error",
    submit: "Submit",
    notPending: {station: 0, Rack: 0, shelf: 0, card: {}, port: {}},
};

class App extends Component{
    stationUtility = new StationUtility([]);

    state = {
        city: [],
        selectedStation: 0,
        selectedRack: 0,
        selectedShelf: 0,
        connections: [],
        cardArr: [],
        changeState: true,
        canAddCard: false,
        selectedCard: {address: [0, 0, 0, 0], card: this.stationUtility.getCard("")},
        pendingCard: constants.notPending,
        ODF: {direction: "0", station: "0"},
        popUpData: {isOpen: {delete: false, add: false}, cardId: 0, port: ""}
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.city !== prevState.city) {
            this.stationUtility.setCity(this.state.city);
        }
        if(prevState.pendingCard !== constants.notPending && this.state.pendingCard === prevState.pendingCard && this.state.selectedStation !== prevState.pendingCard.station){
            alert("Please connect the selected card to a card or discard it for proceeding to another station.");
            this.setState(prevState);

        }
    }

    readExcel = (ev) => {
        new ReadConnection(ev.target.files[0]).then(RC => {
            console.log("connections = ", RC)
            const addr = RC.map(connections => {
                return {
                    id: connections.id,
                    name: connections.name,
                    data: this.connection2Addr(connections.data, connections.name)
                }
            });


            this.setState({city: this.createStation(addr), selectedStation: 0, selectedRack: 0, selectedShelf: 0, connections: addr}, () => {
                console.log("city = ", this.state.city)
            });
        });
    }

    setChangeState = (state) => {
        this.setState({changeState: state});
    }

    handleChange = (station, Rack, shelf) => {
        if(this.state.changeState) {
            this.setState({
                selectedStation: station,
                selectedRack: Rack,
                selectedShelf: shelf,
                cardArr: this.setCardArr(station, Rack, shelf),
                canAddCard: station !== 0 && Rack !== 0 && shelf !== 0
            });
        } else {
            alert("Please save or cancel the changes");
        }
    }

    convCardArr2ExcelShelf = (cardArr) => {
        // const selectedShelf = this.stationUtility.find(this.state.selectedStation, this.state.selectedRack, this.state.selectedShelf);
        // const startingAddr = selectedShelf.cards[0].addr;
        return cardArr.map(item => {
            return {
                id: item.id,
                name: item.card.textLabel,
                size: item.card.size,
                fill: {type: "pattern", pattern: "solid", fgColor:{argb: "00" + item.card.bgColor.split("#")[1]}}
                // addr: {row: startingAddr.row, col: startingAddr.col - item.id + 1}
                }
        });
    }

    onSave = (cardArr, deletedCardsId) => {
        const cards = cardArr.concat();
        const city = this.state.city.concat();
        const {selectedStation, selectedRack, selectedShelf} = this.state;
        const connections = this.deleteCardsConnections(deletedCardsId.map(id => {
            return {id: id, selectedRack: selectedRack, selectedShelf: selectedShelf}
        }));

        city.find(item => item.id === selectedStation).Racks.find(item => item.id === selectedRack).shelves.find(item => item.id === selectedShelf).cards = this.convCardArr2ExcelShelf(cards);
        this.setState({city: city, cardArr: cards, connections: connections})
    }

    downloadableCity = async () => {
        const excelWriter = new ExcelWriter();
        excelWriter.creatCity(this.state.city);
        return  await excelWriter.write();
    }

    downloadableConnection = async () => {
        const connectionWriter = new WriteConnection();
        connectionWriter.createConnection(this.state.connections);
        return await connectionWriter.write();
    }

    addShelf = () => {
        const city = this.state.city.concat();
        const stationUtil = new StationUtility(city);
        const Rack = stationUtil.findByReference(this.state.selectedStation, this.state.selectedRack);
        if(Rack.shelves.length >= constants.RackCap) {
            alert("the Rack has reached the maximum capacity. Please delete some shelves to continue your process.");
            return;
        }
        let shelfId = 1
        for(shelfId; shelfId < constants.RackCap + 1; shelfId++){
            const shelf = Rack.shelves.find(shelf => shelf.id === shelfId);
            if(typeof shelf === "undefined") {
                Rack.shelves.push({id: shelfId, cards: stationUtil.makeEmptyShelf(this.stationUtility.cardNum)});
                break;
            }
        }
        Rack.shelves.sort((shelf1, shelf2) => shelf1.id - shelf2.id);

        this.setState({city}, () => {
            this.handleChange(this.state.selectedStation, this.state.selectedRack, shelfId);
        });
    }

    deleteShelf = () => {
        const {selectedStation, selectedRack, selectedShelf} = this.state;
        const city = this.state.city.concat();
        const stationUtil = new StationUtility(city);
        const shelf = stationUtil.find(selectedStation, selectedRack, selectedShelf);
        const connections = this.deleteCardsConnections(shelf.cards.map(card => {
            return {id: card.id, selectedRack: selectedRack, selectedShelf: selectedShelf}
        }));
        const Rack = stationUtil.findByReference(selectedStation, selectedRack);
        Rack.shelves = Rack.shelves.filter(shelf => shelf.id !== this.state.selectedShelf);
        this.setState({city, connections}, () => {
            this.handleChange(this.state.selectedStation, this.state.selectedRack, 0);
        });
    }

    addRack = (addr) => {
        const reg = (addr) => {
            let result = false;
            if(/\r|\n|\s/.test(addr) || !/,/.test(addr)) return result;
            const rightHandedAddr = addr.split(",")[1];
            const numberSides = rightHandedAddr.split("~");
            return numberSides.length === 2 ?
                parseInt(numberSides[0]) < parseInt(numberSides[1]) && /[1-9]\d*\w,[1-9]\d*~[1-9]\d*/.test(addr) :
                /[1-9]\d*\w,[1-9]\d*/.test(addr);
        };

        if(!reg(addr)) return {status: constants.error, massage: "Please check your syntax.\nYou cannot use this syntax for defining a Rack address."};

        const city = this.state.city.concat();
        for(let i = 0; i < city.length; i++) {
            for(let j = 0; j < city[i].Racks.length; j++){
                if(city[i].Racks[j].address === addr){
                    return {status: constants.error, massage: "There is a rack with same address as the submitted Address."};
                }
            }
        }
        city.forEach(station => {
            station.Racks.forEach(Rack => {
                if(addr === Rack.address) {
                    return {status: constants.error, massage: "There is a Rack with same address as the submitted Address."};
                }
            });
        });
        const stationUtil = new StationUtility(city);
        const station = stationUtil.findByReference(this.state.selectedStation);
        const intendedId = (station.Racks[station.Racks.length - 1] || {id: 0}).id + 1;
        station.Racks.push({id: intendedId, shelves: [], address: addr});
        this.setState({city}, () => {
            this.handleChange(this.state.selectedStation, intendedId, 0);
        });

        return {status: constants.submit, massage: "Success"};
    }

    deleteRack = () => {
        let id = 1;
        const {selectedStation, selectedRack} = this.state;
        const city = this.state.city.concat();
        const stationUtil = new StationUtility(city);
        const Rack = stationUtil.find(selectedStation, selectedRack);
        const deletedCards = [];
        const station = stationUtil.findByReference(selectedStation);
        Rack.shelves.forEach(shelf => shelf.cards.forEach(card => deletedCards.push({
            selectedStation: selectedStation, selectedRack: selectedRack, selectedShelf: shelf.id, id: card.id
        })));
        const connections = this.deleteCardsConnections(deletedCards);
        station.Racks = station.Racks.filter(Rack => Rack.id !== selectedRack);
        station.Racks.forEach(Rack => {
            Rack.id = id;
            id++;
        });
        this.setState({city, connections}, () => {
            this.handleChange(selectedStation, 0, 0);
        });
    }

    addStation = text => {
        const city = this.state.city.concat();
        const connections = _.cloneDeep(this.state.connections);
        city.sort((station1, station2) => station1.id - station2.id);
        for(let i = 0; i < city.length; i++) {
            if(/*city[i].name.split(" - ")[1]*/ city[i].name === text) {
                return {status: constants.error, massage: "Please use another name.\nThere is a station with a similar name."};
            }
        }
        const stationId = (city[(city.length - 1)] || {id: 0}).id + 1;
        city.push({id: stationId, name: /*constants.stationPreText.part1 + stationId + constants.stationPreText.part2 + */text, Racks: []});
        connections.push({id: stationId, name: /*constants.stationPreText.part1 + stationId + constants.stationPreText.part2*/ text, data:[]});
        this.setState({city, connections}, () => {
            this.handleChange(stationId, 0, 0);
        });
        return {status: "Success", massage: "submitted successfully."};
    }

    deleteStation = () => {
        let city = this.state.city.concat();
        let connections = _.cloneDeep(this.state.connections);
        connections = connections.filter(station => station.id !== this.state.selectedStation);
        city = city.filter(station => station.id !== this.state.selectedStation);
        this.setState({city, connections}, () => {
            this.handleChange(0, 0, 0);
        });
    }

    connection2Addr(connections, stationName) {
        const transConnection = [];
        connections.forEach(connection => {
            const data = {id: connection.id,from: {}, to: {}}
            let cont = false;
            if (connection.description.from === "ODF") {
                const station = connection.connection.from.split(",")[0];
                data.from = {type: "ODF", cardName: "ODF", station: station, port: connection.connection.from.split(station + ",")[1]};
            } else {
                let splitFrom = connection.connection.from.split(/,/);
                splitFrom = splitFrom[0].split("-").concat(splitFrom.slice(1, splitFrom.length));
                const cardName = splitFrom[4];
                try {
                    data.from = {
                        type: "card",
                        RackAddr: splitFrom[0] + "," + splitFrom[1],
                        shelfAddr: splitFrom[2][1],
                        cardAddr: splitFrom[3].substring(1).split("~")[0],
                        cardName: cardName,
                        port: connection.connection.from.split(cardName + ",")[1],
                        size: this.stationUtility.getCard(cardName).size
                    };
                } catch (e) {
                    alert("We do not have a card with the name of " + cardName + " with address " + connection.connection.from + " in " + stationName + " station");
                }
            }

            if(connection.description.to === "ODF"){
                const station = connection.connection.to.split(",")[0];
                data.to = {type: "ODF", cardName: "ODF", station: station, port: connection.connection.to.split(station + ",")[1]};
            } else {
                let splitTo = connection.connection.to.split(/,/);
                splitTo = splitTo[0].split("-").concat(splitTo.slice(1, splitTo.length));
                const cardName = splitTo[4];
                data.to = {
                    type: "card",
                    RackAddr: splitTo[0] + "," + splitTo[1],
                    shelfAddr: splitTo[2][1],
                    cardAddr: splitTo[3].substring(1).split("~")[0],
                    cardName: cardName,
                    port: connection.connection.to.split(cardName + ",")[1],
                    size: this.stationUtility.getCard(cardName).size
                }
            }
            transConnection.push(data);
        });
        return transConnection;
    }

    convAddr2RackLayout(station) {
        const newStation = [];
        const buffStation = {...station};
        const isContain = (direction, station) => {
            return typeof station.find(item => {
                return item.RackAddr === direction.RackAddr &&
                    item.shelfAddr === direction.shelfAddr &&
                    item.cardAddr === direction.cardAddr &&
                    item.cardName === direction.cardName
            }) !== "undefined";
        }
        buffStation.data.forEach(connection => {
            if(connection.from.type === "card" && !isContain(connection.from, newStation)){
                const {RackAddr, shelfAddr, cardAddr, cardName} = connection.from;
                newStation.push({RackAddr: RackAddr, shelfAddr: shelfAddr, cardAddr: cardAddr, cardName: cardName});
            }

            if(connection.to.type === "card" && !isContain(connection.to, newStation)){
                const {RackAddr, shelfAddr, cardAddr, cardName} = connection.to;
                newStation.push({RackAddr: RackAddr, shelfAddr: shelfAddr, cardAddr: cardAddr, cardName: cardName});
            }
        });

        return this.createRack(newStation);
        // addr.forEach()
    }

    createStation = (addr) => {
        return  addr.map(station => {
            return {id: station.id, name: station.name, Racks: this.convAddr2RackLayout(station)}
        });
    }

    createRack = (station) => {
        let RackList = new Set;
        const RackMap = new Map;
        station.forEach(item => {
            RackList.add(item.RackAddr);
        });

        RackList = Array.from(RackList).sort((a, b) => {
            const compFirstPart = a.split(",")[0].localeCompare(b.split(",")[0]);
            const secPartA = a.split(",")[1].split("~")[0];
            const secPartB = b.split(",")[1].split("~")[0];
            return compFirstPart !== 0 ? compFirstPart : secPartA.length < secPartB.length ? -1 : secPartA.length > secPartB.length ? 1 : secPartA.localeCompare(secPartB);
        });

        for(let i = 0; i < RackList.length; i++) {
            RackMap.set(RackList[i], i + 1);
        }

        return RackList.map(RackAddr => {
            return {id: RackMap.get(RackAddr), address: RackAddr, shelves: this.createShelves(station.filter(item => item.RackAddr === RackAddr))}
        });
    }

    createShelves(RackData) {
        const newRackData = RackData.sort((a, b) => parseInt(a.shelfAddr) - parseInt(b.shelfAddr)).concat();
        const shelfCap = parseInt(newRackData[newRackData.length - 1].shelfAddr);
        return _.range(1, shelfCap + 1).map(shelfId => {
            return {id: shelfId, cards: this.createCards(RackData.filter(Rack => Rack.shelfAddr === shelfId.toString()).concat())}
        });
    }

    createCards(shelfData) {
        if(shelfData.length === 0) {
            return [];
        }
        const newShelfData = shelfData.sort((a, b) => parseInt(a.cardAddr) - parseInt(b.cardAddr));
        const cards = [];
        const isHKP = shelfData[0].shelfAddr === "1";
        const SC = this.stationUtility.getCard("SC");
        const IFC = this.stationUtility.getCard("IFC");
        const PWR = this.stationUtility.getCard("PWR");
        cards.push(this.setCard(SC, 1));
        cards.push(this.setCard(SC, 2));
        cards.push(this.setCard(IFC, 3));
        newShelfData.forEach(connection => {
            const {length} = cards;
            const cardAddr = parseInt(connection.cardAddr);
            cards.push(this.setCard(this.stationUtility.getCard(connection.cardName), cardAddr))
        });

        if(isHKP && typeof cards.find(card => card.id <= 13 && card.id + card.size - 1 >= 13) === "undefined") {
            const HKP = this.stationUtility.getCard("HKP");
            cards.push(this.setCard(HKP, 13));
        }

        cards.push(this.setCard(PWR, 14));
        const length = cards.length - 1;
        for(let i = 0; i < length; i++) {
            const sizeCard = Math.ceil(cards[i].size);
            const diff = cards[i + 1].id - cards[i].id - sizeCard;
            if(diff !== 0) {
                _.range(0, diff).forEach(num => cards.push(this.setCard(this.stationUtility.getCard(""), cards[i].id + sizeCard + num)));
            }
        }
        cards.sort((a, b) => a.id - b.id);
        return cards;
    }

    setCard(card, id) {
        return {
            id: id,
            name: card.textLabel,
            size: card.size,
            fill: {type: "pattern", pattern: "solid", fgColor:{argb: "00" + card.bgColor.split("#")[1]}}};
    }


    setSelectedCard = (id, card) => {
        if(id === 0) {
            this.setState({selectedCard: {address: [0, 0, 0, id], card: card}});
        }
        this.setState({selectedCard: {address: [this.state.selectedStation, this.state.selectedRack, this.state.selectedShelf, id], card: card}});
    }

    getSelectedCard() {
        return this.state.selectedCard.address[0] === this.state.selectedStation &&
            this.state.selectedCard.address[1] === this.state.selectedRack &&
            this.state.selectedCard.address[2] === this.state.selectedShelf ?
            this.state.selectedCard.address[3] : 0;
    }

    findConnection(address) {
        const RackAddr = this.stationUtility.find(address[0], address[1]).address;
        const stationConnections = (this.state.connections.find(station => station.id === address[0])||{data: []}).data;
        const connectedCards = [];

        const checkConnection = (direction) => {
            return direction.RackAddr === RackAddr &&
                direction.shelfAddr === address[2].toString() &&
                direction.cardAddr === address[3].toString()
        }

        stationConnections.forEach(connection => {
            const {from, to} = connection;
            if(checkConnection(from)){
                connectedCards.push({id: connection.id, port: from.port, connection: to});
            }

            if(checkConnection(to)){
                connectedCards.push({id: connection.id, port: to.port, connection: from});
            }
        });
        return connectedCards.sort((a, b) => a.id - b.id);
    }

    deleteCardsConnections(cardArray) {
        const {selectedStation} = this.state;
        const  connections = _.cloneDeep(this.state.connections);
        const stationConnections = connections.find(station => station.id === selectedStation).data;
        cardArray.forEach(card => {
            const {selectedRack, selectedShelf, id} = card;
            const deletedConnections = this.findConnection([selectedStation, selectedRack, selectedShelf, id]);
            // console.log("deleted con = ", deletedConnections[18]);
            deletedConnections.forEach(data => {
                const delIndex =  stationConnections.findIndex(connection => connection.id === data.id);
                if(delIndex > -1) {
                    stationConnections.splice(delIndex, 1);
                }
            });
        });
        return connections;
    }

    setCardArr = (station, Rack, shelf) => {
        return this.stationUtility.find(station,
            Rack,
            shelf)
            .cards.map(card => {
                const cardData = this.stationUtility.getCard(card.name);
                const connections = this.findConnection([station, Rack, shelf, card.id]);
                if(typeof cardData.ports !== "undefined") {
                    const {pendingCard} = this.state;
                    cardData.ports.forEach(port => {
                        if (typeof connections.find(connection => connection.port === port.Tx) !== "undefined" ||
                            typeof connections.find(connection => connection.port === port.Rx) !== "undefined") {
                            port.connected = this.stationUtility.getEnums().connected;
                        }
                        if(station === pendingCard.station &&
                            Rack === pendingCard.Rack &&
                            shelf === pendingCard.shelf &&
                            card.id === pendingCard.card.id &&
                            port.id === pendingCard.port.id){
                            port.connected = this.stationUtility.getEnums().pending;
                        }
                    });
                }
                return {id: card.id, card: cardData};
            });
    }

    onCardPortClick = (cardId, portId) => {
        const cardEnums = this.stationUtility.getEnums();
        const cardArr = _.cloneDeep(this.state.cardArr);
        const card = cardArr.find(card => card.id === cardId);
        let ports = {};
        let port = {};
        try {
            ports = _.cloneDeep(card.card.ports);
            port = ports.find(port => port.id === portId);
        } catch (e) {
            alert("There is no such a card in the network. Please try again later.");
            return;
        }

        switch (port.connected) {
            case cardEnums.connected:
                this.setState({popUpData: {isOpen: {delete: true}, cardId: cardId, port: port}});
                break;
            case cardEnums.pending:
                port.connected = cardEnums.notConnected;
                this.setState({pendingCard: constants.notPending});
                break;
            case cardEnums.notConnected:
                const {selectedStation, selectedRack, selectedShelf} = this.state;
                const {pendingCard} = this.state;
                if(pendingCard !== constants.notPending) {
                    this.setState({popUpData: {isOpen: {add: true}, cardId: cardId, port: port}});
                    break;
                }
                port.connected = cardEnums.pending;

                this.setState({pendingCard: {station: selectedStation, Rack: selectedRack, shelf: selectedShelf, card: card, port: port}});
                break;
            default:
                break;
        }
        card.card.ports = ports;
        console.log("ports = ", ports);

        this.setState({cardArr}, () => {
            console.log("cardArr = ", cardArr)
        });
    }

    deletePortConnections(cardId, port) {
        const  connections = _.cloneDeep(this.state.connections);
        const stationConnections = connections.find(station => station.id === this.state.selectedStation).data;
        const deletedConnections = this.findPortConnections(cardId, port);
        deletedConnections.forEach(data => {
            const delIndex =  stationConnections.findIndex(connection => connection.id === data.id);
            if(delIndex > -1) {
                stationConnections.splice(delIndex, 1);
            }
        });
        this.setState({connections});
        return deletedConnections.map(data => data.connection);
    }

    findPortConnections = (cardId, port) => {
        const {selectedStation,selectedRack, selectedShelf} = this.state;
        const cardConnections = this.findConnection([selectedStation, selectedRack, selectedShelf, cardId]);
        return cardConnections.filter(connection => connection.port === port.Tx || connection.port === port.Rx);
    }

    convPortClickConnection2Connections(direction) {
        const type = "card";
        const RackAddr = this.stationUtility.find(direction.station, direction.Rack).address;
        const shelfAddr = direction.shelf.toString();
        const card = direction.card;
        const cardAddr = card.id.toString();
        const cardName = card.card.textLabel;
        const size = card.card.size;
        const port = [direction.port.Tx, direction.port.Rx];
        return [{type: type, RackAddr: RackAddr, shelfAddr: shelfAddr, cardAddr: cardAddr, cardName: cardName, size: size, port: port[0]},
            {type: type, RackAddr: RackAddr, shelfAddr: shelfAddr, cardAddr: cardAddr, cardName: cardName, size: size, port: port[1]}]
    }

    convODFConnection2Connections = () => {
        const {direction, station} = this.state.ODF;
        const type = "ODF";
        const cardName = "ODF";
        const preText = direction === "from" ? "Client to " : "Line to ";
        const stationName = preText + station;
        const port = ["Tx", "Rx"];
        return [
            {type: type, cardName: cardName, station: stationName, port: port[0]},
            {type: type, cardName: cardName, station: stationName, port: port[1]}
        ];
    }

    //  port: "Line,Tx"
    addCardConnection(from, to) {
        const connections = _.cloneDeep(this.state.connections);
        const connectionData = connections.find(station => station.id === from.station).data;
        const fromAddr = this.convPortClickConnection2Connections(from);
        const toAddr = this.convPortClickConnection2Connections(to);
        let id = 1;
        try {
            id = connectionData[connectionData.length - 1].id + 1;
        } catch (e) {
            id = 1;
        }
        connectionData.push({id: id, from: fromAddr[0], to: toAddr[1]});
        connectionData.push({id: id + 1, from: fromAddr[1], to: toAddr[0]});
        this.setState({connections});

    }

    getStationNames() {
        const stationNames = new Set;
        this.state.city.forEach(station => {
            stationNames.add(station.name);
        });

        this.state.connections.forEach(station => station.data.forEach(connection => {
            const {from, to} = connection;
            if(from.type === "ODF") {
               stationNames.add(from.station.split(/ to | TO | To/)[1]);
            }

            if(to.type === "ODF") {
                stationNames.add(to.station.split(/ to | TO | To/)[1]);
            }
        }));

        return [...stationNames].sort((a, b) => a.localeCompare(b));

    }

    onChangeODFDirection = (ev) => {
        const ODF = {...this.state.ODF};
        ODF.direction = ev.target.value;
        this.setState({ODF: ODF});
    }

    onChangeODFStation = (ev) => {
        const ODF = {...this.state.ODF};
        ODF.station = ev.target.value;
        this.setState({ODF: ODF});
    }

    onClickedODF = () => {
        const {direction, station} = this.state.ODF;
        const {pendingCard} = this.state;
        if(direction === "0" || station === "0") {
            alert("Please select appropriate items.");
            return null;
        }
        const connections = _.cloneDeep(this.state.connections);
        const connectionData = connections.find(station => station.id === pendingCard.station).data;
        const id = connectionData[connectionData.length - 1].id + 1;
        const cardConnection = this.convPortClickConnection2Connections(pendingCard);
        const ODFConnection = this.convODFConnection2Connections();
        const from = direction === "from" ? ODFConnection : cardConnection;
        const to = direction === "to" ? ODFConnection : cardConnection;
        connectionData.push({id: id, from: from[0], to: to[1]});
        connectionData.push({id: id + 1, from: from[1], to: to[0]});
        this.setState({connections: connections, pendingCard: constants.notPending}, () => {
            const {selectedStation, selectedRack, selectedShelf} = this.state;
            if(selectedStation === pendingCard.station && selectedRack === pendingCard.Rack && selectedShelf === pendingCard.shelf){
                const cardArr = _.cloneDeep(this.state.cardArr);
                cardArr.find(card => card.id === pendingCard.card.id).card.ports
                    .find(port => port.id === pendingCard.port.id).connected = this.stationUtility.getEnums().connected;
                this.setState({cardArr});
            }
        });
    }

    onPopUpClose = () => {
        this.setState({popUpData: {isOpen: {delete: false, add: false}, cardId: 0, port: ""}});
    }

    onDeletePortSubmit = () => {
        const {selectedStation, selectedRack} = this.state;
        const popUpData = _.cloneDeep(this.state.popUpData);
        const cardArr = _.cloneDeep(this.state.cardArr);
        const RackName = this.stationUtility.find(selectedStation, selectedRack).address;
        const deletedConnections = this.deletePortConnections(popUpData.cardId, popUpData.port);
        const card = cardArr.find(card => card.id === popUpData.cardId);
        const port = card.card.ports.find(port => port.id === popUpData.port.id);
        deletedConnections.forEach(connection => {
            if(connection.RackAddr === RackName && parseInt(connection.shelfAddr) === this.state.selectedShelf) {
                const deletedCard = cardArr.find(card => card.id === parseInt(connection.cardAddr)).card;
                if(typeof deletedCard !== "undefined") {
                    deletedCard.ports.find(port => port.Tx === connection.port || port.Rx === connection.port).connected = this.stationUtility.getEnums().notConnected;
                }
            }
        })
    port.connected = this.stationUtility.getEnums().notConnected;
        this.onPopUpClose();
        this.setState({cardArr});
    }

    onAddPortSubmit = () => {
        const {selectedStation, selectedRack, selectedShelf} = this.state;
        const popUpData = _.cloneDeep(this.state.popUpData);
        const pendingCard = _.cloneDeep(this.state.pendingCard);
        const cardArr = _.cloneDeep(this.state.cardArr);
        const card = cardArr.find(card => card.id === popUpData.cardId);
        const port = card.card.ports.find(port => port.id === popUpData.port.id);
        const cardEnums = this.stationUtility.getEnums();
        if(pendingCard.station === selectedStation &&
            pendingCard.Rack === selectedRack &&
            pendingCard.shelf === selectedShelf
        ){
            cardArr.find(card => card.id === pendingCard.card.id).card.ports
                .find(port => port.id === pendingCard.port.id).connected = cardEnums.connected;
        }
        port.connected = cardEnums.connected;
        const to = {station: selectedStation, Rack: selectedRack, shelf: selectedShelf, card: card, port: port}
        this.addCardConnection(pendingCard, to);
        this.onPopUpClose();
        this.setState({cardArr: cardArr, pendingCard: constants.notPending});
    }

    convAddr2Connection = (address) => {
        const addr = {...address};
        if(addr.type === "ODF") {
            return addr.station.split(/ to | TO /)[1] + " ODF";
        } else if(addr.type === "card") {
            const splicedPort = addr.port.split(",");
            const port = splicedPort.length === 2 ? splicedPort[0] : splicedPort[0].split("x")[1];
            return addr.RackAddr +
                ",C" + addr.shelfAddr +
                ",S" + addr.cardAddr + (addr.size > 1 ? "~" + (parseInt(addr.cardAddr) + addr.size - 1).toString() : "") +
                "," + addr.cardName +
                ",P" + port;
        }
    }

    createPopUp = (content, onSubmit, onClose) => {
        return <Popup handleClose={onClose} content={
            <div>
                {content}
                <div className="row float-right">
                    <button type="button" className="btn margin--right--5" onClick={onSubmit}>Submit</button>
                    <button type="button" className="btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        }/>
    }

    render()
    {
        const {selectedCard} = this.state;
        // const card = this.stationUtility.getCard("TP2X-A");
        return (
            <div className="row">
                <div className="col-1 p-0" style={{margin: "0 42px 0 15px"}}>
                    <CardStorage cardArray={this.stationUtility.cardStorageArr}/>
                </div>
                <div className="col p-0" style={{width: "100%"}}>
                    <div className="row">
                        <div className="col nav-panel p-0 m-0" style={{width: "100%"}}>
                            <NavPanel
                                readExcel={this.readExcel}
                                handleChange={this.handleChange}
                                find={this.stationUtility.find}
                                state={this.state}
                                addShelf={this.addShelf}
                                deleteShelf={this.deleteShelf}
                                addRack={this.addRack}
                                deleteRack={this.deleteRack}
                                addStation={this.addStation}
                                deleteStation={this.deleteStation}
                                downloadableCity={this.downloadableCity}
                                downloadableConnection={this.downloadableConnection}
                            />
                        </div>
                    </div>
                {/*<div className="row col-10">*/}
                {/*    /!*<div className="col-5">*!/*/}
                {/*    /!*<DownloadLink style={{textDecoration: "none", cursor: "pointer", backgroundColor: "transparent", border: "solid 2px goldenrod", color: "goldenrod"}}tagName="button" label="Download" filename="file.xlsx" exportFile={this.downloadableCity}/>*!/*/}
                {/*    /!*<DownloadLink label="Download Connections" filename="connection.xlsx" exportFile={this.downloadableConnection}/>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*    <div className="col-5" style={{marginLeft: "-25px"}}>*/}
                {/*        <div className="row">*/}
                {/*            ODF: &nbsp;*/}
                {/*            <select*/}
                {/*                value={this.state.ODF.direction}*/}
                {/*                onChange={this.onChangeODFDirection}*/}
                {/*                className="form-select"*/}
                {/*                style={{width: "100px"}}*/}
                {/*                aria-label=".form-select-sm example"*/}
                {/*            >*/}
                {/*                <option value="0">Direction</option>*/}
                {/*                <option value="from">from</option>*/}
                {/*                <option value="to">to</option>*/}
                {/*            </select>*/}

                {/*            <select className="form-select"*/}
                {/*                    value={this.state.ODF.station}*/}
                {/*                    onChange={this.onChangeODFStation}*/}
                {/*                    style={{marginLeft: "5px"}}*/}
                {/*                    aria-label=".form-select-sm example"*/}
                {/*            >*/}
                {/*                <option value="0">Station</option>*/}
                {/*                {this.getStationNames().map(stationName => <option key={stationName} value={stationName}>{stationName}</option>)}*/}
                {/*            </select>*/}
                {/*            <button*/}
                {/*                type="button"*/}
                {/*                className="btn btn-sm"*/}
                {/*                onClick={this.onClickedODF}*/}
                {/*                style={{marginLeft: "10px"}}*/}
                {/*                disabled={this.state.pendingCard === constants.notPending}*/}
                {/*            >*/}
                {/*                connect*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row m-0 p-0">
                    <Shelf
                        className={"col"}
                        cardArr={this.state.cardArr}
                        // cardArr={this.cArr}
                        shelfCap={this.stationUtility.cardNum}
                        drop={this.drop}
                        cardStorage={this.stationUtility.cardStorageArr}
                        onSave={this.onSave}
                        setChangeState={(state) => this.setChangeState(state)}
                        canAddCard={this.state.canAddCard}
                        RackPower={this.stationUtility.calcRackPower(this.state.selectedStation, this.state.selectedRack, this.state.selectedShelf)}
                        selected={this.getSelectedCard()}
                        setSelectedCard={this.setSelectedCard}
                        cardEnums={this.stationUtility.getEnums()}
                        onCardPortClick={this.onCardPortClick}
                    />
                    <div className="col m-0 p-0" style={{width: "30px"}}>
                        <FormDialog
                            className="btn btn-sm btn-primary height-25 labeled-button"
                            buttonText={{sign: "Connection Details"}}
                            title="Connection Details"
                            hidden={true}
                            disabled={selectedCard.address[3] === 0}
                        >
                            <div className="row">
                                <p>
                                    Selected card:
                                    <br/>
                                    <Card
                                        num={selectedCard.address[3]}
                                        card={selectedCard.card}
                                        enums={this.stationUtility.getEnums()}
                                    />
                                </p>
                                &emsp;
                                <p className="col-8">
                                    <br/>Details:
                                    <br/>&emsp;Station name: {this.stationUtility.find(selectedCard.address[0]).name.split(" - ")[1]}
                                    <br/>&emsp;Rack address: {this.stationUtility.find(selectedCard.address[0], selectedCard.address[1]).address}
                                    <br/>&emsp;Rack number: {selectedCard.address[1]}
                                    <br/>&emsp;Shelf number: {selectedCard.address[2]}
                                    <br/>&emsp;Card number: {selectedCard.address[3]}
                                    <br/>&emsp;Card name: {selectedCard.card.textLabel}
                                    <br/><br/>Connections:
                                    {this.findConnection(this.state.selectedCard.address).map(data => {
                                        const {connection} = data;
                                        if(connection.type === "card") {
                                            return <React.Fragment><br/>&emsp;{data.port} to {connection.RackAddr},C{connection.shelfAddr},S{connection.cardAddr},{connection.cardName},{connection.port}
                                            </React.Fragment>
                                        }
                                        return <React.Fragment><br/>&emsp;{data.port} to {connection.station},{connection.port}</React.Fragment>
                                    })}
                                </p>
                            </div>
                        </FormDialog>
                    </div>
                    <div className="col" style={{marginLeft: "-25px"}}>
                        <div className="row" style={{marginLeft: "280px"}}>
                            ODF: &nbsp;
                            <select
                                value={this.state.ODF.direction}
                                onChange={this.onChangeODFDirection}
                                className="form-select"
                                style={{width: "100px"}}
                                aria-label=".form-select-sm example"
                            >
                                <option value="0">Direction</option>
                                <option value="from">from</option>
                                <option value="to">to</option>
                            </select>

                            <select className="form-select"
                                    value={this.state.ODF.station}
                                    onChange={this.onChangeODFStation}
                                    style={{marginLeft: "5px"}}
                                    aria-label=".form-select-sm example"
                            >
                                <option value="0">Station</option>
                                {this.getStationNames().map(stationName => <option key={stationName} value={stationName}>{stationName}</option>)}
                            </select>
                            <button
                                type="button"
                                className="btn btn-sm"
                                onClick={this.onClickedODF}
                                style={{marginLeft: "10px"}}
                                disabled={this.state.pendingCard === constants.notPending}
                            >
                                connect
                            </button>
                        </div>
                    </div>
                    {this.state.popUpData.isOpen.delete && this.createPopUp(<p>This port is connected to {this.convAddr2Connection(
                        this.findPortConnections(this.state.popUpData.cardId, this.state.popUpData.port)[0].connection
                    )}.
                        <br/>Press submit button for deleting the port.</p>,
                        this.onDeletePortSubmit,
                        this.onPopUpClose)
                    }
                    {
                        this.state.popUpData.isOpen.add && this.createPopUp(<p>Press submit if you want to add {
                                this.convAddr2Connection(this.convPortClickConnection2Connections(this.state.pendingCard)[0])
                        } to {
                                this.convAddr2Connection(this.convPortClickConnection2Connections({
                                    station: this.state.selectedStation,
                                    Rack: this.state.selectedRack,
                                    shelf: this.state.selectedShelf,
                                    card: this.state.cardArr.find(card => card.id === this.state.popUpData.cardId),
                                    port: this.state.popUpData.port
                                })[0])
                            }?
                        </p>,
                            this.onAddPortSubmit,
                            this.onPopUpClose)
                    }
                </div>

                {/*<Card*/}
                {/*    num={1}*/}
                {/*    card={card}*/}
                {/*/>*/}
                </div>
            </div>
        );
    }
}

export default App;
