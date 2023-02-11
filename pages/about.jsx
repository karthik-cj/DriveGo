import Navbar from "../components/Navbar";
import { getSession } from "next-auth/react";
import ProfileElement from "../components/ProfileElement";
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

const About = () => {
  return (
    <div>
      <Head>
        <title>DriveGo | About</title>
      </Head>
      <Navbar />
      <ProfileElement />
      {/* <img className="aboutImg" src={"/about.jpg"} width={750} />
      <div className="aboutHeading" style={{ textAlign: "center" }}>
        <p>ABOUT US</p>
      </div>
      <div className="aboutText">
        DriveGo is a decentralized, peer-to-peer transportation platform built
        on blockchain technology. Our mission is to provide a more efficient,
        secure, and transparent alternative to traditional ride-hailing
        services. This means lower fees for riders, better pay for drivers, and
        a more democratic and equitable transportation ecosystem.Join us on our
        journey to revolutionize the transportation industry and help create a
        more sustainable future.
      </div> */}
      <div className="about">
        <div className="inner-container">
          <h1>About Us</h1>
          <p className="text">
            DriveGo is a decentralized, peer-to-peer transportation platform
            built on blockchain technology. Our mission is to provide a more
            efficient, secure, and transparent alternative to traditional
            ride-hailing services. This means lower fees for riders, better pay
            for drivers, and a more democratic and equitable transportation
            ecosystem. Join us on our journey to revolutionize the
            transportation industry and help create a more sustainable future.
          </p>
          <div className="skills">
            <span>Web Design</span>
            <span>Photoshop & Illustrator</span>
            <span>Coding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
