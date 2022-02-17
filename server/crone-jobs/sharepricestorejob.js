const { sharepriceupdate, sharepriceremain } = require("../db/query")

const sharepricestorejob=async()=>{
    console.log("inside share price job")
    const shareprice={"adani":Math.random()*1000,
    "tata":Math.random()*1000,"google":Math.random()*1000,"meta":Math.random()*1000}
    const d=await sharepriceupdate(shareprice)
    console.log(d)

}
module.exports={sharepricestorejob}