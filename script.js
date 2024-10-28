import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

const accounts = await window.ethereum.request({ method: 'eth_accounts' });
if (accounts.length !== 0) {
  connectButton.innerHTML = accounts[0];
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // console.log("metamask connected");
    connectButton.innerHTML = accounts[0];
  } else {
    alert("Metamask is not installed");
  }
}

async function fund() {
  if (accounts.length !== 0) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const ethAmount = document.getElementById("fundInput").value;
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({ value: ethers.parseEther(ethAmount) });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("done")
    } catch (err) {
      console.log(err)
    }
  } else {
    connect();
  }
}

async function getBalance() {
  if (accounts.length !== 0) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.formatEther(balance) + " eth");
  }

}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.status} confirmations`);
      resolve();
    })
  })
}