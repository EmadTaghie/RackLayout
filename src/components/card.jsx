import React, {Component} from 'react';
import './card.css'
import _ from "lodash"

class Card extends Component {
    makeTable = () => {
        const {textLabel, bgColor, size, url} = this.props.card;
        // const textLength = "translateY(" + textLabel.length * 3.6 + "px)  rotate(-90deg)";
        let k = [];
        let tr = [];
        const fractionCoEf = Math.ceil(1/size)
        const border = "border-2px" + (this.props.selected ? "-red" : "");
        for(let i = 0; i < size; i++) {
            k.push(<th key={i} style={{transform: "0px 10px 0p 0px"}} className={border + " width-25 text-center"}>{this.props.num + Math.ceil(size) - i - 1}</th>);
        }

        // for(let i = 0; i < Math.ceil(1/size); i++) {
        //     tr.push(<tr key={this.props.id*2} id={this.props.id}>
        //         <td colSpan={size} className={"text-nowrap width-25 border-top-2px height-" + 250/fractionCoEf} style={
        //         {
        //             backgroundColor: bgColor
        //         }
        //     }>{<section style={{transform: textLength}}>{textLabel}</section>}</td>
        //     </tr>);
        // }

        for(let i = 0; i < Math.ceil(1/size); i++) {
            const width = 55*Math.ceil(size);
            const height = 300/fractionCoEf - 5;
            tr.push(<tr key={this.props.num + i} id={this.props.num}>
                <td colSpan={size} className={"text-nowrap width-25 " + border + "-top height-" + 250/fractionCoEf}>
                    <div style={{position: "relative"}}>
                        <img src={url} width={width} height={height} alt={textLabel}/>
                        {this.makeButtons(width, height)}
                    </div>
                </td>
            </tr>);
        }

        return <table className={"margin--1 " + border}>
            <tbody>
            <tr>
                {k}
            </tr>
            {/*<tr>*/}
                {tr}
                {/*<td colSpan={Math.ceil(size)} className={"width-25 border-2px text-nowrap height-" + 50/Math.ceil(1/size)} style={*/}
                {/*    {*/}
                {/*        backgroundColor: bgColor,*/}
                {/*    }*/}
                {/*}>{<section style={{transform: textLength}}>{textLabel}</section>}</td>*/}
            {/*</tr>*/}
            </tbody>
        </table>
    }

    makeButtons = (width, height) => {
        if(typeof this.props.card.ports !== "undefined") {
            const ports = this.calcDims(this.props.card.ports, width, height);
            return ports.map(port => {
                const butBorder = port.connected === this.props.enums.notConnected ? "" :
                    port.connected === this.props.enums.pending ? "button--red--border" : "button--green--border";
                return <button key={port.id} type="button" onClick={(ev) => this.onClicked(ev, port.id)} className={"mp2xP--button " + butBorder} style={{
                    width: port.width, height: port.height,
                    transform: "translate(" + (port.pos.width - width) + "px, " + port.pos.height + "px)"
                }}/>
            });
        }
    }

    onClicked = (ev, id) => {
        ev.preventDefault();
        if(typeof this.props.setPrevClick === "function") {
            this.props.setPrevClick(true);
            this.props.onPortClick(id);
        }
    }

    calcDims(ports, width, height) {
        const newPorts = _.cloneDeep(ports);
        newPorts.forEach(port => {
            port.width *= width;
            port.height *= height;
            port.pos.width *= width;
            port.pos.height *= height;
        });
        return newPorts;
    }

    render() {
        return (
            this.makeTable()
        );
    }
}

export default Card;