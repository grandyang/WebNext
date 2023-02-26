import './App.css';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo_site from './logo.png'
import logo_chanel from './img/logo-Chanel.png'
import logo_hermes from './img/logo-Hermes.png'
import logo_lv from './img/logo-LV.jpeg'
import item_lv_mono from './img/LV-item-MonogramGiant.jpg'
import item_lv_dami from './img/LV-item-Damier.jpg'
import item_lv_sati from './img/LV-item-Satin.jpg'
import item_lv_sat2 from './img/LV-item-Satin-2.jpg'
import item_lv_oran from './img/LV-item-orange.jpg'
import item_channel_1 from './img/Channel-item-1.jpg'
import item_channel_2 from './img/Channel-item-2.jpg'
import item_channel_3 from './img/Channel-item-3.jpg'
import item_channel_4 from './img/Channel-item-4.jpg'
import item_channel_5 from './img/Channel-item-5.jpg'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {
  const [accountsStatus, setAccountsStatus] = useState('Not Started.');
  const [aliceAddress, setAliceAddress] = useState('');
  const [bobAddress, setBobAddress] = useState('');
  const [carlaAddress, setCarlaAddress] = useState('');

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

  function addToList() {
      console.log("Adding to list");
      setAccountsStatus("Creating Accounts");
      fetch('http://172.29.170.179:5000/auction/start')
          .then((response) => response.json()
              .then((data) => {
                    console.log(data);
                    setAccountsStatus("Accounts created");
                    setAliceAddress(data.seller);
                    setBobAddress(data.creator);
                    setCarlaAddress(data.bidder);
              })
              .catch((err) => {
                  console.log(err.message);
              }));
  }

  function purchase() {
      console.log("createAccounts");
      setAccountsStatus("Creating Accounts");
      fetch('http://172.29.170.179:5000/auction/start')
          .then((response) => response.json()
              .then((data) => {
                    console.log(data);
                    setAccountsStatus("Accounts created");
                    setAliceAddress(data.seller);
                    setBobAddress(data.creator);
                    setCarlaAddress(data.bidder);
              })
              .catch((err) => {
                  console.log(err.message);
              }));
  }

  function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

  function LoadingButton() {
    const [isLoading, setLoading] = useState(false);
    const [isPurchased, setPurchased] = useState(false);

    useEffect(() => {
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);

    const handleClick = () => {
      setLoading(true);
      setPurchased(true);
    }

    return (
      <Button
        variant="primary"
        disabled={isLoading || isPurchased}
        onClick={!isLoading ? handleClick : null}
      >
        {isLoading ? 'Processing...' : isPurchased ? 'Purchased' : 'Purchase 17,937 ALGO'}
      </Button>
    );
  }

  function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <div class="col-2 card pt-2 m-2" onClick={handleShow}>
          <small class="">Satin Crystal Embellished Monogram Coussin BB Multicolor</small>
          <img class="card-img-top" src={item_lv_sati} alt="Card image cap" />
          <span class="card-title">18,500 ALGO</span>
        </div>

        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Satin Crystal Embellished Monogram Coussin BB Multicolor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="container">
              <div class="row">
                <div class="col-5">
                  <img class="card-img-top" src={item_lv_sati} alt="Card image cap" />
                  <span class="card-title">17,500 ALGO</span>
                  <ul class="list-group">
                    <li class="list-group-item mt-2 bt-4">
                      <div class="me-auto text-muted">
                        <p>672TX3CVFHIFINMEW7FARGLL6IDXM</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="col-7">
                  <div class="mb-2">
                    STATUS
                  </div>
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>Excellent - Evaluated by </span>
                        <Badge bg="secondary">Lux Official</Badge>
                      </div>
                      <Badge bg="info">Condition Report</Badge>
                    </li>
                  </ul>
                  <div class="my-2">
                    HISTORY
                  </div>
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>11/01/2010 - Produced by </span>
                        <Badge bg="secondary">Louis Vuitton</Badge>
                      </div>
                      <Badge bg="success">Info</Badge>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>01/01/2011 - Purchased by </span>
                        <Badge bg="secondary">David Beckham</Badge>
                      </div>
                      <Badge bg="success">Story</Badge>
                    </li>
                    <li class="list-group-item">
                      <span>05/25/2021 - Purchased by </span>
                      <Badge bg="secondary">Anonymous</Badge>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>07/16/2021 - Purchased by </span>
                        <Badge bg="secondary">Anonymous</Badge>
                      </div>
                      <Badge bg="success">Story</Badge>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>09/03/2022 - Purchased by </span>
                        <Badge bg="secondary">Jie Mei</Badge>
                      </div>
                    </li>
                  </ul>
                  <div class="my-2">
                    PRICE
                  </div>
                  <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>Item Price </span>
                      </div>
                      17,500 ALGO
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>Membership </span>
                          <Badge bg="secondary">Louis Vuitton</Badge>
                        <span> (0.5%) </span>
                      </div>
                      87 ALGO
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="me-auto">
                        <span>Service Fee (2%) </span>
                      </div>
                      350 ALGO
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={addToList}>
              Add to Watch List
            </Button>
            <LoadingButton />
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          {/* <a class="navbar-brand p-3 font-weight-bold" href="#">Lux</a> */}
          <div class="pr-5">
            <img src={logo_site} width="88" alt="Card image cap" />
          </div>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#">New Arrival</a>
              </li>
              <li class="nav-item px-3">
                <a class="nav-link" href="#">Sales</a>
              </li>
              <li class="nav-item px-2">
                <a class="nav-link" href="#">Hot</a>
              </li>
              <li class="nav-item px-2">
                <a class="nav-link">More</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container">
        <p class="row justify-content-center mt-5 font-weight-light text-muted">
          FEATURED BRANDS
        </p>
        <div class="row justify-content-center mt-2">
          <div class="col-3 card pt-5 m-3">
            <img class="card-img-top pt-4" src={logo_chanel} alt="Card image cap" />
          </div>
          <div class="col-3 card px-5 pt-5 m-3">
            <img class="card-img-top" src={logo_lv} alt="Card image cap" />
          </div>
          <div class="col-3 card p-4 m-3">
            <img class="card-img-top" src={logo_hermes} alt="Card image cap" />
          </div>
        </div>
        <div>
          <p class="row font-weight-light text-muted m-3">
            LOUIS VUITTON
          </p>
          <div class="row justify-content-center mt-2">
            <div class="col-2 card pt-2 m-2">
              <small class="">Satin Beaded Embroidered Monogram Coussin BB Black</small>
              <img class="card-img-top" src={item_lv_sat2} alt="Card image cap" />
              <span class="card-title">20,200 ALGO</span>
            </div>
            <Example />
            <div class="col-2 card pt-2 m-2">
              <small class="">Monogram Giant Spring In The City Marshmallow Hobo Sunset Kaki</small>
              <img class="card-img" src={item_lv_mono} alt="Card image cap" />
              <div class="text-right">
                <span class="card-title">10,000 ALGO</span>
              </div>
            </div>
            <div class="col-2 card pt-4 m-2">
              <small class="pt-2">Epi Cluny Mini Gold Honey</small>
              <img class="card-img-top" src={item_lv_oran} alt="Card image cap" />
              <span class="card-title">9,800 ALGO</span>
            </div>
            <div class="col-2 card pt-2 m-2">
              <small class="pt-4">Damier Azur Beaubourg Hobo MM</small>
              <img class="card-img-top" src={item_lv_dami} alt="Card image cap" />
              <span class="card-title">8,500 ALGO</span>
            </div>
          </div>
        </div>
        <div>
          <p class="row font-weight-light text-muted m-3">
            CHANEL
          </p>
          <div class="row justify-content-center mt-2">
            <div class="col-2 card pt-2 m-2">
              <small class="">Lambskin Quilted Chain Top Handle Clutch With Chain Black</small>
              <img class="card-img-top px-2" src={item_channel_3} alt="Card image cap" />
              <span class="card-title">17,600 ALGO</span>
            </div>
            <div class="col-2 card pt-2 m-2">
              <small class="">Denim Quilted Denim Mood Shopping Bag Black Multicolor</small>
              <img class="card-img-top px-2" src={item_channel_4} alt="Card image cap" />
              <span class="card-title">15,500 ALGO</span>
            </div>
            <div class="col-2 card pt-2 m-2">
              <small class="">Mixed Fibers Small Deauville Tote Black</small>
              <img class="card-img-top" src={item_channel_2} alt="Card image cap" />
              <span class="card-title">12,200 ALGO</span>
            </div>
            <div class="col-2 card pt-2 m-2">
              <small class="">Caviar Macro Chevron Single Flap Black</small>
              <img class="card-img-top" src={item_channel_1} alt="Card image cap" />
              <span class="card-title">12,200 ALGO</span>
            </div>
            <div class="col-2 card pt-2 m-2">
              <small class="">Shiny Lambskin Ribbon Quilted Round Clutch With Chain Brown</small>
              <img class="card-img-top px-2" src={item_channel_5} alt="Card image cap" />
              <span class="card-title">8,000 ALGO</span>
            </div>
          </div>
          <p class="row justify-content-center m-4 font-weight-light text-muted">
            MORE
          </p>
        </div>
        <div class="row mt-5">
          <div class="col">
            <p class="text-muted m-3">
              STYLES
            </p>
            <table class="table m-3">
            <tbody>
              <tr><td>Backpacks</td></tr>
              <tr><td>Belt Bags</td></tr>
              <tr><td>Bucket Bags</td></tr>
              <tr><td>Clutch&Evening Bags</td></tr>
            </tbody>
          </table>
          </div>
          <div class="col">
            <p class="text-muted m-3">
              SPECIAL
            </p>
            <table class="table m-3">
            <tbody>
              <tr><td>Over 50% off Retail</td></tr>
              <tr><td>Under $1000</td></tr>
              <tr><td>Most Popular</td></tr>
              <tr><td>Vintage</td></tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <footer class="bg-dark text-white">
        <div class="container p-4">
          <section class="mt-4">
            <form action="">
              <div class="row d-flex justify-content-center">
                <div class="col-1">
                  <img src={logo_site} class="img-thumbnail" alt="Card image cap" />
                </div>
                <div class="col-1">
                </div>
                <div class="col-auto">
                  <p class="pt-2">
                    <strong>Sign up for our newsletter</strong>
                  </p>
                </div>
                <div class="col-md-5 col-12">
                  <div class="form-outline form-white mb-4">
                    <input type="email" id="form5Example21" class="form-control" />
                    <label class="form-label" for="form5Example21">Email address</label>
                  </div>
                </div>
                <div class="col-auto">
                  <button type="submit" class="btn btn-outline-light mb-4">
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </section>
          <section class="mb-5">
            <p class="text-align-left">
              Luex La Vie is a premier pre-owned ultra-luxury bag trading
              website that provides a platform for individuals to buy, sell, or
              trade high-end designer handbags. With a focus on authenticity and
              quality, Lux offers a curated selection of pre-owned luxury bags
              from top designer brands such as Chanel, Hermes, Louis Vuitton,
              and Gucci. The website provides a seamless and secure transaction
              process, ensuring that buyers and sellers have a hassle-free
              experience. Luex La Vie is the ultimate destination for those
              seeking to acquire or dispose of luxury handbags, and with its
              extensive collection of top-tier bags, it has become a trusted
              platform among luxury enthusiasts worldwide.
            </p>
          </section>
          <section class="">
            <div class="row">
              <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase">DISCOUNTS</h5>

                <ul class="list-unstyled mb-0">
                  <li>
                    <a href="#!" class="text-white">Student & youth discount</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Essential worker discount</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Shoprunner discount</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Friend referal discount</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase">INFO</h5>

                <ul class="list-unstyled mb-0">
                  <li>
                    <a href="#!" class="text-white">FAQs</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Privacy policy</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Protection of interllectual property</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Careers</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase">CUSTOMER SERVICES</h5>

                <ul class="list-unstyled mb-0">
                  <li>
                    <a href="#!" class="text-white">Contact us</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Orders & delivery</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Payment & pricing</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Returns & refunds</a>
                  </li>
                </ul>
              </div>
              <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase">ABOUT LUX</h5>

                <ul class="list-unstyled mb-0">
                  <li>
                    <a href="#!" class="text-white">About us</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Investers</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Loyalty programme</a>
                  </li>
                  <li>
                    <a href="#!" class="text-white">Sitemap</a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section class="my-4">
            <p class="text-muted">
              Lux @ 2023
            </p>
          </section>
        </div>
      </footer>
    </>
  );
}

export default App;
