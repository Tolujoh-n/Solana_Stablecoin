import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

import "./dashboard/dashboard.css";
import "./mainbonds.css";
import Innerbonds from "./dashboard/Innerbonds";
import Statistics from "./dashboard/Statistics";
import Managesol from "./mainbondbuttons/Managesol";
import SellModal from "./mainbondbuttons/SellModal";
import BuyModal from "./mainbondbuttons/BuyModal";

// Initialize Connection object
const connection = new Connection("https://devnet.solana.com");

const Mainbonds = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isManageSolModalOpen, setIsManageSolModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana?.isPhantom) {
        try {
          const isConnected = window.solana.isConnected;
          setIsWalletConnected(isConnected);
        } catch (error) {
          console.error("Failed to connect the wallet:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const handleManageSolClick = () => {
    setIsManageSolModalOpen(true);
  };

  const handleCloseManageSolModal = () => {
    setIsManageSolModalOpen(false);
  };

  const handleBuyModalClick = () => {
    setIsBuyModalOpen(true);
  };
  
  const handleCloseBuyModal = () => {
    setIsBuyModalOpen(false);
  };
  
  const handleSellModalClick = () => {
    setIsSellModalOpen(true);
  };
  
  const handleCloseSellModal = () => {
    setIsSellModalOpen(false);
  };

  const handleBuySubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    handleCloseBuyModal();
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    handleCloseSellModal();
  };

  return (
    <div>
      {isWalletConnected ? (
        <div className="dashit">
          <div className="row">
            <span>
              <button id="bondsbut" onClick={handleManageSolClick}>
                Manage Solstable
              </button>
              <button id="bondsbut" onClick={handleBuyModalClick}>
                Buy bSUSD
              </button>
              <button id="bondsbut" onClick={handleSellModalClick}>Sell bSUSD</button>
            </span>
            <div className="col-lg-12">
              <Innerbonds />
              <Statistics />
            </div>
          </div>
        </div>
      ) : (
        <h1>Refresh Page</h1>
      )}

      {/* Render the Managesol modal if isManageSolModalOpen is true */}
      {isManageSolModalOpen && (
        <Managesol onClose={handleCloseManageSolModal} activeTab="DEPOSIT" />
      )}

      {/* Render the BuyModal if isBuyModalOpen is true */}
      {isBuyModalOpen && (
        <BuyModal onClose={handleCloseBuyModal} onSubmit={handleBuySubmit} />
      )}

      {/* Render the SellModal if isSellModalOpen is true */}
      {isSellModalOpen && (
        <SellModal onClose={handleCloseSellModal} onSubmit={handleSellSubmit} />
      )}
    </div>
  );
};

export default Mainbonds;

