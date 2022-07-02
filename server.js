require("dotenv").config()

const abi = [
    "function getEarningSpeed(uint tokenId) view returns(uint speed)"
]

const {ethers} = require("ethers")
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)

const contract = new ethers.Contract(process.env.CONTRACT, abi, provider)


const express = require("express")

const app = express()

app.get("/earndata", async(req, res) => {
    try {
        res.send((await contract.getEarningSpeed(req.query.tokenId)).toString())
    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT)

