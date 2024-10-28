import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

connectButton.onclick = connect;
fundButton.onclick = fund;

const accounts = await window.ethereum.request({ method: 'eth_accounts' });
if (accounts.length !== 0) {
  connectButton.innerHTML = "Connected";
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // console.log("metamask connected");
    connectButton.innerHTML = "Connected";
  } else {
    alert("Metamask is not installed");
  }
}

async function fund() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const ethAmount = "0.1"
  if (signer) {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({ value: ethers.parseEther(ethAmount) });
      const receipt = await transactionResponse.wait();
      if (receipt) {
        alert(`Fund Success with tx: ${receipt.hash}`)
      }
    } catch (err) {
      console.log(err)
    }
  } else {
    connect();
  }
}