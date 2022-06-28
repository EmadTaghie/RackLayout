import React, {Component} from "react";
import "./card.css";
import FormDialog from "./FormDialog";
import DownloadLink from "react-download-link";

class NavPanel extends Component {
    addButtProperties = "pad--0 margin-t-b-1 text-center golden--btn cursor";
    dellButtProperties = "margin-t-b-1 pad--0 text-center golden--btn cursor";
    displayConstrain(city, station, rack, shelf) {
        const checkCity = city ? this.props.state.city.length > 0: true;
        const checkStation = station ? this.props.state.selectedStation > 0 : true;
        const checkRack = rack ? this.props.state.selectedRack > 0 : true;
        const checkShelf = shelf ? this.props.state.selectedShelf > 0 : true;
        return checkCity && checkStation && checkRack && checkShelf;
    }
    render() {
        return (
            <div className="row" style={{marginLeft: "10px"}}>
                <select value={this.props.state.selectedStation}
                        className="m-2 golden--select"
                        onChange={
                            (ev) =>
                            this.props.handleChange(parseInt(ev.target.value), 0, 0)
                        }
                >
                    <option value={0}>Select a station</option>
                    {this.props.state.city.map(station =>
                        <option
                            key={station.id}
                            value={station.id}
                        >
                            {station.name}
                        </option>)
                    }
                </select>
                <div>
                    <FormDialog
                        className={this.addButtProperties}
                        buttonText={{sign: "+", text: "add"}}
                        title={"Add new Station"}
                        desiredFunc={this.props.addStation}
                        label="Station"
                        disabled={!this.displayConstrain(false,false, false, false)}
                    >
                        Enter the name of Station that you want to add.
                    </FormDialog>
                    <button type="button" onClick={this.props.deleteStation} className={this.dellButtProperties} disabled={!this.displayConstrain(true, true, false, false)}>-</button>
                </div>

                <select className="m-2 golden--select" value={this.props.state.selectedRack}
                        onChange={(ev) =>
                            this.props.handleChange(this.props.state.selectedStation, parseInt(ev.target.value), 0)
                        }>
                    <option value={0}>Select a Rack</option>
                    {
                        this.props.find(this.props.state.selectedStation).Racks
                            .map(Rack => <option key={Rack.id} value={Rack.id}>{Rack.id + " - " + Rack.address}</option>)
                    }
                </select>
                <div>
                    <FormDialog
                        className={this.addButtProperties}
                        buttonText={{sign: "+", text: "add"}}
                        title={"Add new Rack"}
                        desiredFunc={this.props.addRack}
                        label="Rack Address"
                        disabled={!this.displayConstrain(true, true, false, false)}
                    >
                        Enter the Address of the Rack that you want to add.
                    </FormDialog>
                    <button type="button" onClick={this.props.deleteRack} className={this.dellButtProperties} disabled={!this.displayConstrain(true, true, true, false)}>-</button>
                </div>

                <select className="m-2 golden--select"
                        value={this.props.state.selectedShelf}
                        onChange={(ev) =>
                            this.props.handleChange(
                                this.props.state.selectedStation,
                                this.props.state.selectedRack,
                                parseInt(ev.target.value)
                            )
                        }>
                    <option value={0}>Select a Shelf</option>
                    {
                        this.props.find(this.props.state.selectedStation, this.props.state.selectedRack)
                            .shelves.map(shelf => <option key={shelf.id}
                                                     value={shelf.id}
                        >
                            {shelf.id}
                        </option>)
                    }
                </select>
                <div>
                    <button type="button" onClick={this.props.addShelf} className={this.addButtProperties} disabled={!this.displayConstrain(true, true, true, false)}>+</button>
                    <br/>
                    <button type="button" onClick={this.props.deleteShelf} className={this.dellButtProperties} disabled={!this.displayConstrain(true, true, true, true)}>-</button>
                </div>
                    <DownloadLink
                        style={{textDecoration: "none", cursor: "pointer", backgroundColor: "transparent",
                            border: "solid 2px goldenrod", color: "goldenrod", height: "30px", margin:"8px", verticalAlign: "middle"}}
                        tagName="button"
                        label="Download Rack-Layout"
                        filename="file.xlsx"
                        exportFile={this.props.downloadableCity}/>
                        <DownloadLink style={{textDecoration: "none", cursor: "pointer", backgroundColor: "transparent", border: "solid 2px goldenrod", color: "goldenrod", height: "30px", margin:"8px", verticalAlign: "middle"}} tagName="button" label="Download Connections" filename="connection.xlsx" exportFile={this.props.downloadableConnection}/>
                <input type="file" id="file" className="m-2" onChange={this.props.readExcel} style={{display: "none"}}/>
                <label className="btn btn-sm m-2" type="button" htmlFor="file"
                       style={{backgroundColor: "#E6E6E6", height: "80%"}}>Upload File</label>
            </div>
            );
    }
}

export default NavPanel;