require("dotenv").config()

const abi = [
    "function getEarningSpeed(uint tokenId) view returns(uint speed)",
    "function getTokenAttributes(uint256 _tokenId) external view returns (uint256 speed,uint256 unlocked,uint256 locked,uint256 lockedInterest,uint256 totalSpent,uint256 totalEverClaimed,uint8 pitCrew,uint8 crewChief,uint8 mechanic,uint8 gasman,uint8 tireChanger)"
]

const {ethers} = require("ethers")
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)

const contract = new ethers.Contract(process.env.CONTRACT, abi, provider)


const express = require("express")

const app = express()

app.get("/meta", async(req, res) => {
    const tokenId = req.query.tokenId
    try {
        const metadata = (await (await fetch(`${process.env.API}?items=${tokenId}`)).json())[0]
        
        const garageData = await contract.getTokenAttributes(tokenId)
        
        metadata.attributes = [
            ...metadata.attributes,
            ...(Object.keys(garageData)).filter(key => isNaN(key)).map(key => ({
                trait_type: key,
                value: garageData[key].toString()
            }))
        ]
        

        res.json(metadata)


    } catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.listen(process.env.PORT)

