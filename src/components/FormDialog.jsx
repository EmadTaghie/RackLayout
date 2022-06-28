import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from "@material-ui/core";
import "./card.css"

export default function FormDialog({children, className, buttonText, title, desiredFunc, label, hidden = false, disabled = false}) {
    const [open, setOpen] = React.useState(false);
    let text = "";

    const handleClickOpen = () => {
        setOpen(true);
        console.log("disable type = ", hidden)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnSubmit = () => {
        const info = desiredFunc(text);
        if(info.status === "Error") {
            alert(info.massage);
            return null;
        }
        handleClose();
    };

    const onTextFieldChange = (ev) => {
        text = ev.target.value;
    }

    const useStyles = makeStyles(() => ({
        paper: {minWidth: "500px"}
    }))

    return (
        <div>
            <button type="button" className={className} onClick={handleClickOpen} disabled={disabled}>
                {buttonText.sign}
            </button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {children}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={label}
                        type="name"
                        onChange={onTextFieldChange}
                        fullWidth
                        hidden={hidden}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleOnSubmit} color="primary" hidden={hidden}>
                        {buttonText.text}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
