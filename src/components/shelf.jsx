import React from 'react';
import Card from "./card";
import _, {range} from 'lodash';
import DragAndDrop from "../Modules/DragAndDrop";
import {withMobileDialog} from "@material-ui/core";

const selectHighlight = "float-right border border-danger"

//@par: cardArr: an array of cards, shelfCap: card capacity of a shelf
export class Shelf extends DragAndDrop {
    state = {
        cardArr: [],
        shelfCap: 0,
        saveState: false,
        delCardRep: [],
        pendingCard: 0
    };

    prevLeftClick = false;

    emptyCard = {card: {...this.props.cardStorage.find(card => card.textLabel === "")}};

    componentDidMount() {
        this.setState({cardArr: this.props.cardArr, shelfCap: this.props.shelfCap});
        this.makeShelf(this.props.cardArr, this.props.shelfCap);
        document.addEventListener("keydown", this.handleEscEvent, false);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.cardArr !== this.state.cardArr && this.state.saveState) {
            window.confirm("Do you want to save the changes?") ? this.onSave(prevState) : this.onCancel(prevProps);
        }
        if(prevProps.cardArr !== this.props.cardArr) {
            this.makeShelf(this.props.cardArr, this.props.shelfCap);
        }
    }

    makeCardSlot(id) {
        return {id: id, ...this.emptyCard}
    }

    makeEmptyShelf(shelfCap){
        const ports = range(1, shelfCap + 1);
        const cardArr =  ports.map(elem => this.makeCardSlot(elem));
        return cardArr.concat();
    }

    makeShelf = (cardArr, shelfCap) => {
        const shelf = this.makeEmptyShelf(shelfCap);
        cardArr.forEach(elem => shelf.splice(shelf.findIndex(item => item.id === elem.id), Math.ceil(elem.card.size), elem));
        this.setState({cardArr: shelf});
    }

    addCard(nextCard, id){
        if(id + Math.ceil(nextCard.size) - 1 > this.state.shelfCap){
            alert("Out of capacity. Please select another port or shelf.");
            return;
        }

        const cardArr = this.state.cardArr.concat();
        range(0, cardArr.length) // Disassemble slots that we need to change them
            .filter(num => cardArr[num].id - id < Math.ceil(nextCard.size) && cardArr[num].id - id >= 0)
            .forEach(num => {
                const size = Math.ceil(cardArr[num].card.size);
                const repArr = range(0, size).map(item => this.makeCardSlot(cardArr[num].id + item));
                cardArr.splice(num, 1, ...repArr)
            });
        const index = cardArr.findIndex(elem => elem.id === id);
        cardArr.splice(index, Math.ceil(nextCard.size), {id: id, card: nextCard}); // Import selected card
        this.state.cardArr = cardArr.concat();
    }

    onCancel = (props) => {
        this.makeShelf(props.cardArr, props.shelfCap);
        this.setState({saveState: false, delCardRep: []});
        this.props.setChangeState(true);
    }

    onSave = (state) => {
        this.props.onSave(state.cardArr, state.delCardRep);
        this.setState({saveState: false, delCardRep: []});
        this.props.setChangeState(true);
    }

    isEmpty(){
        let counter = 0;
        this.state.cardArr.forEach(item => counter = item.card.textLabel === "" ? counter + 1 : counter);
        return counter === this.state.shelfCap;
    }

    changeCard(card, id) {
    if(this.props.canAddCard && this.state.cardArr.find(item => item.id === id).card.textLabel !== card.textLabel){
            const delRep = this.state.delCardRep.concat();
            delRep.push(id);
            this.addCard(card, id);
            this.state.saveState = true;
            this.setState(this.state, () => this.setState({delCardRep: delRep}));
            this.props.setChangeState(false);
        }
    }

    drop(ev, arr, id) {
        this.changeCard(super.drop(ev, arr), id);
    }

    handleOnCardLeftClick = (ev, id) => {
        ev.preventDefault();
        if(!this.prevLeftClick) {
            const card = this.state.cardArr.find(card => card.id === id).card;
            if (card.textLabel === "") {
                return null;
            }
            this.props.setSelectedCard(id, card);
        }
        this.prevLeftClick = false;
    }

    setPrevLeftClick = (setBoolean) => {
        this.prevLeftClick = setBoolean;
    }

    conMen(ev, id) {
        ev.preventDefault();
        this.changeCard(this.emptyCard.card, id);
    }

    calcPowerConsumption() {
        if (this.isEmpty()) return 0;
        let sum = 100;
        this.state.cardArr.forEach(item => sum += item.card.power);
        return sum;
    }

    handleEscEvent = (ev) => {
        if(ev.keyCode === 27) {
            this.props.setSelectedCard(0, this.emptyCard.card);
        }
    }

    render() {
        const visibility = (this.calcPowerConsumption() > 0 || this.props.RackPower > 0) ? "visible" : "invisible";

        return (
            <div className="App row m-0 p-0">
                    <table style={{margin: "-1px 0 0 0px"}}>
                        <tbody>
                            <tr>
                                <td>
                                    {
                                        this.state.cardArr.map(elem =>
                                        <div
                                        key={elem.id}
                                        className={"float-right"}
                                        onDragOver={this.allowDrop}
                                        onDrop={
                                            (ev) =>
                                            this.drop(ev, this.props.cardStorage, elem.id)
                                        }
                                        onContextMenu={(ev) => this.conMen(ev, elem.id)}
                                        onClick={(ev) => this.handleOnCardLeftClick(ev, elem.id)}
                                        >
                                        <Card
                                        num={elem.id}
                                        card={elem.card}
                                        selected={elem.id === this.props.selected}
                                        enums={this.props.cardEnums}
                                        setPrevClick = {this.setPrevLeftClick}
                                        onPortClick = {portId => this.props.onCardPortClick(elem.id, portId)}
                                        />
                                        </div>
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p className="border-2px margin--top--2" style={this.props.selected !== 0 ? {transform: "translateY(-4.5px)"} : {transform: "translateY(0px)"}}>FAN/HB</p>
                                </td>
                            </tr>

                        <tr>
                            <td style={{visibility: this.state.saveState ? "visible" : "hidden"}}>
                                <button type="button" className="btn btn-outline-primary m-2 btn-sm" onClick={() => this.onSave(this.state)}>save</button>
                                <button type="button" className="btn btn-outline-danger m-2 btn-sm" onClick={() => this.onCancel(this.props)}>Cancel</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                <div className={"col p-4 text-left " + visibility} style={{width: "250px"}}>
                    <div className="m-4">Shelf Power Consumption: {this.calcPowerConsumption()}</div>
                    <div className="m-4">Rack power: {this.props.RackPower + this.calcPowerConsumption()}</div>
                </div>
            </div>
        );
    };
}

export default Shelf;