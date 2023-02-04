import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import { getSession } from "next-auth/react";

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

const Trips = () => {
  return (
    <div>
      <Navbar />
      <ProfileElement />
      <h1 className="tripHeading">My Trips</h1>
      <div
        className="select_month"
        style={{ left: "410px", background: "black" }}
      >
        <p>All Trips</p>
      </div>
      <div className="select_month" style={{ left: "517px" }}>
        <p style={{ color: "black" }}>February</p>
      </div>
      <div className="select_month" style={{ left: "625px" }}>
        <p style={{ color: "black" }}>January</p>
      </div>
      <div id="tripBox"></div>
    </div>
  );
};

export default Trips;
