from flask import Flask
from flask import request
from flask_cors import CORS
import re
import subprocess
import json
from backend.account import Account
from time import time, sleep


from algosdk import account, encoding
from algosdk.logic import get_application_address
from backend.operations import createAuctionApp, setupAuctionApp, placeBid, closeAuction
from backend.util import (
    getBalances,
    getAppGlobalState,
    getLastBlockTimestamp,
)
from backend.testing.setup import getAlgodClient
from backend.testing.resources import (
    getTemporaryAccount,
    optInToAsset,
    createDummyAsset,
)

client = getAlgodClient()

def auction_create_accounts():
    print("Generating temporary accounts...")
    creator = getTemporaryAccount(client)
    seller = getTemporaryAccount(client)
    bidder = getTemporaryAccount(client)

    print("Alice (seller account):", seller.getAddress())
    print("Bob (auction creator account):", creator.getAddress())
    print("Carla (bidder account)", bidder.getAddress(), "\n")

    return (creator, seller, bidder)

def simple_auction():
    auction_create_accounts()

    print("Alice is generating an example NFT...")
    nftAmount = 1
    nftID = createDummyAsset(client, nftAmount, seller)
    print("The NFT ID is", nftID)
    print("Alice's balances:", getBalances(client, seller.getAddress()), "\n")

    startTime = int(time()) + 10  # start time is 10 seconds in the future
    endTime = startTime + 30  # end time is 30 seconds after start
    reserve = 1_000_000  # 1 Algo
    increment = 100_000  # 0.1 Algo
    print("Bob is creating an auction that lasts 30 seconds to auction off the NFT...")
    appID = createAuctionApp(
        client=client,
        sender=creator,
        seller=seller.getAddress(),
        nftID=nftID,
        startTime=startTime,
        endTime=endTime,
        reserve=reserve,
        minBidIncrement=increment,
    )
    print(
        "Done. The auction app ID is",
        appID,
        "and the escrow account is",
        get_application_address(appID),
        "\n",
    )

    print("Alice is setting up and funding NFT auction...")
    setupAuctionApp(
        client=client,
        appID=appID,
        funder=creator,
        nftHolder=seller,
        nftID=nftID,
        nftAmount=nftAmount,
    )
    print("Done\n")

    sellerBalancesBefore = getBalances(client, seller.getAddress())
    sellerAlgosBefore = sellerBalancesBefore[0]
    print("Alice's balances:", sellerBalancesBefore)

    _, lastRoundTime = getLastBlockTimestamp(client)
    if lastRoundTime < startTime + 5:
        sleep(startTime + 5 - lastRoundTime)
    actualAppBalancesBefore = getBalances(client, get_application_address(appID))
    print("Auction escrow balances:", actualAppBalancesBefore, "\n")

    bidAmount = reserve
    bidderBalancesBefore = getBalances(client, bidder.getAddress())
    bidderAlgosBefore = bidderBalancesBefore[0]
    print("Carla wants to bid on NFT, her balances:", bidderBalancesBefore)
    print("Carla is placing bid for", bidAmount, "microAlgos")

    placeBid(client=client, appID=appID, bidder=bidder, bidAmount=bidAmount)

    print("Carla is opting into NFT with ID", nftID)

    optInToAsset(client, nftID, bidder)

    print("Done\n")

    _, lastRoundTime = getLastBlockTimestamp(client)
    if lastRoundTime < endTime + 5:
        waitTime = endTime + 5 - lastRoundTime
        print("Waiting {} seconds for the auction to finish\n".format(waitTime))
        sleep(waitTime)

    print("Alice is closing out the auction\n")
    closeAuction(client, appID, seller)

    actualAppBalances = getBalances(client, get_application_address(appID))
    expectedAppBalances = {0: 0}
    print("The auction escrow now holds the following:", actualAppBalances)
    assert actualAppBalances == expectedAppBalances

    bidderNftBalance = getBalances(client, bidder.getAddress())[nftID]
    assert bidderNftBalance == nftAmount

    actualSellerBalances = getBalances(client, seller.getAddress())
    print("Alice's balances after auction: ", actualSellerBalances, " Algos")
    actualBidderBalances = getBalances(client, bidder.getAddress())
    print("Carla's balances after auction: ", actualBidderBalances, " Algos")
    assert len(actualSellerBalances) == 2
    # seller should receive the bid amount, minus the txn fee
    assert actualSellerBalances[0] >= sellerAlgosBefore + bidAmount - 1_000
    assert actualSellerBalances[nftID] == 0



app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/accounts')
def accounts():
    sandbox_process = subprocess.Popen(["./sandbox", "goal", "account", "list"], stdout=subprocess.PIPE, text=True)
    output, error = sandbox_process.communicate()

    #[offline]	QJFSGTSIQ7XHNBS5KOQGIJRQWLIHWGFZMGGMR3RLUX7EFNXX6O6ZP3DQHA	QJFSGTSIQ7XHNBS5KOQGIJRQWLIHWGFZMGGMR3RLUX7EFNXX6O6ZP3DQHA	4000178801174398 microAlgos
    #[online]	2US5CPRUKRLL7L6U7ZGAAVR42PBMXY2CN4SVC6PN5FEH5VZQRLTKA5S7FY	2US5CPRUKRLL7L6U7ZGAAVR42PBMXY2CN4SVC6PN5FEH5VZQRLTKA5S7FY	4000179001183998 microAlgos
    results = []
    for line in output.split('\n'):
        m = re.match(r'\[(.*?)\]\s+(.*?)\s+(.*)', line)
        if m:
            results.append({
                "status": m.group(1),
                "address": m.group(2)
            })

    print(json.dumps(results))
    return results


