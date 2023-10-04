import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import "./dashboard/dashboard.css";
import Stack from "./dashboard/Stack";
import Pool from "./dashboard/Pool";
import Trove from "./dashboard/Trove";
import Pagebonds from "./dashboard/Pagebonds";
import Statistics from "./dashboard/Statistics";

const Main = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      // This assumes the window object has already been extended with the Phantom wallet.
      // Note that the window object may not be immediately available on page load.
      if ("solana" in window) {
        const provider = window.solana;
        if (provider.isPhantom) {
          try {
            // Request user permission to connect the wallet
            await provider.connect();

            // Check the connection status or Solana address availability in the provider instance
            const isConnected = provider.isConnected;
            setIsWalletConnected(isConnected);

            // Get wallet public key
            if (isConnected) {
              setWalletAddress(provider.publicKey.toString());
            }
          } catch (error) {
            console.error("Failed to connect the wallet:", error);
          }
        }
      } else {
        console.log("Please install Phantom Wallet extension.");
      }
    };

    checkWalletConnection();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      {isWalletConnected ? (
        <div className="dashit">
          <div className="row">
            <div className="col-lg-12">
              <Trove handleSubmit={handleSubmit} />
              <Pagebonds handleSubmit={handleSubmit} />
              <Pool handleSubmit={handleSubmit} />
              <Stack handleSubmit={handleSubmit} />

              <Statistics />
            </div>  
          </div>
        </div>
      ) : (
        <h1>Refresh Page</h1>
      )}
    </div>
  );
};

export default Main;

