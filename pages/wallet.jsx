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
  const balanceResult = await fetch(
    "http://localhost:3000/api/moralis/balance",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: session.user.address,
      }),
    }
  );
  const Balance = await balanceResult.json();

  const transactionResult = await fetch(
    "http://localhost:3000/api/moralis/transactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: session.user.address,
      }),
    }
  );
  const Transactions = await transactionResult.json();

  return {
    props: { user: Balance.balance, walletTrans: Transactions },
  };
}

const Wallet = ({ user, walletTrans }) => {
  return (
    <div>
      <Navbar />
      <ProfileElement />
      <div id="wallet">
        <h3 style={{ fontWeight: "lighter", color: "#606060" }}>Balance</h3>
        <h1 style={{ marginTop: "-8px" }}>
          {(parseInt(user.rawValue, 16) * 1e-18).toFixed(2)} ETH
        </h1>
        <button className="addFund">
          <span>&#43;</span> Add Fund
        </button>
      </div>
      <h1 className="walletHeading">Transactions</h1>
      <div id="transactions">
        {walletTrans.map((index) => (
          <div key={index.blockNumber}>
            <p style={{ margin: "10px", paddingTop: "15px" }}>
              From - {index.from}
            </p>
            <p style={{ margin: "10px" }}>To - {index.to}</p>
            <p style={{ margin: "10px" }}>Value - {index.value * 1e-18}</p>
            <p style={{ margin: "10px", paddingBottom: "13px" }}>
              Date/Time - {index.blockTimestamp}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