@app.route('/auction/start')
def create_start_auction():
    (creator, seller, bidder) = auction_create_accounts()

    print (creator.toJSON())
    print (seller.toJSON())
    print (bidder.toJSON())

    # return json.dumps({
    #     "creator": creator.toJSON(),
    #     "seller": seller.toJSON(),
    #     "bidder": bidder.toJSON()
    # })

    return {
        "creator": creator.toJSON(),
        "seller": seller.toJSON(),
        "bidder": bidder.toJSON()
    }


@app.route('/auction/nft/<nftAmount>', methods = ['POST'])
def create_nft(nftAmount):
    print (request.json)

    nftAmount = int(nftAmount)
    body = request.json
    seller = Account(body['sk'])
    nftID = createDummyAsset(client, nftAmount, seller)

    return json.dumps({
        "nftID": nftID,
    })

@app.route('/account_balance/<address>')
def get_account_balance(address):
    
    balance = getBalances(client, address)
    return json.dumps(balance)

@app.route('/account_balance', methods = ['POST'])
def get_all_account_balance():
    print (request.json)

    body = request.json
    creatorAddress = json.loads(body['creator'])['addr']
    sellerAddress = json.loads(body['seller'])['addr']
    bidderAddress = json.loads(body['bidder'])['addr']

    creatorBalance = getBalances(client, creatorAddress)
    sellerBalance = getBalances(client, sellerAddress)
    bidderBalance = getBalances(client, bidderAddress)

    print (creatorBalance)
    print (sellerBalance)
    print (bidderBalance)

    return json.dumps({
        "creator": json.dumps(creatorBalance),
        "seller": json.dumps(sellerBalance),
        "bidder": json.dumps(bidderBalance)
    })

@app.route('/transaction/<nftID>/<nftAmount>', methods = ['POST'])
def create_transaction(nftID, nftAmount):
    nftID = int(nftID)
    nftAmount = int(nftAmount)
    body = request.json
    creator = Account(json.loads(body['creator'])['sk'])
    seller = Account(json.loads(body['seller'])['sk'])
    bidder = Account(json.loads(body['bidder'])['sk'])

    print (creator.toJSON())
    print (seller.toJSON())
    print (bidder.toJSON())
    
    startTime = int(time()) + 10  # start time is 10 seconds in the future
    endTime = startTime + 30  # end time is 30 seconds after start
    reserve = 1_000_000  # 1 Algo
    increment = 100_000  # 0.1 Algo

    print("Bob is creating an auction that lasts 30 seconds to auction off the NFT...")
    appID = createAuctionApp(
        client=client,
        sender=creator,
        seller=seller.getAddress(),
        nftID=nftID,
        startTime=startTime,
        endTime=endTime,
        reserve=reserve,
        minBidIncrement=increment,
    )
    print(
        "Done. The auction app ID is",
        appID,
        "and the escrow account is",
        get_application_address(appID),
        "\n",
    )

    print("Alice is setting up and funding NFT auction...")
    setupAuctionApp(
        client=client,
        appID=appID,
        funder=creator,
        nftHolder=seller,
        nftID=nftID,
        nftAmount=nftAmount,
    )
    print("Done\n")

    sellerBalancesBefore = getBalances(client, seller.getAddress())
    sellerAlgosBefore = sellerBalancesBefore[0]
    print("Alice's balances:", sellerBalancesBefore)

    _, lastRoundTime = getLastBlockTimestamp(client)
    if lastRoundTime < startTime + 5:
        sleep(startTime + 5 - lastRoundTime)
    actualAppBalancesBefore = getBalances(client, get_application_address(appID))
    print("Auction escrow balances:", actualAppBalancesBefore, "\n")

    bidAmount = reserve
    bidderBalancesBefore = getBalances(client, bidder.getAddress())
    bidderAlgosBefore = bidderBalancesBefore[0]
    print("Carla wants to bid on NFT, her balances:", bidderBalancesBefore)
    print("Carla is placing bid for", bidAmount, "microAlgos")

    placeBid(client=client, appID=appID, bidder=bidder, bidAmount=bidAmount)

    print("Carla is opting into NFT with ID", nftID)

    optInToAsset(client, nftID, bidder)

    print("Done\n")

    _, lastRoundTime = getLastBlockTimestamp(client)
    if lastRoundTime < endTime + 5:
        waitTime = endTime + 5 - lastRoundTime
        print("Waiting {} seconds for the auction to finish\n".format(waitTime))
        sleep(waitTime)

    print("Alice is closing out the auction\n")
    closeAuction(client, appID, seller)

    actualAppBalances = getBalances(client, get_application_address(appID))
    expectedAppBalances = {0: 0}
    print("The auction escrow now holds the following:", actualAppBalances)
    assert actualAppBalances == expectedAppBalances

    bidderNftBalance = getBalances(client, bidder.getAddress())[nftID]
    assert bidderNftBalance == nftAmount

    actualSellerBalances = getBalances(client, seller.getAddress())
    print("Alice's balances after auction: ", actualSellerBalances, " Algos")
    actualBidderBalances = getBalances(client, bidder.getAddress())
    print("Carla's balances after auction: ", actualBidderBalances, " Algos")
    assert len(actualSellerBalances) == 2
    # seller should receive the bid amount, minus the txn fee
    assert actualSellerBalances[0] >= sellerAlgosBefore + bidAmount - 1_000
    assert actualSellerBalances[nftID] == 0

    return {}