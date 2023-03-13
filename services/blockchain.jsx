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

const addData = async ({ driverAddr, pickup, dropoff, amount }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.addData(driverAddr, pickup, dropoff, amount);
  } catch (error) {
    reportError(error);
  }
};

const getData = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.getData();
    return data;
  } catch (error) {
    reportError(error);
  }
};

const removeData = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.removeData();
  } catch (error) {
    reportError(error);
  }
};

const payDriver = async ({ driverAddr, userAddr, amount, rating }) => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    await contract.payDriver(driverAddr, userAddr, rating, {
      value: ethers.utils.parseEther(amount),
    });
  } catch (error) {
    reportError(error);
  }
};

const displayRideHistory = async () => {
  try {
    if (!ethereum) return alert("No Wallet Found");
    const contract = await getEtheriumContract();
    const data = await contract.displayRideHistory();
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
  addData,
  removeData,
  getData,
  payDriver,
  displayRideHistory,
};
