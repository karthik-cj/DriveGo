import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession } from "next-auth/react";
import RideSelector from "../components/RideSelector";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  setUserInformation,
  retrieveUserInformation,
} from "../services/blockchain";
import DialogTitle from "@mui/material/DialogTitle";
import { Divider } from "@mui/material";
// import { BottomSheet } from "react-spring-bottom-sheet";
// import "react-spring-bottom-sheet/dist/style.css";

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
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [bottomSheet, setBottomSheet] = useState(false);

  useEffect(() => {
    if (window.ethereum.selectedAddress === null) {
      setAlertOpen(true);
    } else retrieve();
    async function retrieve() {
      let details = await retrieveUserInformation();
      if (!details[0]) setOpen(true);
    }
  }, []);

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
          Connect To Metamask Wallet !!!
        </Alert>
      </Snackbar>
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
          sx={{ fontFamily: "Josefin Sans", paddingTop: "24px" }}
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
      <RideSelector />
      {/* <button onClick={() => setBottomSheet(true)}>Open bottom sheet</button>
      <BottomSheet
        style={{ color: "black" }}
        open={bottomSheet}
        onDismiss={() => {
          setBottomSheet(false);
        }}
      >
        <h1 style={{ margin: "20px" }}>Ongoing Rides</h1>
      </BottomSheet> */}
    </div>
  );
}

export default Rider;
