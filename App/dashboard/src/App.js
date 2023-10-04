import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Mainbonds from "./components/Mainbonds";
import Riskytroves from "./components/Riskytroves";
import Nowallet from "./components/Nowallet";


import "./assets/css/font-awesome.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/magnific-popup.css";
import "./assets/css/select2.min.css";
import "./assets/css/style.css";
import "./assets/css/skins/orange.css";

import { Connection, PublicKey } from "@solana/web3.js";

// Initialize Connection object
const connection = new Connection("https://devnet.solana.com");

const App = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana?.isPhantom) {
        try {
          // Check the connection status or Solana address availability in the Phantom Wallet
          const isConnected = window.solana.isConnected;
          const publicKey = window.solana.publicKey.toString();

          setIsWalletConnected(isConnected);
          setWalletAddress(publicKey); // Set the wallet address
        } catch (error) {
          console.error("Failed to connect the wallet:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = () => {
    if (window.solana?.isPhantom) {
      window.solana
        .connect()
        .then(() => {
          setIsWalletConnected(true);
          setWalletAddress(window.solana.publicKey.toString());
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const disconnectWallet = () => {
    if (window.solana?.isPhantom) {
      window.solana.disconnect();
    }
    setIsWalletConnected(false);
    setWalletAddress("");
  };

  return (
    <div className="wrapper">
      <Router>
        <Navbar
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
        {isWalletConnected ? (
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/mainbonds" element={<Mainbonds />} />
            <Route path="/riskytroves" element={<Riskytroves />} />
            {/* Add more routes for other pages if needed */}
          </Routes>
        ) : (
          <Nowallet connectWallet={connectWallet} />
        )}
      </Router>
    </div>
  );
};

export default App;

