import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession } from "next-auth/react";
import RideSelector from "../components/RideSelector";
import Head from "next/head";

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
  return (
    <div>
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
