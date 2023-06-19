import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession, signOut } from "next-auth/react";
import { DriveGoContext } from "../context/DriveGoContext";
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import BigNumber from "bignumber.js";
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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider, Rating, Snackbar, Alert } from "@mui/material";
import axios from "axios";
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
  const [connectInternet, setConnectInternet] = useState(false);
  const [userDenied, setUserDenied] = useState(false);
  const [backDrop, setBackDrop] = useState(false);

  useEffect(() => {
    async function retrieve() {
      let details = await retrieveUserInformation();
      if (details)
        if (!details[0]) {
          setOpen(true);
        } else {
          if (new BigNumber(details[3]._hex).toNumber() <= 2) {
            setUserDenied(true);
            setTimeout(() => {
              signOut({ redirect: "/signin" });
            }, 2000);
          }
        }
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

  async function AadharValidation() {
    const encodedParams = new URLSearchParams();
    encodedParams.set("captchaValue", "TK6HXq");
    encodedParams.set("captchaTxnId", "58p5MxkQrNFp");
    encodedParams.set("method", "uidvalidate");
    encodedParams.set("clientid", "111");
    encodedParams.set("txn_id", "4545533");
    encodedParams.set("consent", "Y");
    encodedParams.set("uidnumber", aadharNumber);

    const options = {
      method: "POST",
      url: "https://aadhaar-number-verification.p.rapidapi.com/Uidverifywebsvcv1/Uidverify",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY,
        "X-RapidAPI-Host": "aadhaar-number-verification.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const uuid = await axios.request(options);
      console.log(uuid.data);
      if (uuid.data.Succeeded) {
        await setUserInformation({
          name,
          phone,
          aadhar: aadharNumber,
        });
        setOpen(false);
        setBackDrop(false);
      } else {
        setBackDrop(false);
        setConnectInternet(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Backdrop sx={{ color: "#fff", zIndex: 2000 }} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={connectInternet}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontFamily: "Josefin Sans",
          }}
          onClose={() => {
            setConnectInternet(false);
          }}
        >
          Invalid Aadhar Or Phone Number
        </Alert>
      </Snackbar>
      <Snackbar
        open={userDenied}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontFamily: "Josefin Sans",
          }}
          onClose={() => {
            setUserDenied(false);
          }}
        >
          Access Denied - Low Rating
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        sx={{ color: "yellow" }}
        onClose={async () => {
          if (phone.length === 10 && name && aadharNumber) {
            setBackDrop(true);
            await AadharValidation();
          } else setConnectInternet(true);
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
            color="primary"
            size="small"
            variant="contained"
            onClick={async () => {
              if (phone.length === 10 && name && aadharNumber) {
                setBackDrop(true);
                await AadharValidation();
              } else setConnectInternet(true);
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
              <p style={{ margin: "7px" }}>
                PickUp : {accept.pickup.slice(0, -7)}
              </p>
              <p style={{ margin: "7px" }}>
                DropOff : {accept.dropoff.slice(0, -7)}
              </p>
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
                    window.location.reload();
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
