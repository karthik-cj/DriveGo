import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession } from "next-auth/react";
import RideSelector from "../components/RideSelector";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (window.ethereum.selectedAddress === null) {
      setAlertOpen(true);
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
      <div id="mapbox">
        <Map />
      </div>
      <Head>
        <title>DriveGo | Ride Now</title>
      </Head>
      <Navbar />
      <PickupDestinationBox />
      <RideSelector />
    </div>
  );
}

export default Rider;
