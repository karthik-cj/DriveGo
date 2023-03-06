import abi from "../constants/UserDetails.json";
import address from "../constants/contractAddress.json";
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

const setUserInformation = async ({ name, phone, aadhar }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.setUserInformation(name, phone, aadhar);
  } catch (error) {
    reportError(error);
  }
};

const retrieveUserInformation = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.retrieveUserInformation();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const retrieveSpecificDriver = async ({ address }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.retrieveSpecificDriver(address);
    return data;
  } catch (error) {
    reportError(error);
  }
};

const getAllDriverDetails = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.getAllDriverDetails();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  console.log(error.message);
};

export {
  setUserInformation,
  retrieveUserInformation,
  retrieveSpecificDriver,
  getAllDriverDetails,
};
