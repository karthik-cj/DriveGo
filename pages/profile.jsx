import { getSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";
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

const Profile = ({ user }) => {
  return (
    <div>
      <Head>
        <title>DriveGo | Profile</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div id="profile">
        <div>
          <div className="image">
            <img src="/login.png" width={45} />
          </div>
          <h1 className="profile_name">Karthik CJ</h1>
          <h3 className="profile_no">+916282725045</h3>
        </div>
        <br />
        <label>Identification</label>
        <p>{user.id}</p>
        <label>Address</label>
        <p>{user.address}</p>
        <label>Domain</label>
        <p>{user.domain}</p>
        <label>Chain Id</label>
        <p>{user.chainId}</p>
        <label>Nonce</label>
        <p>{user.nonce}</p>
        <button
          className="logout"
          onClick={() => signOut({ redirect: "/signin" })}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
