import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession, signOut } from "next-auth/react";
import { DriveGoContext } from "../context/DriveGoContext";
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  setUserInformation,
  retrieveUserInformation,
  payDriver,
} from "../services/blockchain";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider, Rating } from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

function Rider() {
  const { accept } = useContext(DriveGoContext);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);
  const [value, setValue] = useState(2);

  useEffect(() => {
    async function retrieve() {
      let details = await retrieveUserInformation();
      if (details) if (!details[0]) setOpen(true);
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length > 0) {
        retrieve();
      } else {
        signOut({ redirect: "/signin" });
      }
    });

    if (window.ethereum.selectedAddress !== null) {
      retrieve();
    } else {
      signOut({ redirect: "/signin" });
    }
  }, []);

  useEffect(() => {
    if (accept === null) setBottomSheet(false);
    else setBottomSheet(true);
  }, [accept]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={async () => {
          if (phone && name && aadharNumber) {
            await setUserInformation({ name, phone, aadhar: aadharNumber });
            setOpen(false);
          }
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Josefin Sans",
            paddingTop: "24px",
          }}
          variant="h4"
        >
          User Details
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            width: "600px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TextField
            sx={{ margin: "10px", width: "250px" }}
            label="User's Name"
            type="text"
            variant="outlined"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            sx={{ margin: "10px", width: "250px" }}
            label="User's Phone"
            type="text"
            variant="outlined"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
          <TextField
            sx={{ margin: "10px", width: "250px" }}
            label="Aadhar Number"
            type="text"
            variant="outlined"
            value={aadharNumber}
            onChange={(event) => {
              setAadharNumber(event.target.value);
            }}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            sx={{
              margin: "10px",
              marginRight: "20px",
              fontFamily: "Josefin Sans",
              paddingTop: "10px",
              width: "100px",
            }}
            color="warning"
            variant="contained"
            onClick={async () => {
              if (phone && name && aadharNumber) {
                await setUserInformation({ name, phone, aadhar: aadharNumber });
                setOpen(false);
              }
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div id="mapbox">
        <Map />
      </div>
      <Head>
        <title>DriveGo | Ride Now</title>
      </Head>
      <Navbar />
      <PickupDestinationBox />
      <BottomSheet style={{ color: "black" }} open={bottomSheet}>
        <div style={{ margin: "20px" }}>
          <h1>Ongoing Rides</h1>
          {accept !== null ? (
            <div
              style={{
                borderRadius: "10px",
                background: "#efefee",
                padding: "5px",
                paddingLeft: "10px",
                fontWeight: "bold",
              }}
            >
              <p style={{ margin: "7px" }}>
                Driver : {accept.driverAddress.slice(0, 7)}......
                {accept.driverAddress.slice(35)}
              </p>
              <p style={{ margin: "7px" }}>PickUp : {accept.pickup}</p>
              <p style={{ margin: "7px" }}>DropOff : {accept.dropoff}</p>
              <p style={{ margin: "7px" }}>Amount : {accept.amount} MATIC</p>
              <p style={{ margin: "7px" }}>Rate Driver : </p>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                size="small"
                sx={{ position: "absolute", left: "132px", bottom: "70px" }}
              />
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    display: "inline-block",
                    background: "#000",
                    color: "white",
                    fontSize: "12px",
                    fontFamily: "Josefin Sans",
                    borderRadius: "10px",
                    height: "32px",
                    boxShadow: "none",
                    marginBottom: "5px",
                    "&:hover": {
                      background: "#000",
                      boxShadow: "none",
                      color: "white",
                    },
                  }}
                  onClick={async () => {
                    await payDriver({
                      driverAddr: accept.driverAddress,
                      userAddr: accept.userAddress,
                      amount: accept.amount,
                      rating: value,
                    });
                  }}
                >
                  Pay Ride
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}

export default Rider;
