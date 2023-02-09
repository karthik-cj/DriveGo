import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import ProfileElement from "../components/ProfileElement";

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

const About = () => {
  return (
    <div>
      <Navbar />
      <ProfileElement />
      <img className="aboutImg" src={"/about.jpg"} width={550} />
      <div className="aboutHeading" style={{ textAlign: "center" }}>
        <h1 style={{ color: "black" }}>About Us</h1>
      </div>
      <div className="aboutText">
        DriveGo is a decentralized, peer-to-peer transportation platform built
        on blockchain technology. Our mission is to provide a more efficient,
        secure, and transparent alternative to traditional ride-hailing
        services. This means lower fees for riders, better pay for drivers, and
        a more democratic and equitable transportation ecosystem. This gives
        both riders and drivers peace of mind, knowing that their personal and
        financial information is protected. Join us on our journey to
        revolutionize the transportation industry and help create a more
        sustainable future.
      </div>
    </div>
  );
};

export default About;
