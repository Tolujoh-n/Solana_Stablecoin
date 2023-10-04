import { Connection, PublicKey } from "@solana/web3.js";

let connection;
let publicKey;

// Phantom provides a method isPhantom which can be used to check if the wallet is installed
if ("solana" in window) {
  let solana = window.solana;
  if (solana.isPhantom) {
    connection = new Connection("https://solana-devnet-rpc.allthatnode.com/");
    solana.on("connect", () => {
      console.log("Connected to account", solana.publicKey.toString());
      publicKey = new PublicKey(solana.publicKey.toString());
    });
    
    if (!solana.isConnected) {
      solana.connect();
    }
  }
}

export { connection, publicKey };
