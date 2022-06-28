import {Component} from 'react';
export class DragAndDrop extends Component{
    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev, id) {
        ev.dataTransfer.setData("id", id);
    }

    drop (ev, arr) {
        ev.preventDefault();
        const id = ev.dataTransfer.getData("id");
        return {...arr.filter(item => item.id === id)[0]};
    }
}

export default DragAndDrop;