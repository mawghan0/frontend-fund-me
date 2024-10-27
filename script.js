async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    // console.log("metamask connected");
    document.getElementById("buttonConnect").innerHTML = "Connected";
  } else {
    document.getElementById("buttonConnect").innerHTML = "Metamask not installed";
  }
}