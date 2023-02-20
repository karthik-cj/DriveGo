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

const setUserInformation = async ({ name, phone }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.setUserInformation(name, phone);
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

const addLocation = async ({ pickupLocation, dropoffLocation }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.addLocation(pickupLocation, dropoffLocation);
  } catch (error) {
    reportError(error);
  }
};

const getLocation = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.getLocation();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const deleteLocation = async ({ index }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.deleteLocation(index);
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  console.error(error.message);
};

export {
  setUserInformation,
  retrieveUserInformation,
  addLocation,
  getLocation,
  deleteLocation,
};
