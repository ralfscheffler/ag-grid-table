import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";

export default function FormDialog({
  open,
  handleClose,
  data,
  onChange,
  handleFormSubmit,
}) {
  const {
    id,
    Vorname,
    Name,
    Strasse,
    PLZ,
    Ort,
    Geburtsdatum,
    Staatsangehoerigkeit,
    Betrieb,
    farbe,
  } = data;
  //console.log(id, Vorname);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {id ? "Edit/Update" : "Neuer Mitarbeiter"}
        </DialogTitle>
        <DialogContent>
          <form>
            <TextField
              id="Vorname"
              value={Vorname}
              onChange={(e) => onChange(e)}
              placeholder="Enter Vorname"
              label="Vorname"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="Name"
              value={Name}
              onChange={(e) => onChange(e)}
              placeholder="Enter Name"
              label="Name"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="Strasse"
              value={Strasse}
              onChange={(e) => onChange(e)}
              placeholder="Enter Strasse"
              label="Strasse"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="PLZ"
              value={PLZ}
              onChange={(e) => onChange(e)}
              placeholder="Enter PLZ"
              label="PLZ"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="Ort"
              value={Ort}
              onChange={(e) => onChange(e)}
              placeholder="Enter Ort"
              label="Ort"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="Geburtsdatum"
              type="date"
              value={Geburtsdatum}
              onChange={(e) => onChange(e)}
              label="Geburtsdatum"
              variant="outlined"
              margin="dense"
            />
            <TextField
              id="Staatsangehoerigkeit"
              value={Staatsangehoerigkeit}
              onChange={(e) => onChange(e)}
              placeholder="Enter Staatsangehörigkeit"
              label="Staatsangehoerigkeit"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="Betrieb"
              value={Betrieb}
              onChange={(e) => onChange(e)}
              placeholder="Enter Betrieb"
              label="Betrieb"
              variant="outlined"
              margin="dense"
              fullWidth
            />
            <TextField
              id="farbe"
              type="color"
              value={farbe}
              onChange={(e) => onChange(e)}
              placeholder="Enter farbe"
              label="Farbe"
              variant="outlined"
              margin="dense"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => handleFormSubmit()}
            variant="contained">
            {id ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
