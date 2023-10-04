import React, { useEffect, useState } from "react";
import Deposit from "./managesol/Deposit";
import Rewards from "./managesol/Rewards";
import Borrow from "./managesol/Borrow";
import Repay from "./managesol/Repay";
import Deposit2 from "./managesol/Deposit2";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction, Connection, clusterApiUrl} from "@solana/web3.js";
import { createMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, MintLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createInitializeMintInstruction } from '@solana/spl-token';
import IDL from "./contractIDL/sol_anchor_contract.json";
import { Buffer } from 'buffer';
import BN from 'bn.js';
import BufferMock from './bufferMock';
import { set } from "@project-serum/anchor/dist/cjs/utils/features";
import { associated } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token";

const PROGRAM_ID = "Cb3e9p9PPNF7XHrpTrH7oyofm5J3Pj3Yn3KiSFagkQhG";
const PROGRAM_ADDRESS = new PublicKey(PROGRAM_ID);
const PDA_SEED = "pda_account";
const USER_DEPOSIT_ACCOUNT_SEED = "user_deposit_account";
const USER_BORROW_TRACKER_SEED = "user_borrow_tracker";
const SOL_TO_USD = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix";

const Managesol = ({ onClose, activeTab }) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  const [provider, setProvider] = useState(null);
  const [program, setProgram] = useState(null);
  const [adminConfig, setAdminConfig] = useState(null);
  const [pda_account, setPdaAccount] = useState(null);
  const [user_deposit_account, setUserDepositAccount] = useState(null);
  const [user_borrow_tracker, setUserBorrowTracker] = useState(null);
  const [mint2, setMint] = useState(null);
  const [borrowerDebtTokenAccount, setBorrowerDebtTokenAccount] = useState(null);
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  

  useEffect(() => {
    setLocalActiveTab(activeTab);
    
    // Initialize the provider and program
    if (window.solana && window.solana.isPhantom) {
      // Specify the network
      const network = "devnet";
      const rpcHost = clusterApiUrl(network);

      // Initialize Connection
      const connection = new Connection(rpcHost);

      // Initialize Wallet
      let wallet;
      if (window.solana && window.solana.isPhantom) {
        wallet = window.solana;
        console.log("Connected to Phantom wallet");
      }

      // Initialize Provider
      let provider;
      if (wallet) {
        provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: "recent",
        });
        console.log("Provider and program initialized.");
        console.log("Provider's connection:", provider.connection);
      }
      try {
        const program = new Program(IDL, PROGRAM_ADDRESS, provider);
        setProvider(provider);
        setProgram(program);
        console.log("Provider and program initialized.");
        console.log("Provider wallet publicKey:", window.solana.publicKey.toString());
        console.log("programId:", program.programId.toString());
        console.log("RPC Endpoint:", provider.connection);
      } catch (error) {
        console.log("Failed to initialize provider and program:", error);
      }
    }
  }, [activeTab]);

  const createAccounts = async () => {
    const adminConfig = Keypair.generate();
    const ownerPubkey = Buffer.from(window.solana.publicKey.toBytes());

    console.log("ownerPubkey is: ", ownerPubkey);
    
    const [pdaAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(PDA_SEED), ownerPubkey],
      program.programId
    );
    setPdaAccount(pdaAccount);
    
    console.log("pdaAccount is: ", pdaAccount);
    
    const [userDepositAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_DEPOSIT_ACCOUNT_SEED), ownerPubkey],
      program.programId
    );
    setUserDepositAccount(userDepositAccount);
    
    const [userBorrowTracker] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_BORROW_TRACKER_SEED), ownerPubkey],
      program.programId
    );

    setUserBorrowTracker(userBorrowTracker);

    const adminConfigData = {
      loanPriceFeedId: new PublicKey(SOL_TO_USD),
    };

    console.log(provider.connection);

    try {
      await program.rpc.createAccounts(adminConfigData, {
        accounts: {
          userAccount: window.solana.publicKey,
          pdaAccount: pdaAccount,
          userDepositAccount: userDepositAccount,
          userBorrowTracker: userBorrowTracker,
          systemProgram: SystemProgram.programId,
          config: adminConfig.publicKey,
        },
        signers: [adminConfig],
      });

      // Save the secret key to localStorage instead of file system on the client side
      localStorage.setItem('admin_pubkey_bytes', JSON.stringify(Array.from(adminConfig.publicKey.toBytes())));
      setAdminConfig(adminConfig);

      console.log("Accounts created.");
    } catch (error) {
      console.error("Failed to create accounts:", error);
    }
  };

  const deposit2 = async () => {
    console.log("Depositing...");
  
    // Generate instruction for the deposit action
    const instruction = program.instruction.deposit(new BN(5), {
      accounts: {
        userAccount: window.solana.publicKey,
        pdaAccount: pda_account,
        userDepositAccount: user_deposit_account,
        systemProgram: SystemProgram.programId,
      },
    });
  
    // Create a transaction
    const transaction = new Transaction().add(instruction);
  
    // Request user's signature and send the transaction
    try {
      let { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = window.solana.publicKey;
  
      let signedTransaction = await window.solana.signTransaction(transaction);
      let txid = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log("Deposit transaction sent. Transaction ID:", txid);
    } catch (error) {
      console.error("Failed to deposit:", error);
    }
  };

  const borrow = async () => {
    console.log("creating mint account");
    
    const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
    const ownerPubkey = Buffer.from(window.solana.publicKey.toBytes());
  
    console.log("ownerPubkey is: ", ownerPubkey);
    
    const [pdaAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(PDA_SEED), ownerPubkey],
      program.programId
    );
  
    let mint = Keypair.generate();
    console.log("mint is: ", mint.publicKey);
    console.log("accounts is: ", window.solana.publicKey);
    let mint_pubkey = new PublicKey(mint.publicKey);
    setMint(mint_pubkey);
    localStorage.setItem('mint_pubkey', JSON.stringify(Array.from(mint_pubkey.toBytes())));
    console.log("pda is: ", pdaAccount);
  
    const associatedAddress = await getAssociatedTokenAddress(mint_pubkey, provider.wallet.publicKey, undefined, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    localStorage.setItem('associatedAddress', JSON.stringify(Array.from(associatedAddress.toBytes())));
  
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: window.solana.publicKey,
        newAccountPubkey: mint_pubkey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint_pubkey,
        9,
        pdaAccount,
        pdaAccount,
        TOKEN_PROGRAM_ID,
      ),
      createAssociatedTokenAccountInstruction(
        window.solana.publicKey, // payer of the initialization fees
        associatedAddress, // new associated token account
        window.solana.publicKey, // owner of the new account
        mint_pubkey, // token mint account
        TOKEN_PROGRAM_ID, // SPL Token program account
        ASSOCIATED_TOKEN_PROGRAM_ID // SPL Associated Token program account
      )
    );
  
    console.log("mint is: ", mint_pubkey);
  
    const associatedAddress_bytes = JSON.parse(localStorage.getItem('associatedAddress'));
    const associatedAddressPK = new PublicKey(associatedAddress_bytes);
    let borrowerDebtTokenAccount = associatedAddressPK;
  
    const [userDepositAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_DEPOSIT_ACCOUNT_SEED), Buffer.from(window.solana.publicKey.toBytes())],
      program.programId,
    );
  
    const [userBorrowTracker] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_BORROW_TRACKER_SEED), Buffer.from(window.solana.publicKey.toBytes())],
      program.programId,
    );
  
    let admin_config_bytes = JSON.parse(localStorage.getItem('admin_pubkey_bytes'));
    let admin_config = new PublicKey(admin_config_bytes);
    console.log("adminConfig is: ", adminConfig.publicKey);
  
    console.log("borrowerDebtTokenAccount is: ", borrowerDebtTokenAccount);
    setBorrowerDebtTokenAccount(borrowerDebtTokenAccount);
    localStorage.setItem('borrowerDebtTokenAccount', JSON.stringify(Array.from(borrowerDebtTokenAccount.toBytes())));
    console.log("userDepositAccount is: ", userDepositAccount);
    console.log("userBorrowTracker is: ", userBorrowTracker);
    console.log("mint_pubkey is: ", mint_pubkey);
    console.log("admin_config is: ", admin_config);
    console.log("pdaAccount is: ", pdaAccount);
  
    console.log("Borrowing...");
    const borrowInstruction = program.instruction.borrow(new BN(1), {
      accounts: {
        config: admin_config,
        userDepositAccount: userDepositAccount,
        userBorrowTracker: userBorrowTracker, 
        pythLoanAccount: new PublicKey(SOL_TO_USD),
        borrowerDebtTokenAccount: borrowerDebtTokenAccount,
        debtTokenMint: mint_pubkey,
        tokenProgram: TOKEN_PROGRAM_ID,
        userAccount: window.solana.publicKey,
        systemProgram: SystemProgram.programId,
        pdaAccount: pdaAccount,
      },
    });
  
    // Adding the borrow instruction to the transaction
    transaction.add(borrowInstruction);
  
    // This is where we request Phantom to sign the transaction
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = window.solana.publicKey;
    transaction.partialSign(mint);
  
    try {
      const signedTransaction = await window.solana.signTransaction(transaction);
      const transactionId = await connection.sendRawTransaction(signedTransaction.serialize());
    
      console.log("Mint and associated token account created with id: ", transactionId);
    } catch (error) {console.error("Failed to create mint and associated token account and borrow:", error);
  }};

  async function repay() {
    const payer = window.solana.publicKey;
    const repayAmount = new BN(1); // Replace with the desired repay amount
    let mint_pubkey_bytes = JSON.parse(localStorage.getItem('mint_pubkey'));
    let mint_pubkey = new PublicKey(mint_pubkey_bytes);
    let admin_config_bytes = JSON.parse(localStorage.getItem('admin_pubkey_bytes'));
    let admin_config_pubkey = new PublicKey(admin_config_bytes);
    const [pdaAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(PDA_SEED), Buffer.from(window.solana.publicKey.toBytes())],
      program.programId,
    );

    const [userDepositAccount] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_DEPOSIT_ACCOUNT_SEED), Buffer.from(window.solana.publicKey.toBytes())],
      program.programId,
    );

    const [userBorrowTracker] = await PublicKey.findProgramAddress(
      [Buffer.from(USER_BORROW_TRACKER_SEED), Buffer.from(window.solana.publicKey.toBytes())],
      program.programId,
    );

    let borrowerDebtTokenAccount_bytes = JSON.parse(localStorage.getItem('borrowerDebtTokenAccount'));
    let borrowerDebtTokenAccount = new PublicKey(borrowerDebtTokenAccount_bytes);

    // Create the instruction for the transaction
    const instruction = program.instruction.repay(repayAmount, {
        accounts: {
            userAccount: window.solana.publicKey,
            pdaAccount: pdaAccount,
            userDepositAccount: userDepositAccount,
            userBorrowTracker: userBorrowTracker,
            pythLoanAccount: new PublicKey(SOL_TO_USD),
            borrowerDebtTokenAccount: borrowerDebtTokenAccount,
            debtTokenMint: mint_pubkey,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            config: admin_config_pubkey,
        },
    });

    const transaction = new Transaction().add(instruction);

    // Fetch recent blockhash
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Request user's signature via Phantom
    const signedTransaction = await window.solana.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log("Transaction sent. Transaction ID:", txid);
}



  const handleSubmit = () => {
    if (localActiveTab === "DEPOSIT") {
      console.log("Creating accounts...");
      createAccounts();
    }
    if (localActiveTab === "DEPOSIT2") {
      console.log("Depositing...");
      deposit2();
    }
    if (localActiveTab === "BORROW") {
      console.log("Borrowing...");
      borrow();
    }
    if (localActiveTab === "REPAY") {
      console.log("Repaying...");
      repay();
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div style={headerStyle}>
          <h2>Manage Solstable</h2>
          <div style={navigationStyle}>
            <button
              style={
                localActiveTab === "DEPOSIT" ? activeButtonStyle : buttonStyle
              }
              onClick={() => setLocalActiveTab("DEPOSIT")}
            >
              Create Accounts
            </button>
            <button
              style={
                localActiveTab === "DEPOSIT2" ? activeButtonStyle : buttonStyle
              }
              onClick={() => setLocalActiveTab("DEPOSIT2")}
            >
              DEPOSIT2
            </button>
            <button
              style={
                localActiveTab === "BORROW" ? activeButtonStyle : buttonStyle
              }
              onClick={() => setLocalActiveTab("BORROW")}
            >
              BORROW
            </button>
            <button
              style={
                localActiveTab === "REPAY" ? activeButtonStyle : buttonStyle
              }
              onClick={() => setLocalActiveTab("REPAY")}
            >
              REPAY
            </button>
            <button
              style={
                localActiveTab === "REWARDS" ? activeButtonStyle : buttonStyle
              }
              onClick={() => setLocalActiveTab("REWARDS")}
            >
              REWARDS
            </button>
          </div>
        </div>
        <div>
          {localActiveTab === "DEPOSIT" && (
            <Deposit handleSubmit={handleSubmit} onClose={onClose} />
          )}

          {localActiveTab === "DEPOSIT2" && (
            <Deposit2 handleSubmit={handleSubmit} onClose={onClose} />
          )}

          {localActiveTab === "BORROW" && (
            <Borrow handleSubmit={handleSubmit} onClose={onClose} />
          )}

          {localActiveTab === "REPAY" && (
            <Repay handleSubmit={handleSubmit} onClose={onClose} />
          )}

          {localActiveTab === "REWARDS" && (
            <Rewards handleSubmit={handleSubmit} onClose={onClose} />
          )}

        </div>
      </div>
    </div>
  );
};

export default Managesol;

const modalStyle = {
  /* Your modal style here */
  position: "fixed",
  zIndex: "9999",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  /* Your modal content style here */
  width: "40%",
  backgroundColor: "rgb(234, 241, 241)",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const closeButtonStyle = {
  /* Your close button style here */
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
  fontSize: "1.5rem",
};

const headerStyle = {
  /* Your modal header style here */
  marginBottom: "20px",
  textAlign: "center",
};

const navigationStyle = {
  /* Your navigation button style here */
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};

const buttonStyle = {
  /* Your button style here */
  padding: "8px 12px",
  backgroundColor: "rgb(79, 209, 226)",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  // margin: "10px",
  marginRight: "8px",
};

const cancelbut = {
  /* Your button style here */
  padding: "8px 12px",
  backgroundColor: "rgb(129, 128, 125)",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "10px",
  marginRight: "8px",
};

const submitbut = {
  /* Your button style here */
  padding: "8px 12px",
  backgroundColor: "rgb(79, 209, 226)",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "10px",
  marginRight: "8px",
};

const activeButtonStyle = {
  /* Your active button style here */
  ...buttonStyle,
  backgroundColor: "goldenrod", // Change this to your desired active color
};
