import Image from "next/image";
import { useContext } from "react";
import { DriveGoContext } from "../context/DriveGoContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { retrieveSpecificDriver } from "../services/blockchain";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";

const RideSelector = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const { distance, duration, drivers } = useContext(DriveGoContext);
  let newDistance = distance.slice(0, -3);

  useEffect(() => {
    if (drivers) {
      if (drivers[0].length === 0) {
        setAlertOpen(true);
      }
    }
  }, [drivers]);

  return (
    <div>
      <Snackbar
        open={alertOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ marginTop: "40px" }}
      >
        <Alert
          severity="error"
          sx={{ width: "100%", fontWeight: "bold", fontFamily: "Josefin Sans" }}
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          No Drivers Found !!!
        </Alert>
      </Snackbar>
      {drivers && duration && (
        <div style={{ color: "black" }} className="ride-select-box">
          <div>
            {drivers[0].map((car, index) => (
              <div
                key={car}
                className="car-image"
                onClick={async () => {
                  setDetails(await retrieveSpecificDriver({ address: car }));
                  setOpen(true);
                }}
              >
                <Image
                  className="box"
                  src={
                    drivers[2][index] === "Premium"
                      ? "/premium.png"
                      : "/classic.png"
                  }
                  priority="high"
                  alt=""
                  height={90}
                  width={90}
                  style={{ position: "relative", bottom: "3px" }}
                />
                <div
                  className="box"
                  style={{ position: "relative", left: "5px" }}
                >
                  <div style={{ fontWeight: "bold" }}>{drivers[2][index]}</div>
                  <div style={{ color: "#205295" }}>
                    {drivers[1][index].slice(0, 15).concat(".....")}
                  </div>
                </div>
                <div className="box">
                  <div
                    style={{
                      float: "left",
                      paddingTop: "6.5px",
                      position: "relative",
                      left: "13px",
                    }}
                  >
                    {(
                      ((drivers[2][index] === "Premium" ? 22 : 16) *
                        Number(newDistance)) /
                      100000
                    ).toFixed(5)}
                  </div>
                  <Image src="/eth.png" alt="" height={25} width={40} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {details && (
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogTitle
            variant="h5"
            sx={{ fontFamily: "Josefin Sans", paddingTop: "25px" }}
          >
            CONFIRM DRIVER
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText
              sx={{
                fontFamily: "Josefin Sans",
                fontSize: "17px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Driver : {details[0]}
            </DialogContentText>
            <DialogContentText
              sx={{
                fontFamily: "Josefin Sans",
                fontSize: "17px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Phone : {details[1]}
            </DialogContentText>
            <DialogContentText
              sx={{
                fontFamily: "Josefin Sans",
                fontSize: "17px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Location : {details[2]}
            </DialogContentText>
            <DialogContentText
              sx={{
                fontFamily: "Josefin Sans",
                fontSize: "17px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Vehicle Number : {details[4]}
            </DialogContentText>
            <DialogContentText
              sx={{
                fontFamily: "Josefin Sans",
                fontSize: "17px",
                fontWeight: "bold",
                marginLeft: "10px",
                marginRight: "10px",
              }}
            >
              Vehicle Model : {details[7]}
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              style={{ margin: "5px" }}
              variant="contained"
              color="inherit"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ margin: "5px" }}
              variant="contained"
              color="warning"
              onClick={() => {
                setOpen(false);
              }}
            >
              Book Ride
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RideSelector;
