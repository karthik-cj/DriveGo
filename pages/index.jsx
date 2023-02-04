import Navbar from "../components/Navbar";
import Map from "../components/Map";
import PickupDestinationBox from "../components/PickupDestinationBox";
import { getSession } from "next-auth/react";
import RideSelector from "../components/RideSelector";

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
      <Navbar />
      <PickupDestinationBox />
      <RideSelector />
      <div id="mapbox">
        <Map />
      </div>
    </div>
  );
}

export default Rider;
