import "./App.css";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const baseUrl = "http://127.0.0.1:5000";

const nftAmount = 1;

var seller = {};
var creator = {};
var bidder = {};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App() {
  const [accountsStatus, setAccountsStatus] = useState("Not Started.");
  const [nftStatus, setNftStatus] = useState("Not Started.");
  const [transactionStatus, setTransactionStatus] = useState("Not Started.");
  const [aliceAccount, setAliceAccount] = useState("");
  const [aliceBalance, setAliceBalance] = useState("");
  const [aliceBalance2, setAliceBalance2] = useState("");
  const [aliceBalance3, setAliceBalance3] = useState("");
  const [bobAccount, setBobAccount] = useState("");
  const [bobBalance, setBobBalance] = useState("");
  const [bobBalance2, setBobBalance2] = useState("");
  const [bobBalance3, setBobBalance3] = useState("");
  const [carlaAccount, setCarlaAccount] = useState("");
  const [carlaBalance, setCarlaBalance] = useState("");
  const [carlaBalance2, setCarlaBalance2] = useState("");
  const [carlaBalance3, setCarlaBalance3] = useState("");
  const [nftId, setNftId] = useState("");

  // useEffect(() => {
  //    fetch('http://127.0.0.1:5000/accounts')
  //       .then((response) => response.json()
  //       .then((data) => {
  //          console.log(data);
  //          setPosts(data);
  //       })
  //       .catch((err) => {
  //          console.log(err.message);
  //       }));
  // }, []);

  async function createAccounts() {
    console.log("createAccounts");
    setAccountsStatus("Creating Accounts");
    await fetch(`${baseUrl}/auction/start`).then((response) =>
      response
        .json()
        .then((data) => {
          console.log(data);
          console.log("here 1");
          setAccountsStatus("Accounts created");
          setAliceAccount(`${data.seller}`);
          setBobAccount(`${data.creator}`);
          setCarlaAccount(`${data.bidder}`);

          seller = `${data.seller}`;
          creator = `${data.creator}`;
          bidder = `${data.bidder}`;
        })
        .catch((err) => {
          console.log(err.message);
        })
    );

    console.log(aliceAccount)
    console.log(bobAccount)
    console.log(carlaAccount)

    console.log(seller);
    console.log(creator);
    console.log(bidder);

    getAllAccountsBalance(1);
  }

  async function getAllAccountsBalance(cnt=0) {

    console.log(aliceAccount)
    console.log(bobAccount)
    console.log(carlaAccount)

    console.log(seller);
    console.log(creator);
    console.log(bidder);

    await fetch(`${baseUrl}/account_balance`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        seller: seller,
        creator: creator,
        bidder: bidder,
      }),
    }).then((response) =>
      response
        .json()
        .then((data) => {
          console.log(data);

          if (cnt === 2) {
            console.log(cnt);
            setAliceBalance2(data.seller);
            setBobBalance2(data.creator);
            setCarlaBalance2(data.bidder);
          } else if (cnt === 3) {
            console.log(cnt);
            setAliceBalance3(data.seller);
            setBobBalance3(data.creator);
            setCarlaBalance3(data.bidder);
          } else {
            console.log(cnt);
            setAliceBalance(data.seller);
            setBobBalance(data.creator);
            setCarlaBalance(data.bidder);
          }
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  }

  async function createNFT() {
    console.log("createNFT");
    setNftStatus("Creating NFT");

    await fetch(`${baseUrl}/auction/nft/${nftAmount}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: aliceAccount,
    }).then((response) =>
      response
        .json()
        .then((data) => {
          console.log(data);
          setNftStatus(`NFT created, nftId is '${data.nftID}'`);
          setNftId(`${data.nftID}`);
        })
        .catch((err) => {
          console.log(err.message);
        })
    );

    await getAllAccountsBalance(2);
  }

  async function createTransaction() {

    console.log("createTransaction");
    setTransactionStatus("Creating Transaction");

    await fetch(`${baseUrl}/transaction/${nftId}/${nftAmount}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        seller: aliceAccount,
        creator: bobAccount,
        bidder: carlaAccount,
      }),
    }).then((response) =>
      response
        .json()
        .then((data) => {
          console.log(data);
          setTransactionStatus(`Transaction completed`);
        })
        .catch((err) => {
          console.log(err.message);
        })
    );

    await getAllAccountsBalance(3);
  }

  return (
    <>
      <h1>Algorand Luxury Sale Demo dApp</h1>

      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <button
            style={{ minHeight: "60px" }}
            onClick={() => createAccounts()}
          >
            Create Accounts
          </button>
          {accountsStatus}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>Alice (seller account)</Item>
          <Item>Account: {aliceAccount}</Item>
          <Item>Balance: {aliceBalance}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Bob (auction creator account)</Item>
          <Item>Account: {bobAccount}</Item>
          <Item>Balance: {bobBalance}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Carla (bidder account)</Item>
          <Item>Account: {carlaAccount}</Item>
          <Item>Balance: {carlaBalance}</Item>
        </Grid>
      </Grid>      
      
      
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <button
            style={{ minHeight: "60px" }}
            onClick={() => createNFT()}
          >
            Create NFT
          </button>
          {nftStatus}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>Alice (seller account)</Item>
          <Item>Account: {aliceAccount}</Item>
          <Item>Balance: {aliceBalance2}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Bob (auction creator account)</Item>
          <Item>Account: {bobAccount}</Item>
          <Item>Balance: {bobBalance2}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Carla (bidder account)</Item>
          <Item>Account: {carlaAccount}</Item>
          <Item>Balance: {carlaBalance2}</Item>
        </Grid>
      </Grid>


      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <button
            style={{ minHeight: "60px" }}
            onClick={() => createTransaction()}
          >
            Create Transaction
          </button>
          {transactionStatus}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>Alice (seller account)</Item>
          <Item>Account: {aliceAccount}</Item>
          <Item>Balance: {aliceBalance3}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Bob (auction creator account)</Item>
          <Item>Account: {bobAccount}</Item>
          <Item>Balance: {bobBalance3}</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>Carla (bidder account)</Item>
          <Item>Account: {carlaAccount}</Item>
          <Item>Balance: {carlaBalance3}</Item>
        </Grid>
      </Grid>
    </>
  );
}

export default App;
