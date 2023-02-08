import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import isOnline from "is-online";
import Head from "next/head";

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const handleRider = async () => {
    if (!(await isOnline())) {
      alert("Connect To Internet");
    } else {
      if (isConnected) {
        await disconnectAsync();
      }

      try {
        const { account, chain } = await connectAsync({
          connector: new MetaMaskConnector(),
        });

        const { message } = await requestChallengeAsync({
          address: account,
          chainId: chain.id,
        });

        const signature = await signMessageAsync({ message });
        const { url } = await signIn("moralis-auth", {
          message,
          signature,
          redirect: false,
          callbackUrl: "/",
        });
        push(url);
      } catch (error) {
        alert("User rejected request");
      }
    }
  };

  return (
    <div className="loginBaground">
      <Head>
        <title>DriveGo | Authenticate</title>
      </Head>
      <div className="login-box">
        <h2>Authenticate</h2>
        <form>
          <div className="user-box">
            <input type="text" placeholder="Username" />
          </div>
          <div className="user-box">
            <input type="text" placeholder="Phone Number" />
          </div>
          <a onClick={handleRider}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </a>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
