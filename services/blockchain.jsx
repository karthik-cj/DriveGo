import abi from "../abis/contracts/UserDetails.sol/UserDetails.json";
import address from "../abis/contractAddress.json";
import { ethers } from "ethers";

let ethereum;
let contractAddress;
let contractAbi;

if (typeof window !== "undefined") {
  ethereum = window.ethereum;
  contractAddress = address.address;
  contractAbi = abi.abi;
}

const getEtheriumContract = async () => {
  if (!ethereum) return alert("No Wallet Found");
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};

const setInformation = async ({ name, phone }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.setInformation(name, phone);
  } catch (error) {
    reportError(error);
  }
};

const retrieveInformation = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const info = await contract.retrieveInformation();
    return info;
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  console.log(error.message);
};
export { setInformation, retrieveInformation };
