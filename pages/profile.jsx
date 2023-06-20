import { getSession, signOut } from "next-auth/react";
import Navbar from "../components/Navbar";
import ProfileElement from "../components/ProfileElement";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { retrieveUserInformation } from "../services/blockchain";
import { CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import BigNumber from "bignumber.js";
import Rating from "@mui/material/Rating";
// import { removeData } from "../services/blockchain";

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
  const [userInfo, setUserInfo] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    async function getInfo() {
      setUserInfo(await retrieveUserInformation());
    }

    if (window.ethereum) {
      // Listen for changes to the selected address
      window.ethereum.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          getInfo();
        } else {
          setAlertOpen(true);
        }
      });

      // Check if the wallet is already connected
      if (window.ethereum.selectedAddress) {
        getInfo();
      } else {
        setAlertOpen(true);
      }
    } else {
      // MetaMask is not installed
      setAlertOpen(true);
    }
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      if (accounts.length === 0) {
        signOut({ redirect: "/signin" });
      }
    });
  }, []);
  console.log(userInfo);
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
      <Head>
        <title>DriveGo | Profile</title>
      </Head>
      <Navbar />
      <ProfileElement />
      <div id="profile">
        {userInfo === null ? (
          <CircularProgress className="profileProgress" />
        ) : (
          <div>
            <div className="image">
              <img src="/login.png" width={45} />
            </div>
            <p style={{ position: "absolute", left: "250px", top: "47px" }}>
              Rating -{" "}
              <Rating
                name="read-only"
                value={new BigNumber(userInfo[3]._hex).toNumber()}
                readOnly
                size="small"
                style={{ position: "relative", top: "3px" }}
              />
            </p>

            <h1 className="profile_name">{userInfo[0]}</h1>

            <h3 className="profile_no">+91 {userInfo[1]}</h3>
            <br />
            <br />
            <label>Identification :</label>
            <p>{user.id}</p>
            <label>Address :</label>
            <p>{user.address}</p>
            <label>Domain : </label>
            <p>{user.domain}</p>
            <label>Chain Id : </label>
            <p>{user.chainId}</p>
            <label>Account Statement :</label>
            <p
              style={{ fontWeight: "bold", cursor: "pointer" }}
              onClick={() => {
                window.open(
                  `https://mumbai.polygonscan.com/address/${user.address}`,
                  "_blank"
                );
              }}
            >
              Polygon Etherscan
            </p>
            <Image
              src="/share.png"
              alt=""
              height={17}
              width={17}
              style={{
                marginLeft: "15px",
                position: "absolute",
                top: "454px",
                left: "181px",
                cursor: "pointer",
              }}
            />
            <button
              className="logout"
              onClick={async () => {
                // await removeData();
                signOut({ redirect: "/signin" });
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
